"""
Weather API Simulator
Simulates weather forecast data for growth prediction
"""

import random
from typing import List, Dict
from datetime import datetime, timedelta


class WeatherSimulator:
    """
    Simulates weather forecast data for a given location
    Returns temperature, rainfall, and conditions
    """
    
    def __init__(self):
        # Base weather patterns by season (simplified)
        self.seasonal_temps = {
            "spring": (15, 25),
            "summer": (25, 35),
            "autumn": (10, 20),
            "winter": (5, 15)
        }
    
    def get_season(self, days_ahead: int = 0) -> str:
        """Determine current season (simplified)"""
        current_month = (datetime.now() + timedelta(days=days_ahead)).month
        if current_month in [12, 1, 2]:
            return "winter"
        elif current_month in [3, 4, 5]:
            return "spring"
        elif current_month in [6, 7, 8]:
            return "summer"
        else:
            return "autumn"
    
    def get_forecast(self, location: str, days: int = 30) -> List[Dict]:
        """
        Generate weather forecast for specified number of days
        Returns list of daily weather data
        """
        forecast = []
        
        for day in range(days):
            season = self.get_season(day)
            temp_range = self.seasonal_temps.get(season, (15, 25))
            
            # Generate daily weather
            temperature = random.uniform(temp_range[0], temp_range[1])
            rainfall = random.uniform(0, 20) if random.random() > 0.7 else 0  # 30% chance of rain
            humidity = random.uniform(40, 80)
            
            # Determine conditions
            if rainfall > 5:
                conditions = "rainy"
            elif temperature > 28:
                conditions = "sunny"
            elif temperature < 10:
                conditions = "cloudy"
            else:
                conditions = "partly_cloudy"
            
            forecast.append({
                "date": (datetime.now() + timedelta(days=day)).isoformat(),
                "temperature": round(temperature, 1),
                "rainfall": round(rainfall, 1),
                "humidity": round(humidity, 1),
                "conditions": conditions
            })
        
        return forecast
    
    def get_current_weather(self, location: str) -> Dict:
        """Get current weather for location"""
        season = self.get_season()
        temp_range = self.seasonal_temps.get(season, (15, 25))
        
        return {
            "temperature": round(random.uniform(temp_range[0], temp_range[1]), 1),
            "humidity": round(random.uniform(40, 80), 1),
            "conditions": "partly_cloudy",
            "location": location
        }

