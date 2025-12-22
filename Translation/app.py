from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from deep_translator import GoogleTranslator

app = FastAPI(title="Indonesian ↔ English Translator API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

class TranslateRequest(BaseModel):
    text: str
    direction: str 

@app.post("/translate")
def translate_text(req: TranslateRequest):
    if req.direction == "id-en":
        translator = GoogleTranslator(source="id", target="en")
    elif req.direction == "en-id":
        translator = GoogleTranslator(source="en", target="id")
    else:
        return {"error": "Invalid direction"}

    translated_text = translator.translate(req.text)

    return {
        "translation": translated_text
    }