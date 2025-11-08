"""
Sensor AI Route
Returns simulated IoT sensor readings for rooftop farm monitoring
"""

from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict
from datetime import datetime
from models.sensor_sim import SensorSimulator

router = APIRouter()

# Initialize sensor simulator
sensor_sim = SensorSimulator()


class SensorData(BaseModel):
    temperature: float  # Celsius
    humidity: float  # Percentage
    soil_moisture: float  # Percentage
    sunlight_intensity: float  # Lux
    timestamp: str
    status: str  # "optimal", "warning", "critical"


@router.get("/sensor-status", response_model=SensorData)
async def get_sensor_status():
    """
    Get current simulated sensor readings
    Updates every call with realistic variations
    """
    try:
        # Get simulated sensor data
        data = sensor_sim.get_current_readings()
        
        # Determine overall status
        status = "optimal"
        if data["soil_moisture"] < 30 or data["soil_moisture"] > 80:
            status = "warning"
        if data["temperature"] < 10 or data["temperature"] > 35:
            status = "critical"
        if data["humidity"] < 20 or data["humidity"] > 90:
            status = "warning"
        
        return SensorData(
            temperature=data["temperature"],
            humidity=data["humidity"],
            soil_moisture=data["soil_moisture"],
            sunlight_intensity=data["sunlight_intensity"],
            timestamp=datetime.now().isoformat(),
            status=status
        )
    except Exception as e:
        # Fallback values
        return SensorData(
            temperature=22.5,
            humidity=65.0,
            soil_moisture=55.0,
            sunlight_intensity=45000.0,
            timestamp=datetime.now().isoformat(),
            status="optimal"
        )

