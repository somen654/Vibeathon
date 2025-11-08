"""
Farm Chat Route
AI-powered farming assistant chat interface using free Hugging Face API
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
import requests
import json

router = APIRouter()

# Hugging Face Inference API (FREE - no API key needed for public models)
HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2"


class ChatMessage(BaseModel):
    message: str
    conversation_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    conversation_id: str


# Enhanced smart responses for fallback
# Using flexible keyword matching - checks for variations
SMART_RESPONSES = {
    "water": "Water your plants early morning or late evening when evaporation is low. Check soil moisture 2 inches deep - if dry, water thoroughly. Most vegetables need 1-2 inches of water per week. For rooftop gardens, use drip irrigation to save water. Water at the base of plants, not on leaves, to prevent disease.",
    "fertiliz": "Use organic compost or balanced NPK fertilizer (10-10-10). Apply every 2-4 weeks during growing season. Avoid over-fertilizing as it can burn roots. For rooftop farms, liquid fertilizers work well in containers. Mix fertilizer into soil before planting, then side-dress during growth.",
    "pest": "Inspect plants regularly for signs of pests. Use neem oil or insecticidal soap for organic pest control. Remove affected leaves promptly. Encourage beneficial insects like ladybugs. Keep your rooftop garden clean to prevent pest buildup. Check under leaves where pests hide.",
    "sun": "Most vegetables need 6-8 hours of direct sunlight daily. Leafy greens like lettuce can tolerate partial shade (4-6 hours). Monitor plant growth - if leaves are pale, they need more sun. Use reflective surfaces to maximize light on rooftops. Rotate containers if needed.",
    "harvest": "Harvest in the morning when plants are most hydrated. Use clean, sharp tools to avoid damage. Pick regularly to encourage continuous growth. For leafy greens, harvest outer leaves first. Tomatoes should be picked when fully colored but still firm. Harvest frequently for best flavor.",
    "soil": "Use well-draining potting mix for rooftop containers. Mix compost with perlite for better drainage. Test pH - most vegetables prefer 6.0-7.0. Replace soil annually or rotate crops to prevent disease buildup. Add organic matter regularly to maintain fertility.",
    "temperatur": "Most vegetables grow best between 18-25°C. Protect from extreme heat with shade cloth. In cold weather, use row covers or move containers indoors. Monitor temperature with a thermometer. Rooftops can get very hot - provide afternoon shade in summer.",
    "space": "Give plants enough space for air circulation. Follow seed packet spacing guidelines. Overcrowding leads to disease. In containers, use one plant per pot or space according to mature size. Proper spacing prevents fungal diseases and improves yields.",
    "disease": "Prevent diseases by watering at the base, not on leaves. Ensure good air circulation. Remove diseased plants immediately. Use organic fungicides like copper-based sprays. Rotate crops to prevent soil-borne diseases. Keep tools clean and sanitized."
}


def get_smart_response(user_message: str) -> str:
    """Generate intelligent response based on keywords and context"""
    message_lower = user_message.lower()
    
    # Check for keywords (using flexible matching - checks if keyword appears anywhere)
    found_topics = []
    for keyword, response in SMART_RESPONSES.items():
        if keyword in message_lower:
            found_topics.append((keyword, response))
    
    if found_topics:
        # Return the most relevant response (first match, or combine if multiple)
        if len(found_topics) == 1:
            return found_topics[0][1]
        else:
            # If multiple topics found, return the first one (most relevant)
            return found_topics[0][1]
    
    # Check for common question patterns
    if any(word in message_lower for word in ["how often", "when", "frequency"]):
        if "water" in message_lower:
            return SMART_RESPONSES["water"]
        elif "fertiliz" in message_lower:
            return SMART_RESPONSES["fertiliz"]
    
    if any(word in message_lower for word in ["what", "which", "recommend"]):
        if "fertiliz" in message_lower or "nutrient" in message_lower:
            return SMART_RESPONSES["fertiliz"]
        elif "soil" in message_lower:
            return SMART_RESPONSES["soil"]
    
    # Default helpful response
    return "I'm FarmGPT, your rooftop farming assistant! I can help with watering, fertilizing, pests, sunlight, harvesting, soil, temperature, spacing, and disease prevention. What specific question do you have about your rooftop farm?"


def call_huggingface_api(user_message: str) -> Optional[str]:
    """Call Hugging Face Inference API (FREE - no key needed)"""
    try:
        # Format prompt for Mistral instruct model
        prompt = f"""<s>[INST] You are FarmGPT, a smart rooftop farming mentor. 
Answer the following question about urban/rooftop farming in 2-3 clear, practical sentences. 
Be friendly and encouraging. Focus on actionable advice.

Question: {user_message}

Answer: [/INST]"""
        
        payload = {
            "inputs": prompt,
            "parameters": {
                "max_new_tokens": 150,
                "temperature": 0.7,
                "return_full_text": False
            }
        }
        
        response = requests.post(
            HUGGINGFACE_API_URL,
            headers={"Content-Type": "application/json"},
            json=payload,
            timeout=15
        )
        
        if response.status_code == 200:
            result = response.json()
            # Handle different response formats
            generated_text = None
            
            if isinstance(result, list) and len(result) > 0:
                # Format: [{"generated_text": "..."}]
                generated_text = result[0].get("generated_text", "")
            elif isinstance(result, dict):
                # Format: {"generated_text": "..."}
                generated_text = result.get("generated_text", "")
            
            if generated_text:
                # Clean up the response
                generated_text = generated_text.strip()
                # Remove prompt artifacts
                if "[/INST]" in generated_text:
                    generated_text = generated_text.split("[/INST]")[-1].strip()
                if "[INST]" in generated_text:
                    generated_text = generated_text.split("[INST]")[-1].strip()
                # Remove any remaining tags
                generated_text = generated_text.replace("<s>", "").replace("</s>", "").strip()
                
                if len(generated_text) > 20:  # Only return if we got meaningful text
                    return generated_text
        elif response.status_code == 503:
            # Model is loading - use fallback
            return None
        return None
    except requests.exceptions.Timeout:
        # API timeout - use fallback
        return None
    except Exception as e:
        # Any other error - use fallback
        return None


@router.post("/farmchat", response_model=ChatResponse)
async def chat_with_farm_gpt(message: ChatMessage):
    """
    Chat with FarmGPT - your friendly farming assistant
    Uses free Hugging Face API, falls back to smart responses
    """
    try:
        # Try Hugging Face API first (FREE)
        ai_response = call_huggingface_api(message.message)
        
        if ai_response:
            return ChatResponse(
                response=ai_response,
                conversation_id=message.conversation_id or "default"
            )
        
        # Fallback to smart keyword-based responses
        response_text = get_smart_response(message.message)
        return ChatResponse(
            response=response_text,
            conversation_id=message.conversation_id or "default"
        )
        
    except Exception as e:
        # Final fallback
        return ChatResponse(
            response=get_smart_response(message.message),
            conversation_id=message.conversation_id or "default"
        )

