"""
Farm Chat Route
AI-powered farming assistant chat interface using Ollama (local LLM)
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict
import requests
import json
import os

router = APIRouter()

# Ollama Configuration
OLLAMA_API_URL = os.getenv("OLLAMA_API_URL", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama2:latest")  # Default model, can be changed to mistral, llama2:latest, etc.


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


def call_ollama_api(user_message: str, conversation_history: Optional[List[Dict[str, str]]] = None) -> Optional[str]:
    """
    Call Ollama API for chat completion
    Ollama must be running locally at http://localhost:11434 (default)
    """
    import logging
    import sys
    logger = logging.getLogger(__name__)
    
    try:
        # Format prompt for farming assistant
        system_prompt = """You are FarmGPT, a knowledgeable and friendly rooftop farming assistant. 
Your role is to help users with urban farming, rooftop gardening, and plant care.
Provide practical, actionable advice in 2-3 clear sentences. Be encouraging and helpful.
Focus on topics like: watering, fertilizing, pest control, harvesting, soil management, 
temperature control, spacing, and disease prevention."""
        
        # Build messages array for chat completion
        messages = [
            {"role": "system", "content": system_prompt},
        ]
        
        # Add conversation history if available
        if conversation_history:
            messages.extend(conversation_history[-5:])  # Keep last 5 messages for context
        
        # Add current user message
        messages.append({"role": "user", "content": user_message})
        
        # Prepare Ollama API request
        payload = {
            "model": OLLAMA_MODEL,
            "messages": messages,
            "stream": False,
            "options": {
                "temperature": 0.7,
                "num_predict": 200,  # Ollama uses num_predict instead of max_tokens
            }
        }
        
        # Call Ollama API
        ollama_url = f"{OLLAMA_API_URL}/api/chat"
        logger.info(f"Calling Ollama at {ollama_url} with model {OLLAMA_MODEL}")
        
        response = requests.post(
            ollama_url,
            headers={"Content-Type": "application/json"},
            json=payload,
            timeout=15  # Reduced timeout - 15 seconds should be enough
        )
        
        logger.info(f"Ollama response status: {response.status_code}")
        
        if response.status_code == 200:
            result = response.json()
            logger.info(f"Ollama response keys: {result.keys()}")
            
            # Ollama returns: {"message": {"role": "assistant", "content": "..."}, ...}
            if "message" in result and "content" in result["message"]:
                generated_text = result["message"]["content"].strip()
                logger.info(f"Generated text length: {len(generated_text)}")
                if len(generated_text) > 10:  # Only return if we got meaningful text
                    return generated_text
                else:
                    logger.warning(f"Generated text too short: {generated_text}")
            else:
                logger.warning(f"Unexpected response format: {result}")
        elif response.status_code == 404:
            # Model not found - might need to pull it
            error_msg = f"Ollama model '{OLLAMA_MODEL}' not found. Run: ollama pull {OLLAMA_MODEL}"
            logger.error(error_msg)
            print(f"Warning: {error_msg}")
            return None
        else:
            logger.error(f"Ollama API returned status {response.status_code}: {response.text}")
            return None
        return None
    except requests.exceptions.ConnectionError as e:
        # Ollama is not running
        error_msg = f"Cannot connect to Ollama at {OLLAMA_API_URL}. Make sure Ollama is running."
        logger.error(error_msg)
        print(f"Warning: {error_msg}")
        return None
    except requests.exceptions.Timeout as e:
        # API timeout - use fallback
        error_msg = "Ollama request timed out after 15 seconds"
        logger.error(error_msg)
        print(f"Warning: {error_msg}", file=sys.stderr, flush=True)
        return None
    except Exception as e:
        # Any other error - use fallback
        error_msg = f"Ollama API error: {str(e)}"
        logger.error(error_msg, exc_info=True)
        print(f"Warning: {error_msg}")
        return None


def check_ollama_available() -> bool:
    """Check if Ollama is running and accessible"""
    try:
        response = requests.get(f"{OLLAMA_API_URL}/api/tags", timeout=5)
        return response.status_code == 200
    except:
        return False


@router.post("/farmchat", response_model=ChatResponse)
async def chat_with_farm_gpt(message: ChatMessage):
    """
    Chat with FarmGPT - your friendly farming assistant
    Uses Ollama (local LLM), falls back to smart responses if Ollama is not available
    """
    import logging
    import sys
    import asyncio
    from concurrent.futures import ThreadPoolExecutor
    
    logger = logging.getLogger(__name__)
    
    # Print to console immediately for debugging
    print(f"\n{'='*60}", file=sys.stderr, flush=True)
    print(f"🔵 POST /ai/farmchat - Message received!", file=sys.stderr, flush=True)
    print(f"Message: {message.message[:100]}", file=sys.stderr, flush=True)
    print(f"{'='*60}\n", file=sys.stderr, flush=True)
    
    try:
        logger.info(f"Received chat message: {message.message[:50]}...")
        
        # Quick check if Ollama is available (with short timeout)
        print("🔍 Checking Ollama availability...", file=sys.stderr, flush=True)
        ollama_available = check_ollama_available()
        print(f"📊 Ollama available: {ollama_available}", file=sys.stderr, flush=True)
        logger.info(f"Ollama available: {ollama_available}")
        
        # If Ollama is available, try to get response with timeout
        if ollama_available:
            print(f"🤖 Attempting Ollama API call with model: {OLLAMA_MODEL}", file=sys.stderr, flush=True)
            logger.info("Attempting to call Ollama API...")
            
            # Run Ollama call in thread pool with timeout to prevent blocking
            try:
                loop = asyncio.get_event_loop()
                with ThreadPoolExecutor() as executor:
                    # Set a 20 second timeout for the Ollama call
                    ai_response = await asyncio.wait_for(
                        loop.run_in_executor(executor, call_ollama_api, message.message),
                        timeout=20.0
                    )
                
                if ai_response:
                    print(f"✅ Ollama returned response (length: {len(ai_response)})", file=sys.stderr, flush=True)
                    logger.info("Ollama API returned response successfully")
                    return ChatResponse(
                        response=ai_response,
                        conversation_id=message.conversation_id or "default"
                    )
                else:
                    print("⚠️ Ollama returned None, using fallback", file=sys.stderr, flush=True)
                    logger.warning("Ollama API did not return a response, using fallback")
            except asyncio.TimeoutError:
                print("⏱️ Ollama call timed out after 20 seconds, using fallback", file=sys.stderr, flush=True)
                logger.warning("Ollama API call timed out, using fallback")
            except Exception as e:
                print(f"❌ Ollama call error: {str(e)}", file=sys.stderr, flush=True)
                logger.error(f"Error calling Ollama: {str(e)}", exc_info=True)
        else:
            print("⚠️ Ollama not available, using fallback immediately", file=sys.stderr, flush=True)
            logger.warning("Ollama is not available, using fallback")
        
        # Fallback to smart keyword-based responses (always fast)
        print("📝 Generating fallback response...", file=sys.stderr, flush=True)
        response_text = get_smart_response(message.message)
        # Add a note that Ollama is not available
        if not ollama_available:
            response_text += "\n\n(Note: Running in fallback mode. To use AI, make sure Ollama is running locally.)"
        
        print(f"✅ Returning fallback response (length: {len(response_text)})", file=sys.stderr, flush=True)
        return ChatResponse(
            response=response_text,
            conversation_id=message.conversation_id or "default"
        )
        
    except Exception as e:
        # Log the error
        error_str = str(e)
        print(f"\n❌ ERROR: {error_str}", file=sys.stderr, flush=True)
        import traceback
        traceback.print_exc(file=sys.stderr)
        logger.error(f"Error in chat_with_farm_gpt: {error_str}", exc_info=True)
        
        # Final fallback - always return something
        error_msg = get_smart_response(message.message)
        if not check_ollama_available():
            error_msg += "\n\n(Note: Ollama is not available. Install and start Ollama to enable AI responses.)"
        else:
            error_msg += f"\n\n(Note: Error occurred: {error_str})"
        
        print("✅ Returning error fallback response", file=sys.stderr, flush=True)
        return ChatResponse(
            response=error_msg,
            conversation_id=message.conversation_id or "default"
        )


@router.get("/farmchat/status")
async def get_chat_status():
    """Check if Ollama is available and which model is configured"""
    ollama_available = check_ollama_available()
    return {
        "ollama_available": ollama_available,
        "ollama_url": OLLAMA_API_URL,
        "ollama_model": OLLAMA_MODEL,
        "status": "ready" if ollama_available else "fallback_mode",
        "message": "Ollama is running" if ollama_available else "Ollama is not running - using fallback responses"
    }

