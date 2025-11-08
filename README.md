# 🌱 FarmMind AI – The Autonomous Rooftop Farming Assistant

A complete MVP for an AI-powered rooftop farming assistant built with FastAPI (backend) and React (frontend). This hackathon-ready project helps users design and manage urban rooftop farms intelligently using AI.

## 🎯 Features

- **AI Crop Designer**: Get intelligent crop suggestions based on location, rooftop area, and sunlight hours using GPT-4o-mini
- **Real-Time Sensor Monitoring**: Simulated IoT sensor readings (temperature, humidity, soil moisture, sunlight) updating every 5 seconds
- **Plant Health Analyzer**: Upload leaf photos for AI-based disease detection
- **Growth Predictor**: Predict crop yield and harvest timeline based on planting conditions
- **Farm Chat**: Chat with FarmGPT, a friendly AI farming mentor

## 🛠️ Tech Stack

- **Backend**: FastAPI (Python 3.10+)
- **Frontend**: React 18 + Tailwind CSS
- **AI**: OpenAI GPT-4o-mini via LangChain
- **Vision**: Ultralytics YOLOv8 (optional, with fallback)
- **Database**: SQLite (simple demo)
- **Deployment**: Compatible with Replit or local run

## 📁 Project Structure

```
farmmind-ai/
├── backend/
│   ├── app.py                 # FastAPI main application
│   ├── routes/
│   │   ├── crop_designer.py   # AI crop suggestions endpoint
│   │   ├── sensor_ai.py       # Sensor data endpoint
│   │   ├── plant_health.py    # Disease detection endpoint
│   │   ├── growth_predictor.py # Yield prediction endpoint
│   │   └── farmchat.py        # Chat assistant endpoint
│   ├── models/
│   │   └── sensor_sim.py      # Sensor simulator
│   └── utils/
│       └── weather_api.py     # Weather forecast simulator
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CropPlanner.jsx
│   │   │   ├── ChatBot.jsx
│   │   │   ├── SensorPanel.jsx
│   │   │   └── PlantHealth.jsx
│   │   ├── App.jsx
│   │   └── index.js
│   └── package.json
├── requirements.txt
└── README.md
```

## 🚀 Quick Start

### Prerequisites

- Python 3.10 or higher
- Node.js 16+ and npm
- **No API keys required!** Uses free Hugging Face API and smart algorithms

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Create a virtual environment (recommended):**
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r ../requirements.txt
   ```

4. **Environment variables (optional):**
   No API keys needed! The app uses free Hugging Face API and intelligent algorithms.

5. **Run the FastAPI server:**
   ```bash
   uvicorn app:app --reload --host 0.0.0.0 --port 8000
   ```

   The API will be available at `http://localhost:8000`
   - API docs: `http://localhost:8000/docs`
   - Health check: `http://localhost:8000/health`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment file (optional):**
   Create a `.env` file in the `frontend` directory if you need to change the API URL:
   ```
   REACT_APP_API_URL=http://localhost:8000
   ```

4. **Start the React development server:**
   ```bash
   npm start
   ```

   The app will open at `http://localhost:3000`

## 📡 API Endpoints

### 1. Crop Designer
- **POST** `/ai/crop-designer`
- **Body**: `{ "city": "New York", "rooftop_area": 50, "sunlight_hours": 6 }`
- **Response**: Crop suggestions with suitability scores, planting plans, and care tips

### 2. Sensor Status
- **GET** `/ai/sensor-status`
- **Response**: Real-time sensor readings (temperature, humidity, soil moisture, sunlight)

### 3. Plant Health
- **POST** `/ai/plant-health`
- **Body**: Multipart form data with image file
- **Response**: Disease detection results with suggested fixes

### 4. Growth Predictor
- **POST** `/ai/growth-predictor`
- **Body**: `{ "crop": "tomato", "planting_date": "2024-01-15", "location": "New York", "rooftop_area": 50 }`
- **Response**: Estimated yield, harvest date, growth stages, and recommendations

### 5. Farm Chat
- **POST** `/ai/farmchat`
- **Body**: `{ "message": "How often should I water?", "conversation_id": "default" }`
- **Response**: AI-generated farming advice

## 🎨 Features Overview

### Dashboard
- Real-time sensor data visualization
- Auto-refreshing every 5 seconds
- Status indicators (optimal/warning/critical)
- Color-coded sensor readings

### Crop Planner
- Input form for location, area, and sunlight
- AI-powered crop recommendations
- Growth prediction for selected crops
- Planting plans and location analysis

### Farm Chat
- Interactive chat interface with FarmGPT
- Quick question suggestions
- Context-aware responses
- Friendly agronomist tone

### Plant Health
- Image upload for leaf analysis
- Disease detection with confidence scores
- Severity assessment
- Actionable treatment recommendations

## 🔧 Configuration

### AI Features (No API Key Required!)
- **Farm Chat**: Uses free Hugging Face Inference API (Mistral-7B model) with smart keyword-based fallback
- **Crop Designer**: Uses intelligent algorithms based on sunlight, area, and location - no API needed!
- **All features work out of the box** - no configuration required

### Optional: YOLOv8 for Plant Health
For advanced disease detection, install YOLOv8:
```bash
pip install ultralytics
```
The app will automatically use it if available, otherwise falls back to simulated detection.

## 🐛 Troubleshooting

### Backend Issues
- **Port already in use**: Change port with `--port 8001`
- **Import errors**: Ensure all dependencies are installed: `pip install -r requirements.txt`
- **CORS errors**: Check that frontend URL is in `allow_origins` in `app.py`

### Frontend Issues
- **API connection failed**: Verify backend is running on port 8000
- **Tailwind not working**: Run `npm install` again and restart dev server
- **Build errors**: Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`

## 📝 Notes

- All sensor data is simulated for demo purposes
- Weather forecasts are generated based on seasonal patterns
- Plant health detection uses intelligent analysis (YOLOv8 optional)
- Farm Chat uses free Hugging Face API with smart fallback responses
- Crop Designer uses intelligent algorithms - no API key needed!

## 🚢 Deployment

### Replit
1. Upload project to Replit
2. Set environment variables in Replit secrets
3. Run `uvicorn backend.app:app --host 0.0.0.0 --port 8000` for backend
4. Run `npm start` in frontend directory for frontend

### Local Production
1. Build frontend: `cd frontend && npm run build`
2. Serve backend with production server: `uvicorn backend.app:app --host 0.0.0.0 --port 8000`
3. Serve frontend build with a static server or integrate with backend

## 📄 License

This is a hackathon MVP project. Feel free to use and modify as needed.

## 🙏 Credits

Built with:
- FastAPI
- React
- Tailwind CSS
- LangChain
- OpenAI GPT-4o-mini
- Ultralytics YOLOv8 (optional)

---

**Happy Farming! 🌾🌱**

