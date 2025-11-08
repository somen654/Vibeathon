"""
Growth Predictor Route
Predicts crop yield and harvest timeline based on crop type, planting date, and weather
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from datetime import datetime, timedelta
from typing import Optional
from utils.weather_api import WeatherSimulator

router = APIRouter()

# Initialize weather simulator
weather_sim = WeatherSimulator()


class GrowthPredictionRequest(BaseModel):
    crop: str
    planting_date: str  # ISO format date
    location: str
    rooftop_area: float


class GrowthPredictionResponse(BaseModel):
    estimated_yield: str  # e.g., "15.5 kg"
    harvest_days: int
    harvest_date: str
    growth_stages: list
    weather_impact: str
    recommendations: str


# Crop database with typical growth characteristics
CROP_DATABASE = {
    "lettuce": {
        "harvest_days": 45,
        "yield_per_sqm": 2.5,  # kg per sqm
        "stages": ["Germination (7 days)", "Seedling (14 days)", "Growth (21 days)", "Harvest (45 days)"]
    },
    "tomato": {
        "harvest_days": 75,
        "yield_per_sqm": 8.0,
        "stages": ["Germination (10 days)", "Seedling (20 days)", "Flowering (40 days)", "Fruiting (60 days)", "Harvest (75 days)"]
    },
    "basil": {
        "harvest_days": 30,
        "yield_per_sqm": 1.2,
        "stages": ["Germination (7 days)", "Seedling (14 days)", "Harvest (30 days)"]
    },
    "mint": {
        "harvest_days": 60,
        "yield_per_sqm": 1.5,
        "stages": ["Germination (10 days)", "Establishment (30 days)", "Harvest (60 days)"]
    },
    "spinach": {
        "harvest_days": 40,
        "yield_per_sqm": 2.0,
        "stages": ["Germination (7 days)", "Seedling (14 days)", "Harvest (40 days)"]
    }
}


@router.post("/growth-predictor", response_model=GrowthPredictionResponse)
async def predict_growth(request: GrowthPredictionRequest):
    """
    Predict crop yield and harvest timeline
    """
    try:
        # Parse planting date
        try:
            planting_date = datetime.fromisoformat(request.planting_date.replace("Z", "+00:00"))
        except:
            planting_date = datetime.now()
        
        # Get crop info (default to lettuce if not found)
        crop_lower = request.crop.lower()
        crop_info = CROP_DATABASE.get(crop_lower, CROP_DATABASE["lettuce"])
        
        # Calculate harvest date
        harvest_date = planting_date + timedelta(days=crop_info["harvest_days"])
        
        # Estimate yield based on area
        estimated_yield_kg = request.rooftop_area * crop_info["yield_per_sqm"]
        
        # Get simulated weather data
        weather_data = weather_sim.get_forecast(request.location, crop_info["harvest_days"])
        
        # Determine weather impact
        avg_temp = sum([w["temperature"] for w in weather_data]) / len(weather_data)
        avg_rain = sum([w["rainfall"] for w in weather_data]) / len(weather_data)
        
        if 18 <= avg_temp <= 25 and 5 <= avg_rain <= 15:
            weather_impact = "Optimal conditions expected. Your crop should thrive!"
        elif avg_temp < 15 or avg_temp > 30:
            weather_impact = f"Temperature extremes expected (avg: {avg_temp:.1f}°C). Consider protective measures."
        else:
            weather_impact = "Moderate conditions. Regular monitoring recommended."
        
        # Generate recommendations
        recommendations = f"Plant {request.crop} in {request.location}. Expected harvest in {crop_info['harvest_days']} days. Maintain consistent watering and monitor for pests."
        
        return GrowthPredictionResponse(
            estimated_yield=f"{estimated_yield_kg:.1f} kg",
            harvest_days=crop_info["harvest_days"],
            harvest_date=harvest_date.isoformat(),
            growth_stages=crop_info["stages"],
            weather_impact=weather_impact,
            recommendations=recommendations
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error predicting growth: {str(e)}")

