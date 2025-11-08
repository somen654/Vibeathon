# 🚀 Quick Start Guide

## Prerequisites Check
- ✅ Python 3.10+ installed
- ✅ Node.js 16+ and npm installed
- ⚠️ OpenAI API key (optional - app works without it)

## Step-by-Step Setup

### 1. Backend Setup (Terminal 1)

```bash
# Navigate to backend
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r ../requirements.txt

# (Optional) Set OpenAI API key
# Create .env file with: OPENAI_API_KEY=your_key_here

# Run server
uvicorn app:app --reload --host 0.0.0.0 --port 8000
```

Backend will be available at: `http://localhost:8000`
API docs: `http://localhost:8000/docs`

### 2. Frontend Setup (Terminal 2)

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# (Optional) Set API URL in .env file
# REACT_APP_API_URL=http://localhost:8000

# Start React app
npm start
```

Frontend will open at: `http://localhost:3000`

## Testing the App

1. **Dashboard**: View real-time sensor data (updates every 5 seconds)
2. **Crop Planner**: Enter location, area, and sunlight → Get AI crop suggestions
3. **Farm Chat**: Ask farming questions to FarmGPT
4. **Plant Health**: Upload a leaf photo for disease detection

## Troubleshooting

### Backend won't start
- Check Python version: `python --version` (needs 3.10+)
- Verify dependencies: `pip list`
- Check port 8000 is available

### Frontend won't start
- Check Node version: `node --version` (needs 16+)
- Clear cache: `rm -rf node_modules && npm install`
- Check port 3000 is available

### API connection errors
- Verify backend is running on port 8000
- Check CORS settings in `backend/app.py`
- Verify `REACT_APP_API_URL` in frontend `.env`

### GPT features not working
- App works with dummy data if no API key
- To enable GPT: Add `OPENAI_API_KEY` to `backend/.env`
- Restart backend after adding API key

## Next Steps

- Read full documentation in `README.md`
- Explore API endpoints at `http://localhost:8000/docs`
- Customize colors in `frontend/tailwind.config.js`
- Add more crops to `backend/routes/growth_predictor.py`

Happy hacking! 🌱

