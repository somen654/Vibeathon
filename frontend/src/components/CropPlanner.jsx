import React, { useState, useEffect } from 'react';

const CropPlanner = ({ apiUrl }) => {
  const [formData, setFormData] = useState({
    city: '',
    rooftop_area: '',
    sunlight_hours: ''
  });
  const [suggestions, setSuggestions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [growthPrediction, setGrowthPrediction] = useState(null);
  const [savedPlans, setSavedPlans] = useState(() => {
    const saved = localStorage.getItem('savedCropPlans');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedCrops, setSelectedCrops] = useState([]);
  const [showComparison, setShowComparison] = useState(false);

  // Load saved plans on mount
  useEffect(() => {
    const saved = localStorage.getItem('savedCropPlans');
    if (saved) {
      try {
        setSavedPlans(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading saved plans:', e);
      }
    }
  }, []);

  const savePlan = () => {
    if (!suggestions || !formData.city) return;
    
    const newPlan = {
      id: Date.now(),
      city: formData.city,
      area: formData.rooftop_area,
      sunlight: formData.sunlight_hours,
      suggestions: suggestions.suggestions,
      plantingPlan: suggestions.planting_plan,
      locationAnalysis: suggestions.location_analysis,
      createdAt: new Date().toISOString()
    };
    
    const updated = [...savedPlans, newPlan].slice(-10); // Keep last 10
    setSavedPlans(updated);
    localStorage.setItem('savedCropPlans', JSON.stringify(updated));
    alert('Plan saved successfully!');
  };

  const loadPlan = (plan) => {
    setFormData({
      city: plan.city,
      rooftop_area: plan.area,
      sunlight_hours: plan.sunlight
    });
    setSuggestions({
      suggestions: plan.suggestions,
      planting_plan: plan.plantingPlan,
      location_analysis: plan.locationAnalysis
    });
  };

  const compareCrops = () => {
    if (selectedCrops.length < 2) {
      alert('Please select at least 2 crops to compare');
      return;
    }
    setShowComparison(true);
  };

  const toggleCropSelection = (crop) => {
    setSelectedCrops(prev => {
      if (prev.find(c => c.crop_name === crop.crop_name)) {
        return prev.filter(c => c.crop_name !== crop.crop_name);
      }
      return [...prev, crop];
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/ai/crop-designer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          city: formData.city,
          rooftop_area: parseFloat(formData.rooftop_area),
          sunlight_hours: parseFloat(formData.sunlight_hours)
        }),
      });

      if (!response.ok) throw new Error('Failed to get crop suggestions');
      const data = await response.json();
      setSuggestions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePredictGrowth = async (crop) => {
    try {
      const response = await fetch(`${apiUrl}/ai/growth-predictor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          crop: crop,
          planting_date: new Date().toISOString(),
          location: formData.city,
          rooftop_area: parseFloat(formData.rooftop_area)
        }),
      });

      if (!response.ok) throw new Error('Failed to predict growth');
      const data = await response.json();
      setGrowthPrediction({ crop, ...data });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn relative z-10">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-amber-500 to-orange-600 rounded-2xl shadow-2xl p-8 text-white transform hover:scale-[1.01] transition-all duration-300">
        <div className="flex items-center space-x-4 mb-2">
          <span className="text-5xl animate-pulse">🌾</span>
          <div>
            <h2 className="text-4xl font-bold mb-2">AI Crop Planner</h2>
            <p className="text-amber-100 text-lg">
              Get intelligent crop suggestions based on your rooftop conditions
            </p>
          </div>
        </div>
      </div>

      {/* Input Form */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-green-100">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center space-x-2">
              <span>📍</span>
              <span>City / Location</span>
            </label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              className="w-full px-5 py-3 border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-green-300 focus:border-green-500 transition-all text-gray-700 placeholder-gray-400"
              placeholder="e.g., New York, Mumbai"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center space-x-2">
              <span>📐</span>
              <span>Rooftop Area (sqm)</span>
            </label>
            <input
              type="number"
              value={formData.rooftop_area}
              onChange={(e) => setFormData({ ...formData, rooftop_area: e.target.value })}
              className="w-full px-5 py-3 border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-green-300 focus:border-green-500 transition-all text-gray-700 placeholder-gray-400"
              placeholder="e.g., 50"
              min="1"
              step="0.1"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center space-x-2">
              <span>☀️</span>
              <span>Daily Sunlight Hours</span>
            </label>
            <input
              type="number"
              value={formData.sunlight_hours}
              onChange={(e) => setFormData({ ...formData, sunlight_hours: e.target.value })}
              className="w-full px-5 py-3 border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-green-300 focus:border-green-500 transition-all text-gray-700 placeholder-gray-400"
              placeholder="e.g., 6"
              min="0"
              max="12"
              step="0.5"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 shadow-xl transition-all duration-200 disabled:opacity-50 disabled:transform-none flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">🌱</span>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span>Get Crop Suggestions</span>
                <span>➤</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-gradient-to-r from-red-100 to-pink-100 border-2 border-red-400 text-red-700 px-6 py-4 rounded-xl shadow-lg animate-slideIn">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">⚠️</span>
            <span className="font-semibold">Error: {error}</span>
          </div>
        </div>
      )}

      {/* Saved Plans */}
      {savedPlans.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-blue-100">
          <h3 className="text-2xl font-bold text-blue-700 mb-4 flex items-center space-x-2">
            <span>💾</span>
            <span>Saved Plans ({savedPlans.length})</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedPlans.slice().reverse().map((plan) => (
              <div
                key={plan.id}
                className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => loadPlan(plan)}
              >
                <p className="font-bold text-blue-700 mb-1">{plan.city}</p>
                <p className="text-xs text-gray-600">
                  {plan.area} sqm • {plan.sunlight} hrs sun
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(plan.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Crop Suggestions */}
      {suggestions && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-green-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent flex items-center space-x-3">
                <span className="text-4xl">🌿</span>
                <span>Recommended Crops</span>
              </h3>
              <div className="flex space-x-2">
                {selectedCrops.length >= 2 && (
                  <button
                    onClick={compareCrops}
                    className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-700 transform hover:scale-105 transition-all shadow-lg"
                  >
                    ⚖️ Compare ({selectedCrops.length})
                  </button>
                )}
                <button
                  onClick={savePlan}
                  className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-blue-600 hover:to-cyan-700 transform hover:scale-105 transition-all shadow-lg"
                >
                  💾 Save Plan
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {suggestions.suggestions.map((crop, idx) => {
                const isSelected = selectedCrops.find(c => c.crop_name === crop.crop_name);
                return (
                  <div
                    key={idx}
                    onClick={() => toggleCropSelection(crop)}
                    className={`bg-gradient-to-br from-green-50 to-emerald-50 border-2 rounded-2xl p-6 hover:shadow-2xl hover:scale-105 transform transition-all duration-300 cursor-pointer ${
                      isSelected ? 'border-purple-500 ring-4 ring-purple-200' : 'border-green-200'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-2xl font-bold text-green-700">
                        {crop.crop_name}
                      </h4>
                      <div className="flex items-center space-x-2">
                        {isSelected && <span className="text-xl">✅</span>}
                        <span className="text-sm bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full font-bold shadow-lg">
                          {Math.round(crop.suitability_score * 100)}% match
                        </span>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-700">
                        <strong className="text-green-600">📅 Season:</strong> {crop.planting_season}
                      </p>
                      <p className="text-sm text-gray-700">
                        <strong className="text-green-600">📦 Yield:</strong> {crop.estimated_yield}
                      </p>
                    </div>
                    <div className="bg-white/70 rounded-xl p-3 mb-4">
                      <p className="text-sm text-gray-800">
                        <span className="text-lg">💡</span> {crop.care_tips}
                      </p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePredictGrowth(crop.crop_name);
                      }}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-3 rounded-xl text-sm font-bold hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 shadow-lg transition-all duration-200"
                    >
                      📈 Predict Growth
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Planting Plan */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl shadow-xl p-6 border-2 border-blue-200">
            <h3 className="text-2xl font-bold text-blue-700 mb-4 flex items-center space-x-2">
              <span>📋</span>
              <span>Planting Plan</span>
            </h3>
            <p className="text-gray-700 leading-relaxed">{suggestions.planting_plan}</p>
          </div>

          {/* Location Analysis */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl shadow-xl p-6 border-2 border-purple-200">
            <h3 className="text-2xl font-bold text-purple-700 mb-4 flex items-center space-x-2">
              <span>🌍</span>
              <span>Location Analysis</span>
            </h3>
            <p className="text-gray-700 leading-relaxed">{suggestions.location_analysis}</p>
          </div>
        </div>
      )}

      {/* Growth Prediction */}
      {growthPrediction && (
        <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-2 border-green-300 rounded-2xl p-8 shadow-2xl animate-fadeIn">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6 flex items-center space-x-3">
            <span className="text-4xl">📈</span>
            <span>Growth Prediction: {growthPrediction.crop}</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200">
              <p className="text-sm font-semibold text-gray-600 mb-2">Estimated Yield</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {growthPrediction.estimated_yield}
              </p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200">
              <p className="text-sm font-semibold text-gray-600 mb-2">Harvest Days</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {growthPrediction.harvest_days} days
              </p>
            </div>
          </div>
          <div className="mb-6 bg-white rounded-xl p-6 shadow-lg border-2 border-green-200">
            <p className="text-lg font-bold text-gray-700 mb-3 flex items-center space-x-2">
              <span>🌱</span>
              <span>Growth Stages:</span>
            </p>
            <ul className="space-y-2">
              {growthPrediction.growth_stages.map((stage, idx) => (
                <li key={idx} className="flex items-center space-x-2 text-gray-700">
                  <span className="text-green-500 font-bold">{idx + 1}.</span>
                  <span>{stage}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="mb-6 bg-white rounded-xl p-6 shadow-lg border-2 border-blue-200">
            <p className="text-lg font-bold text-gray-700 mb-2 flex items-center space-x-2">
              <span>🌤️</span>
              <span>Weather Impact:</span>
            </p>
            <p className="text-gray-700">{growthPrediction.weather_impact}</p>
          </div>
          <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-200">
            <p className="text-lg font-bold text-gray-700 mb-2 flex items-center space-x-2">
              <span>💡</span>
              <span>Recommendations:</span>
            </p>
            <p className="text-gray-700">{growthPrediction.recommendations}</p>
          </div>
        </div>
      )}

      {/* Crop Comparison Modal */}
      {showComparison && selectedCrops.length >= 2 && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-scaleIn">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-3xl font-bold gradient-text flex items-center space-x-2">
                <span>⚖️</span>
                <span>Crop Comparison</span>
              </h3>
              <button
                onClick={() => setShowComparison(false)}
                className="text-3xl hover:scale-110 transition-transform"
              >
                ✕
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-green-100 to-emerald-100">
                    <th className="px-4 py-3 text-left font-bold text-gray-700">Feature</th>
                    {selectedCrops.map((crop, idx) => (
                      <th key={idx} className="px-4 py-3 text-center font-bold text-green-700">
                        {crop.crop_name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-semibold">Suitability Score</td>
                    {selectedCrops.map((crop, idx) => (
                      <td key={idx} className="px-4 py-3 text-center">
                        <span className="bg-gradient-to-r from-green-400 to-emerald-500 text-white px-3 py-1 rounded-full font-bold">
                          {Math.round(crop.suitability_score * 100)}%
                        </span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="px-4 py-3 font-semibold">Planting Season</td>
                    {selectedCrops.map((crop, idx) => (
                      <td key={idx} className="px-4 py-3 text-center">{crop.planting_season}</td>
                    ))}
                  </tr>
                  <tr className="border-b">
                    <td className="px-4 py-3 font-semibold">Estimated Yield</td>
                    {selectedCrops.map((crop, idx) => (
                      <td key={idx} className="px-4 py-3 text-center font-bold text-green-600">{crop.estimated_yield}</td>
                    ))}
                  </tr>
                  <tr className="border-b bg-gray-50">
                    <td className="px-4 py-3 font-semibold">Care Tips</td>
                    {selectedCrops.map((crop, idx) => (
                      <td key={idx} className="px-4 py-3 text-center text-sm">{crop.care_tips}</td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => {
                  setShowComparison(false);
                  setSelectedCrops([]);
                }}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all shadow-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CropPlanner;

