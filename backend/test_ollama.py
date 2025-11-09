"""
Quick test script to verify Ollama is working
Run this to test Ollama connection: python test_ollama.py
"""

import requests
import json

OLLAMA_API_URL = "http://localhost:11434"
OLLAMA_MODEL = "llama2:latest"

def test_ollama_connection():
    """Test if Ollama is accessible"""
    try:
        response = requests.get(f"{OLLAMA_API_URL}/api/tags", timeout=5)
        if response.status_code == 200:
            models = response.json()
            print(f"✅ Ollama is running!")
            print(f"Available models: {[m['name'] for m in models.get('models', [])]}")
            return True
        else:
            print(f"❌ Ollama returned status {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Cannot connect to Ollama: {e}")
        return False

def test_ollama_chat():
    """Test Ollama chat API"""
    try:
        payload = {
            "model": OLLAMA_MODEL,
            "messages": [
                {"role": "system", "content": "You are a helpful farming assistant."},
                {"role": "user", "content": "How often should I water my plants?"}
            ],
            "stream": False,
            "options": {
                "temperature": 0.7,
                "num_predict": 100,
            }
        }
        
        print(f"\n🧪 Testing Ollama chat with model: {OLLAMA_MODEL}")
        print("This may take 10-30 seconds on first run...")
        
        response = requests.post(
            f"{OLLAMA_API_URL}/api/chat",
            headers={"Content-Type": "application/json"},
            json=payload,
            timeout=60
        )
        
        if response.status_code == 200:
            result = response.json()
            if "message" in result and "content" in result["message"]:
                print(f"✅ Ollama responded successfully!")
                print(f"Response: {result['message']['content'][:200]}...")
                return True
            else:
                print(f"❌ Unexpected response format: {result}")
                return False
        elif response.status_code == 404:
            print(f"❌ Model '{OLLAMA_MODEL}' not found!")
            print(f"Try running: ollama pull llama2")
            return False
        else:
            print(f"❌ Ollama returned status {response.status_code}")
            print(f"Response: {response.text}")
            return False
    except requests.exceptions.Timeout:
        print("❌ Request timed out (60 seconds)")
        return False
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    print("=" * 60)
    print("Ollama Connection Test")
    print("=" * 60)
    
    if test_ollama_connection():
        test_ollama_chat()
    else:
        print("\n⚠️  Please make sure Ollama is running:")
        print("   1. Check if Ollama service is running")
        print("   2. Try: ollama serve")
        print("   3. Verify: ollama list")

