"""
FarmMind AI - FastAPI Backend Main Application
Main entry point for the FastAPI server
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import os

# Import route modules
from routes import crop_designer, sensor_ai, plant_health, growth_predictor, farmchat

# Initialize FastAPI app
app = FastAPI(
    title="FarmMind AI API",
    description="Autonomous Rooftop Farming Assistant API",
    version="1.0.0"
)

# Configure CORS to allow React frontend to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include route routers
app.include_router(crop_designer.router, prefix="/ai", tags=["Crop Designer"])
app.include_router(sensor_ai.router, prefix="/ai", tags=["Sensor AI"])
app.include_router(plant_health.router, prefix="/ai", tags=["Plant Health"])
app.include_router(growth_predictor.router, prefix="/ai", tags=["Growth Predictor"])
app.include_router(farmchat.router, prefix="/ai", tags=["Farm Chat"])


@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "FarmMind AI API is running!",
        "version": "1.0.0",
        "endpoints": {
            "crop_designer": "/ai/crop-designer",
            "sensor_status": "/ai/sensor-status",
            "plant_health": "/ai/plant-health",
            "growth_predictor": "/ai/growth-predictor",
            "farmchat": "/ai/farmchat"
        }
    }


@app.get("/health")
async def health():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

