"""
Sensor Simulator Model
Simulates IoT sensor readings for rooftop farm monitoring
"""

import random
from datetime import datetime
from typing import Dict


class SensorSimulator:
    """
    Simulates realistic sensor readings for:
    - Temperature (Celsius)
    - Humidity (Percentage)
    - Soil Moisture (Percentage)
    - Sunlight Intensity (Lux)
    """
    
    def __init__(self):
        # Base values for realistic simulation
        self.base_temp = 22.0
        self.base_humidity = 65.0
        self.base_moisture = 55.0
        self.base_sunlight = 45000.0
        
        # Time-based variation (simulate day/night cycle)
        self.last_update = datetime.now()
    
    def get_current_readings(self) -> Dict[str, float]:
        """
        Generate current sensor readings with realistic variations
        """
        current_hour = datetime.now().hour
        
        # Simulate day/night cycle for temperature and sunlight
        if 6 <= current_hour <= 18:  # Daytime
            temp_variation = random.uniform(-2, 5)
            sunlight_variation = random.uniform(30000, 80000)
        else:  # Nighttime
            temp_variation = random.uniform(-5, 2)
            sunlight_variation = random.uniform(0, 5000)
        
        # Add random variations
        temperature = self.base_temp + temp_variation + random.uniform(-1, 1)
        humidity = self.base_humidity + random.uniform(-10, 10)
        soil_moisture = self.base_moisture + random.uniform(-15, 15)
        sunlight_intensity = max(0, sunlight_variation + random.uniform(-5000, 5000))
        
        # Clamp values to realistic ranges
        temperature = max(5, min(40, temperature))
        humidity = max(20, min(95, humidity))
        soil_moisture = max(10, min(100, soil_moisture))
        sunlight_intensity = max(0, min(120000, sunlight_intensity))
        
        return {
            "temperature": round(temperature, 1),
            "humidity": round(humidity, 1),
            "soil_moisture": round(soil_moisture, 1),
            "sunlight_intensity": round(sunlight_intensity, 0)
        }
    
    def update_base_values(self, temp: float = None, humidity: float = None, 
                          moisture: float = None, sunlight: float = None):
        """Update base values for simulation"""
        if temp is not None:
            self.base_temp = temp
        if humidity is not None:
            self.base_humidity = humidity
        if moisture is not None:
            self.base_moisture = moisture
        if sunlight is not None:
            self.base_sunlight = sunlight

