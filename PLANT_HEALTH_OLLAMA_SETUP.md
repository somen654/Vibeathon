# Plant Health Ollama Setup Guide

The Plant Health feature now uses Ollama to identify plant diseases from uploaded images!

## Features

✅ **AI-Powered Disease Detection**: Uses Ollama to analyze plant leaf photos
✅ **Multiple Analysis Modes**: 
   - Vision models (best accuracy) - analyzes images directly
   - Text-based analysis (works with llama2) - analyzes image characteristics
   - Fallback mode - basic analysis if Ollama is unavailable

## Setup Options

### Option 1: Vision Model (Recommended - Best Accuracy)

For the best disease detection, use a vision-capable model:

```bash
# Download a vision model (choose one)
ollama pull llava        # Large, accurate (7B)
ollama pull bakllava     # Alternative vision model
ollama pull llava:7b     # Specific version
```

**Note:** Vision models are larger (4-7GB) but provide the best accuracy for image analysis.

### Option 2: Text-Based Analysis (Works with llama2)

If you only have `llama2` installed, the system will automatically:
1. Analyze image colors and characteristics
2. Create a text description
3. Use Ollama to identify diseases from the description

This works well but is less accurate than vision models.

## Configuration

The system automatically detects which models are available:

- **Vision Model**: Set `OLLAMA_VISION_MODEL` environment variable (default: `llava`)
- **Text Model**: Uses `OLLAMA_MODEL` environment variable (default: `llama2:latest`)

### Changing the Vision Model

**Windows PowerShell:**
```powershell
$env:OLLAMA_VISION_MODEL="llava"
# Restart your backend
```

**Windows Command Prompt:**
```cmd
set OLLAMA_VISION_MODEL=llava
# Restart your backend
```

**macOS/Linux:**
```bash
export OLLAMA_VISION_MODEL=llava
# Restart your backend
```

## How It Works

1. **Upload Image**: User uploads a plant leaf photo
2. **Vision Analysis** (if llava/bakllava available):
   - Image is sent directly to Ollama vision model
   - Model analyzes the image and identifies diseases
3. **Text Analysis** (if only llama2 available):
   - System analyzes image colors (green, yellow, brown, white areas)
   - Creates description of image characteristics
   - Ollama analyzes description to identify diseases
4. **Fallback** (if Ollama unavailable):
   - Uses basic image size-based analysis
   - Provides simulated disease detection

## Detected Diseases

The system can identify common plant diseases:
- **Leaf Spot** - Brown/black spots on leaves
- **Powdery Mildew** - White powdery coating
- **Rust** - Orange/brown pustules
- **Blight** - Rapid wilting and browning
- **Aphids/Pests** - Insect damage
- **Nutrient Deficiency** - Yellowing leaves
- **Root Rot** - Wilting, yellowing, soft roots

## Response Format

The system returns:
- **Status**: `healthy` or `diseased`
- **Disease Name**: Specific disease if found (e.g., "Leaf Spot")
- **Confidence**: 0.0 to 1.0 (how confident the AI is)
- **Severity**: `low`, `medium`, or `high`
- **Suggested Fix**: Detailed treatment recommendations

## Testing

1. **Start Ollama** (if not already running):
   ```bash
   ollama serve
   ```

2. **Download a vision model** (optional but recommended):
   ```bash
   ollama pull llava
   ```

3. **Start your backend**:
   ```bash
   cd Vibeathon/backend
   uvicorn app:app --reload --host 0.0.0.0 --port 8000
   ```

4. **Upload a plant photo** in the Plant Health section

5. **Check backend logs** for analysis progress:
   ```
   🔬 POST /ai/plant-health - Analyzing plant image
   🤖 Attempting Ollama analysis...
   ✅ Ollama analysis complete: diseased
      Disease: Leaf Spot
   ```

## Troubleshooting

### Vision model not found
- Error: `Vision model 'llava' not found`
- Solution: Download the model: `ollama pull llava`
- Or: System will automatically fall back to text-based analysis

### Ollama not running
- Error: `Cannot connect to Ollama`
- Solution: Start Ollama: `ollama serve`
- Or: System will use fallback analysis

### Slow responses
- Vision models can take 10-30 seconds
- Text-based analysis is faster (5-15 seconds)
- First analysis may be slower (model loading)

### Low accuracy
- Use a vision model (llava) for better accuracy
- Ensure good image quality (clear, well-lit photos)
- Close-up photos of leaves work best

## Model Recommendations

| Model | Size | Speed | Accuracy | Use Case |
|-------|------|-------|----------|----------|
| **llava** | 4.7GB | Medium | Excellent | Best for disease detection |
| **llava:7b** | 4.7GB | Medium | Excellent | Specific version |
| **bakllava** | 4.7GB | Medium | Excellent | Alternative vision model |
| **llama2** | 3.8GB | Fast | Good | Text-based analysis only |

## Quick Start

```bash
# 1. Download vision model (recommended)
ollama pull llava

# 2. Verify it's installed
ollama list

# 3. Start backend (Ollama should already be running)
cd Vibeathon/backend
uvicorn app:app --reload --host 0.0.0.0 --port 8000

# 4. Upload a plant photo in the frontend!
```

## Notes

- **No frontend changes needed**: The existing Plant Health UI works with Ollama automatically
- **Backward compatible**: Falls back to dummy analysis if Ollama is unavailable
- **Privacy**: All analysis happens locally on your machine
- **No API keys**: Completely free and local

Enjoy AI-powered plant disease detection! 🌱🔬

