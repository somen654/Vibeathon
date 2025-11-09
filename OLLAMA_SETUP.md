# Ollama Setup Guide for Farm Chat

This guide will help you set up Ollama to use AI-powered chat in the Farm Chat feature.

## What is Ollama?

Ollama is a tool that runs large language models (LLMs) locally on your computer. This means you can use AI without needing an internet connection or API keys, and your data stays private.

## Installation Steps

### 1. Install Ollama

**Windows:**
- Download from: https://ollama.ai/download
- Run the installer
- Ollama will start automatically as a service

**macOS:**
```bash
# Using Homebrew
brew install ollama

# Or download from: https://ollama.ai/download
```

**Linux:**
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### 2. Start Ollama

Ollama should start automatically after installation. If not:

**Windows:**
- Check if Ollama is running in the system tray
- Or open a terminal and run: `ollama serve`

**macOS/Linux:**
```bash
ollama serve
```

### 3. Download a Model

You need to download at least one model. Recommended models for farming chat:

```bash
# Option 1: Llama 2 (7B) - Good balance of speed and quality
ollama pull llama2

# Option 2: Mistral (7B) - Fast and efficient
ollama pull mistral

# Option 3: Llama 3 (8B) - Latest and most capable
ollama pull llama3

# Option 4: Phi-3 (3.8B) - Very fast, smaller model
ollama pull phi3
```

**Note:** The first download may take several minutes depending on your internet connection. Models range from 2GB to 7GB in size.

### 4. Configure the Backend

The backend is already configured to use Ollama, but you can customize it:

**Default Configuration:**
- API URL: `http://localhost:11434`
- Model: `llama2`

**To Change the Model:**

Set an environment variable before starting the backend:

**Windows (PowerShell):**
```powershell
$env:OLLAMA_MODEL="mistral"
# Then start your backend
```

**Windows (Command Prompt):**
```cmd
set OLLAMA_MODEL=mistral
# Then start your backend
```

**macOS/Linux:**
```bash
export OLLAMA_MODEL=mistral
# Then start your backend
```

Or create a `.env` file in the backend directory:
```
OLLAMA_API_URL=http://localhost:11434
OLLAMA_MODEL=mistral
```

### 5. Verify Ollama is Running

Check if Ollama is accessible:

```bash
# List available models
ollama list

# Test Ollama API
curl http://localhost:11434/api/tags
```

Or visit in your browser: `http://localhost:11434/api/tags`

### 6. Start the Backend

Make sure your backend is running:

```bash
cd Vibeathon/backend
python -m venv venv
.\venv\Scripts\Activate  # Windows
# or: source venv/bin/activate  # macOS/Linux

pip install fastapi uvicorn requests
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

### 7. Test the Chat

1. Start your frontend: `npm start`
2. Navigate to the Farm Chat section
3. Ask a question like "How often should I water my plants?"
4. If Ollama is running, you'll get AI-powered responses
5. If Ollama is not running, you'll get fallback keyword-based responses

## Troubleshooting

### Ollama is not connecting

1. **Check if Ollama is running:**
   ```bash
   ollama list
   ```
   If this fails, start Ollama: `ollama serve`

2. **Check the API URL:**
   - Default: `http://localhost:11434`
   - Verify: `curl http://localhost:11434/api/tags`

3. **Check firewall settings:**
   - Make sure port 11434 is not blocked

### Model not found error

If you see "model not found":
```bash
# List available models
ollama list

# Pull the model if it's not listed
ollama pull llama2
```

### Slow responses

- Use a smaller model (e.g., `phi3` instead of `llama3`)
- Reduce `num_predict` in the code (currently 200) - edit `farmchat.py`
- Make sure you have enough RAM (models need 4-8GB RAM)

### Out of memory

- Use a smaller model
- Close other applications
- Consider upgrading your RAM

## Available Models

Here are some recommended models for farming chat:

| Model | Size | Speed | Quality | Command |
|-------|------|-------|---------|---------|
| Phi-3 | 2.3GB | Very Fast | Good | `ollama pull phi3` |
| Mistral | 4.1GB | Fast | Very Good | `ollama pull mistral` |
| Llama 2 | 3.8GB | Fast | Good | `ollama pull llama2` |
| Llama 3 | 4.7GB | Medium | Excellent | `ollama pull llama3` |
| Llama 3.1 | 4.7GB | Medium | Excellent | `ollama pull llama3.1` |

## Fallback Mode

If Ollama is not available, the chat will automatically use keyword-based responses. These are still helpful but not as intelligent as AI responses.

You'll see a note in the response: "(Note: Running in fallback mode. To use AI, make sure Ollama is running locally.)"

## Advanced Configuration

### Custom Ollama URL

If Ollama is running on a different machine or port:

```bash
export OLLAMA_API_URL=http://192.168.1.100:11434
```

### Multiple Models

You can switch between models by changing the `OLLAMA_MODEL` environment variable and restarting the backend.

### Conversation History

The current implementation keeps the last 5 messages for context. This can be adjusted in `farmchat.py`:

```python
messages.extend(conversation_history[-5:])  # Change -5 to adjust history
```

## Support

For issues with:
- **Ollama installation**: Visit https://ollama.ai/docs
- **Backend integration**: Check the backend logs for error messages
- **Model selection**: Try different models to find the best balance for your system

## Quick Start Summary

```bash
# 1. Install Ollama
# Download from https://ollama.ai/download

# 2. Download a model
ollama pull llama2

# 3. Verify it's working
ollama list

# 4. Start your backend (Ollama should already be running)
cd Vibeathon/backend
uvicorn app:app --reload --host 0.0.0.0 --port 8000

# 5. Start your frontend
cd Vibeathon/frontend
npm start

# 6. Test the chat!
```

Enjoy your AI-powered farming assistant! 🌱

