from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from model.predict import predict_rent, model, MODEL_VERSION
from schema.input_pydantic_model import RentInput
import uvicorn
import logging
import os

# --- Logging setup ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- FastAPI App ---
app = FastAPI(
    title="San Francisco Rental Price Prediction API",
    description="Predict rental prices in San Francisco using a trained ML model",
    version=MODEL_VERSION
)

allowed_origins = os.getenv("ALLOWED_ORIGINS", "").split(",")

# --- CORS Middleware ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Home Route ---
@app.get("/")
def home():
    return {
        "message": "San Francisco Rental Price Prediction"
        }

# --- Health Check Route ---
@app.get("/health")
def health_check():
    try:
        is_model_loaded = model is not None
        return {
            "status": "OK",
            "version": MODEL_VERSION,
            "model_loaded": is_model_loaded
        }
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        raise HTTPException(status_code=500, detail="Health check failed")

@app.post("/predict")
def get_rent_prediction(data: RentInput):
    try:
        logger.info(f"Received input: {data}")
        prediction_result = predict_rent(data)
        logger.info(f"Prediction result: {prediction_result}")
        return JSONResponse(
            content={
                "status": "success",
                "predicted_rent": prediction_result["predicted_rent"],
                "message": "Prediction successful"
            },
            status_code=200
        )
    except ValueError as ve:
        logger.warning(f"Invalid input: {ve}")
        raise HTTPException(status_code=422, detail=f"Invalid input: {ve}")
    except Exception as e:
        logger.error(f"Prediction failed: {e}", exc_info=True)  # <-- add exc_info=True
        raise HTTPException(status_code=500, detail="Internal Server Error")
