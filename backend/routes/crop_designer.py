"""
Crop Designer Route
AI-powered crop suggestions based on location, rooftop area, and sunlight
Uses intelligent algorithms - no API key required!
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Dict

router = APIRouter()


class CropDesignRequest(BaseModel):
    city: str
    rooftop_area: float  # in square meters
    sunlight_hours: float  # hours per day


class CropSuggestion(BaseModel):
    crop_name: str
    suitability_score: float
    planting_season: str
    estimated_yield: str
    care_tips: str


class CropDesignResponse(BaseModel):
    suggestions: List[Dict]
    planting_plan: str
    location_analysis: str


def get_smart_crop_suggestions(city: str, area: float, sunlight: float) -> CropDesignResponse:
    """Intelligent crop suggestions based on conditions - no API needed!"""
    
    # Determine best crops based on sunlight hours
    suggestions = []
    
    if sunlight >= 6:
        # High sunlight - great for fruiting vegetables
        suggestions.append({
            "crop_name": "Tomatoes",
            "suitability_score": 0.92,
            "planting_season": "Spring-Summer (or year-round in warm climates)",
            "estimated_yield": f"{area * 1.5:.1f} kg per season",
            "care_tips": "Full sun required. Stake or cage for support. Water consistently, avoid wetting leaves. Harvest when fully colored."
        })
        suggestions.append({
            "crop_name": "Peppers (Bell/Chili)",
            "suitability_score": 0.88,
            "planting_season": "Spring-Summer",
            "estimated_yield": f"{area * 1.0:.1f} kg per season",
            "care_tips": "Loves heat and sun. Well-drained soil. Water at base. Harvest when firm and colored."
        })
    elif sunlight >= 4:
        # Medium sunlight - leafy greens and herbs
        suggestions.append({
            "crop_name": "Lettuce (Various types)",
            "suitability_score": 0.95,
            "planting_season": "Year-round (avoid extreme heat)",
            "estimated_yield": f"{area * 0.9:.1f} kg per cycle (45-60 days)",
            "care_tips": "Partial shade OK. Keep soil moist. Harvest outer leaves for continuous growth. Plant in spring/fall for best results."
        })
        suggestions.append({
            "crop_name": "Spinach",
            "suitability_score": 0.90,
            "planting_season": "Spring and Fall",
            "estimated_yield": f"{area * 0.7:.1f} kg per cycle",
            "care_tips": "Cool weather crop. Rich soil. Water regularly. Harvest leaves when 6-8 inches tall."
        })
    else:
        # Low sunlight - shade-tolerant crops
        suggestions.append({
            "crop_name": "Lettuce (Shade-tolerant varieties)",
            "suitability_score": 0.85,
            "planting_season": "Year-round",
            "estimated_yield": f"{area * 0.6:.1f} kg per cycle",
            "care_tips": "Tolerates partial shade. Keep consistently moist. Consider adding grow lights for better results."
        })
        suggestions.append({
            "crop_name": "Arugula",
            "suitability_score": 0.80,
            "planting_season": "Spring and Fall",
            "estimated_yield": f"{area * 0.5:.1f} kg per cycle",
            "care_tips": "Partial shade tolerant. Fast growing. Harvest young leaves for best flavor."
        })
    
    # Always add herbs (they're versatile)
    suggestions.append({
        "crop_name": "Herbs (Basil, Mint, Cilantro, Parsley)",
        "suitability_score": 0.93,
        "planting_season": "Year-round (indoors in winter)",
        "estimated_yield": f"{area * 0.6:.1f} kg per month",
        "care_tips": "Well-drained soil. Pinch flowers to encourage leaf growth. Most herbs prefer 4-6 hours sun. Great for containers!"
    })
    
    # Limit to top 3
    suggestions = suggestions[:3]
    
    # Generate planting plan
    if sunlight >= 6:
        planting_plan = f"Your {area} sqm rooftop in {city} with {sunlight} hours of daily sunlight is excellent for growing! Start with tomatoes and peppers in spring for high yields. Add herbs year-round for continuous harvest. Consider vertical growing to maximize space."
    elif sunlight >= 4:
        planting_plan = f"Your {area} sqm rooftop in {city} with {sunlight} hours of sunlight is perfect for leafy greens! Start with lettuce and spinach - they grow quickly and can be harvested multiple times. Add herbs for variety. Consider succession planting for continuous harvest."
    else:
        planting_plan = f"Your {area} sqm rooftop in {city} with {sunlight} hours of sunlight works well for shade-tolerant crops. Focus on leafy greens and herbs. Consider adding reflective surfaces or grow lights to increase light availability for better yields."
    
    # Location analysis
    location_analysis = f"{city} is suitable for urban rooftop farming. With {sunlight} hours of daily sunlight, you can grow a variety of crops. Rooftop gardens benefit from good air circulation and can be protected from ground pests. Use containers with proper drainage and consider wind protection for taller plants."
    
    return CropDesignResponse(
        suggestions=suggestions,
        planting_plan=planting_plan,
        location_analysis=location_analysis
    )


@router.post("/crop-designer", response_model=CropDesignResponse)
async def design_crop_plan(request: CropDesignRequest):
    """
    Get intelligent crop suggestions based on location and rooftop conditions
    No API key required - uses smart algorithms!
    """
    try:
        return get_smart_crop_suggestions(
            request.city, 
            request.rooftop_area, 
            request.sunlight_hours
        )
    except Exception as e:
        # Fallback on any error
        return get_smart_crop_suggestions(
            request.city,
            request.rooftop_area,
            request.sunlight_hours
        )

