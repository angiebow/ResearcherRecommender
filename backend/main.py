import pickle
import numpy as np
import pandas as pd
import torch
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from transformers import AutoTokenizer, AutoModel
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity
from scipy.spatial.distance import hamming, minkowski, jaccard
from scipy.special import softmax, kl_div
from tqdm import tqdm

def mean_pooling(model_output, attention_mask):
    token_embeddings = model_output[0]
    input_mask_expanded = attention_mask.unsqueeze(-1).expand(token_embeddings.size()).float()
    sum_embeddings = torch.sum(token_embeddings * input_mask_expanded, 1)
    sum_mask = torch.clamp(input_mask_expanded.sum(1), min=1e-9)
    return sum_embeddings / sum_mask

def binarize_vector(vector, threshold=0.0):
    return (vector > threshold).astype(bool)

def l2_normalize(vector):
    norm = np.linalg.norm(vector)
    return vector / norm if norm != 0 else vector

app = FastAPI(title="Researcher Recommendation API")

origins = ["*"] 
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Query(BaseModel):
    topic: str
    model: str
    metric: str

MODEL_MAPPING = {
    "BERT": {"name": 'bert-base-multilingual-cased', "type": "transformers"},
    "DistilBERT": {"name": 'sentence-transformers/distilbert-base-nli-stsb-mean-tokens', "type": "transformers"},
    "Albert": {"name": 'albert-base-v2', "type": "transformers"},
    "XLNet": {"name": 'xlnet-base-cased', "type": "transformers"},
    "MPNet": {"name": 'sentence-transformers/all-mpnet-base-v2', "type": "sentence-transformers"},
}
EMBEDDING_MAPPING = {
    "BERT": "data/BERTResearcher.pkl",
    "DistilBERT": "data/DistilBERTResearcher.pkl",
    "Albert": "data/AlbertResearcher.pkl",
    "XLNet": "data/XLNetResearcher.pkl",
    "MPNet": "data/MPNetResearcher.pkl",
}

loaded_models = {}
loaded_embeddings = {}
researcher_to_center_map = {}
top_topics_map = {}

@app.on_event("startup")
def load_data_on_startup():
    """Load all necessary data files into memory when the server starts."""
    print("--- Server starting up: Pre-loading data... ---")
    for model_name, file_path in EMBEDDING_MAPPING.items():
        try:
            with open(file_path, 'rb') as f:
                raw_data = pickle.load(f)
                loaded_embeddings[model_name] = {k.strip(): v for k, v in raw_data.items()}
            print(f"✅ Loaded embeddings for: {model_name}")
        except FileNotFoundError:
            print(f"⚠️ WARNING: Embedding file not found for {model_name} at '{file_path}'")

    try:
        df_metadata = pd.read_csv('data/MergedResearchCenterWithTopic.csv')
        global researcher_to_center_map
        researcher_to_center_map = pd.Series(df_metadata.ResearchCenter.values, index=df_metadata.Researcher.str.strip()).to_dict()
        print("✅ Loaded researcher-to-center metadata.")
    except FileNotFoundError:
        print("⚠️ WARNING: Metadata file 'MergedResearchCenterWithTopic.csv' not found.")
    
    try:
        csv_to_load = 'data/processed_data.csv' 
        
        researcher_topic_df = pd.read_csv(csv_to_load) 
        
        researcher_topic_df['ResearcherName'] = researcher_topic_df['ResearcherName'].str.strip()
        
        global top_topics_map
        
        def get_top_topics(group, n=4):
            return group.nlargest(n, 'Percentage')['TopicName'].tolist()

        top_topics_map = researcher_topic_df.groupby('ResearcherName').apply(get_top_topics).to_dict()
        
        print("✅ Loaded top topics map for all researchers.")

    except FileNotFoundError:
        print(f"⚠️ WARNING: File '{csv_to_load}' not found. Top topics will not be available.")
    except KeyError as e:
        print(f"❌ CRITICAL ERROR: A required column is missing from '{csv_to_load}'. Missing column: {e}")
    except Exception as e:
        print(f"⚠️ Error loading top topic map: {e}")

    print("--- Startup complete. ---")


@app.post("/recommend")
def get_recommendations(query: Query):
    model_config = MODEL_MAPPING.get(query.model)
    embedding_data = loaded_embeddings.get(query.model)

    if not model_config or not embedding_data:
        return {"error": f"Model '{query.model}' or its embeddings are not available."}

    model_name = model_config["name"]
    if model_name not in loaded_models:
        print(f"🔄 Loading model for the first time: {model_name}")
        if model_config["type"] == "transformers":
            loaded_models[model_name] = {
                "tokenizer": AutoTokenizer.from_pretrained(model_name),
                "model": AutoModel.from_pretrained(model_name)
            }
        else: 
            loaded_models[model_name] = SentenceTransformer(model_name)
        print(f"✅ Model cached: {model_name}")

    if model_config["type"] == "transformers":
        tokenizer = loaded_models[model_name]["tokenizer"]
        model = loaded_models[model_name]["model"]
        encoded_input = tokenizer(query.topic, padding=True, truncation=True, return_tensors='pt')
        with torch.no_grad():
            model_output = model(**encoded_input)
        query_vector = mean_pooling(model_output, encoded_input['attention_mask']).cpu().numpy()[0]
    else: 
        model = loaded_models[model_name]
        query_vector = model.encode(query.topic)
    
    researcher_names = list(embedding_data.keys())
    researcher_vectors = np.array(list(embedding_data.values()))

    results = []
    metric = query.metric
    print(f"Calculating with Metric: {metric}")

    if metric == 'Cosine Similarity':
        scores = cosine_similarity([query_vector], researcher_vectors)[0]
        results = sorted(zip(researcher_names, scores), key=lambda item: item[1], reverse=True)
    elif metric == 'Minkowski':
        scores = [minkowski(query_vector, vec, p=3) for vec in researcher_vectors]
        results = sorted(zip(researcher_names, scores), key=lambda item: item[1], reverse=False)
    elif metric == 'Hamming':
        binarized_query = binarize_vector(query_vector)
        distances = [hamming(binarized_query, binarize_vector(vec)) for vec in researcher_vectors]
        scores = [1 - d for d in distances]
        results = sorted(zip(researcher_names, scores), key=lambda item: item[1], reverse=True)
    elif metric == 'Jaccard':
        binarized_query = binarize_vector(query_vector)
        distances = [jaccard(binarized_query, binarize_vector(vec)) for vec in researcher_vectors]
        scores = [1 - d for d in distances]
        results = sorted(zip(researcher_names, scores), key=lambda item: item[1], reverse=True)
    elif metric == 'Kullback-Leibler':
        query_prob = softmax(l2_normalize(query_vector))
        scores = []
        for vec in researcher_vectors:
            researcher_prob = softmax(l2_normalize(vec))
            divergence = kl_div(query_prob, researcher_prob).sum()
            scores.append(divergence)
        results = sorted(zip(researcher_names, scores), key=lambda item: item[1], reverse=False)

    top_10 = results[:10]
    
    formatted_results = []
    for name, score in top_10:
        clean_name = name.strip()
        faculty = researcher_to_center_map.get(clean_name, "Unknown Center") 
        
        focus_topics = top_topics_map.get(clean_name, []) 
        
        formatted_results.append({
            "name": name, 
            "score": float(score), 
            "faculty": faculty,
            "focus_topics": focus_topics 
        })
    
    return {"recommendations": formatted_results}