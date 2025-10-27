# backend/main.py
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware 

app = FastAPI(title="Researcher Recommendation API")

origins = [
    "http://localhost:3000", 
]
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

@app.get("/")
def read_root():
    return {"message": "Welcome to the Researcher Recommendation API!"}

@app.post("/recommend")
def get_recommendations(query: Query):
    print(f"Received query: Topic='{query.topic}', Model='{query.model}', Metric='{query.metric}'")

    mock_recommendations = [
        {"name": "Zakiatul Wildani, S.Si., M.Si.", "score": 0.6617, "faculty": "Science and Data Analytics"},
        {"name": "Belinda Ulfa Aulia, ST, M.Sc.", "score": 0.6378, "faculty": "Civil Engineering"},
        {"name": "Soedarso Soedarso, Dr., S.S., M.Hum.", "score": 0.6260, "faculty": "Creative Design"},
        {"name": "Sri Pingit Wulandari, Ir., M.Si.", "score": 0.6259, "faculty": "Marine Technology"},
    ]

    return {"recommendations": mock_recommendations}