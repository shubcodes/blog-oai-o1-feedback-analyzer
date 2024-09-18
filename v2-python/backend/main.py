# backend/main.py

import os
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import requests
import json
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables from .env file (if exists)
load_dotenv()

app = FastAPI()

# Enable CORS for all origins (adjust as needed for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Fireworks API Key from environment variable
FIREWORKS_API_KEY = os.getenv("FIREWORKS_API_KEY")

if not FIREWORKS_API_KEY:
    raise ValueError("FIREWORKS_API_KEY environment variable not set.")

# Fireworks AI API Endpoint
FIREWORKS_API_URL = "https://api.fireworks.ai/inference/v1/chat/completions"

# Define Pydantic model for /chat endpoint
class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(chat_request: ChatRequest):
    message = chat_request.message

    if not message:
        raise HTTPException(status_code=400, detail="Message is required.")

    # Log to verify API Key access
    print('Fireworks API Key:', 'Available' if FIREWORKS_API_KEY else 'Not Set')

    # Prepare the request payload
    payload = {
        "model": "accounts/fireworks/models/llama-v3p1-8b-instruct",
        "messages": [{"role": "user", "content": message}]
    }

    headers = {
        "Authorization": f"Bearer {FIREWORKS_API_KEY}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(FIREWORKS_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        reply = data["choices"][0]["message"]["content"].strip()
        return {"reply": reply}
    except requests.exceptions.HTTPError as http_err:
        error_detail = response.json() if response.content else str(http_err)
        raise HTTPException(status_code=response.status_code, detail=error_detail)
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))

@app.post("/uploadTranscript")
async def upload_transcript(file: UploadFile = File(...)):
    if not file:
        raise HTTPException(status_code=400, detail="Transcript file is required.")

    try:
        contents = await file.read()
        transcript_content = contents.decode('utf-8')

        headers = {
            "Authorization": f"Bearer {FIREWORKS_API_KEY}",
            "Content-Type": "application/json"
        }

        prompt = f"Analyze the following customer meeting transcript and provide a summary, list of pain points, and feature requests mentioned. Output the results in JSON format.\n\nTranscript:\n{transcript_content}"

        payload = {
            "model": "accounts/fireworks/models/llama-v3p1-8b-instruct",  # Adjust model as needed
            "messages": [{"role": "user", "content": prompt}]
        }

        response = requests.post(FIREWORKS_API_URL, headers=headers, json=payload)
        response.raise_for_status()
        data = response.json()
        response_text = data["choices"][0]["message"]["content"].strip()

        # Attempt to parse JSON
        try:
            processed_data = json.loads(response_text)
        except json.JSONDecodeError:
            # Attempt to extract JSON from the response
            json_start = response_text.find("{")
            json_end = response_text.rfind("}") + 1
            json_string = response_text[json_start:json_end]
            processed_data = json.loads(json_string)

        # TODO: Store `processed_data` in your database (e.g., Firestore)
        # Since authentication is to be added later, this part is left as a placeholder.

        return {"success": True, "data": processed_data}

    except requests.exceptions.HTTPError as http_err:
        error_detail = response.json() if response.content else str(http_err)
        raise HTTPException(status_code=response.status_code, detail=error_detail)
    except Exception as err:
        raise HTTPException(status_code=500, detail=str(err))
