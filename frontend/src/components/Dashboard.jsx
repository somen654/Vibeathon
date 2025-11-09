import React, { useState, useEffect } from 'react';
import SensorPanel from './SensorPanel';
import SensorChart from './SensorChart';

const Dashboard = ({ apiUrl }) => {
  const [sensorData, setSensorData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);

  // Load history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('sensorHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        setHistory(parsed);
        calculateAnalytics(parsed);
      } catch (e) {
        console.error('Error loading history:', e);
      }
    }
  }, []);

  // Calculate analytics from history
  const calculateAnalytics = (data) => {
    if (!data || data.length === 0) return;
    
    const temps = data.map(d => d.temperature);
    const humidities = data.map(d => d.humidity);
    const moistures = data.map(d => d.soil_moisture);
    const sunlights = data.map(d => d.sunlight_intensity);

    setAnalytics({
      temperature: {
        avg: (temps.reduce((a, b) => a + b, 0) / temps.length).toFixed(1),
        min: Math.min(...temps).toFixed(1),
        max: Math.max(...temps).toFixed(1),
        trend: temps.length > 1 ? (temps[temps.length - 1] > temps[0] ? '↑' : '↓') : '→'
      },
      humidity: {
        avg: (humidities.reduce((a, b) => a + b, 0) / humidities.length).toFixed(1),
        min: Math.min(...humidities).toFixed(1),
        max: Math.max(...humidities).toFixed(1),
        trend: humidities.length > 1 ? (humidities[humidities.length - 1] > humidities[0] ? '↑' : '↓') : '→'
      },
      soil_moisture: {
        avg: (moistures.reduce((a, b) => a + b, 0) / moistures.length).toFixed(1),
        min: Math.min(...moistures).toFixed(1),
        max: Math.max(...moistures).toFixed(1),
        trend: moistures.length > 1 ? (moistures[moistures.length - 1] > moistures[0] ? '↑' : '↓') : '→'
      },
      sunlight_intensity: {
        avg: (sunlights.reduce((a, b) => a + b, 0) / sunlights.length).toFixed(0),
        min: Math.min(...sunlights).toFixed(0),
        max: Math.max(...sunlights).toFixed(0),
        trend: sunlights.length > 1 ? (sunlights[sunlights.length - 1] > sunlights[0] ? '↑' : '↓') : '→'
      }
    });
  };

  // Fetch sensor data every 5 seconds
  useEffect(() => {
    const fetchSensorData = async () => {
      try {
        const response = await fetch(`${apiUrl}/ai/sensor-status`);
        if (!response.ok) throw new Error('Failed to fetch sensor data');
        const data = await response.json();
        setSensorData(data);
        setLoading(false);
        setError(null);

        // Add to history (keep last 50 readings)
        setHistory(prevHistory => {
          const newHistory = [
            ...prevHistory,
            {
              ...data,
              timestamp: new Date(data.timestamp)
            }
          ].slice(-50);

          localStorage.setItem('sensorHistory', JSON.stringify(newHistory));
          calculateAnalytics(newHistory);
          return newHistory;
        });
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    // Initial fetch
    fetchSensorData();

    // Set up interval for auto-refresh every 5 seconds
    const interval = setInterval(fetchSensorData, 5000);

    return () => clearInterval(interval);
  }, [apiUrl]);

  // Export data as CSV
  const exportData = () => {
    if (history.length === 0) return;
    
    const headers = ['Timestamp', 'Temperature (°C)', 'Humidity (%)', 'Soil Moisture (%)', 'Sunlight (lux)', 'Status'];
    const rows = history.map(h => [
      new Date(h.timestamp).toLocaleString(),
      h.temperature,
      h.humidity,
      h.soil_moisture,
      h.sunlight_intensity,
      h.status
    ]);
    
    const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `farmmind-sensor-data-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 animate-fadeIn relative z-10">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 rounded-3xl shadow-2xl p-8 lg:p-10 text-white transform hover:scale-[1.01] transition-all duration-300 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="relative flex flex-col lg:flex-row items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <span className="text-5xl lg:text-6xl animate-float">🌾</span>
            <div>
              <h2 className="text-3xl lg:text-5xl font-extrabold mb-2 drop-shadow-lg">Farm Dashboard</h2>
              <p className="text-green-100 text-base lg:text-lg">
                Real-time monitoring of your rooftop farm sensors
              </p>
            </div>
          </div>
          {sensorData && (
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full">
              <div className="w-3 h-3 bg-green-300 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold">Live Data</span>
            </div>
          )}
        </div>
      </div>

      {/* Smart Alerts */}
      {sensorData && (sensorData.status === 'warning' || sensorData.status === 'critical') && (
        <div className={`rounded-2xl shadow-2xl p-6 border-4 animate-bounce-in ${
          sensorData.status === 'critical'
            ? 'bg-gradient-to-r from-red-100 to-pink-100 border-red-400'
            : 'bg-gradient-to-r from-yellow-100 to-amber-100 border-yellow-400'
        }`}>
          <div className="flex items-center space-x-4">
            <span className="text-5xl">
              {sensorData.status === 'critical' ? '🚨' : '⚠️'}
            </span>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800 mb-2">
                {sensorData.status === 'critical' ? 'Critical Alert!' : 'Warning'}
              </h3>
              <p className="text-gray-700">
                {sensorData.status === 'critical' 
                  ? 'Your farm conditions require immediate attention!'
                  : 'Some sensor readings are outside optimal ranges.'}
              </p>
              <div className="mt-3 space-y-1 text-sm">
                   {(sensorData.temperature < 10 || sensorData.temperature > 35) && (
                  <p className="text-red-700">🌡️ Temperature: {sensorData.temperature}°C (Optimal: 18-25°C)</p>
                )}
                {sensorData.soil_moisture < 30 && (
                  <p className="text-orange-700">🌱 Soil Moisture: {sensorData.soil_moisture}% (Too low - needs watering)</p>
                )}
                {sensorData.soil_moisture > 80 && (
                  <p className="text-blue-700">🌱 Soil Moisture: {sensorData.soil_moisture}% (Too high - reduce watering)</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sensor Panel */}
      <SensorPanel sensorData={sensorData} loading={loading} error={error} />

      {/* Analytics Section */}
      {analytics && history.length > 0 && (
        <div className="bg-white rounded-2xl shadow-2xl p-6 lg:p-8 border-2 border-green-100 animate-fadeIn">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl lg:text-3xl font-bold gradient-text flex items-center space-x-2">
              <span>📊</span>
              <span>Analytics & Trends</span>
            </h3>
            <button
              onClick={exportData}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-xl font-semibold hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 transition-all shadow-lg"
            >
              📥 Export CSV
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border-2 border-red-200">
              <p className="text-xs font-semibold text-gray-600 mb-1">Temperature</p>
              <p className="text-2xl font-bold text-red-600">{analytics.temperature.avg}°C</p>
              <p className="text-xs text-gray-500 mt-1">
                {analytics.temperature.min}° - {analytics.temperature.max}° {analytics.temperature.trend}
              </p>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 border-2 border-blue-200">
              <p className="text-xs font-semibold text-gray-600 mb-1">Humidity</p>
              <p className="text-2xl font-bold text-blue-600">{analytics.humidity.avg}%</p>
              <p className="text-xs text-gray-500 mt-1">
                {analytics.humidity.min}% - {analytics.humidity.max}% {analytics.humidity.trend}
              </p>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200">
              <p className="text-xs font-semibold text-gray-600 mb-1">Soil Moisture</p>
              <p className="text-2xl font-bold text-green-600">{analytics.soil_moisture.avg}%</p>
              <p className="text-xs text-gray-500 mt-1">
                {analytics.soil_moisture.min}% - {analytics.soil_moisture.max}% {analytics.soil_moisture.trend}
              </p>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-amber-50 rounded-xl p-4 border-2 border-yellow-200">
              <p className="text-xs font-semibold text-gray-600 mb-1">Sunlight</p>
              <p className="text-2xl font-bold text-yellow-600">{Math.round(analytics.sunlight_intensity.avg / 1000)}k</p>
              <p className="text-xs text-gray-500 mt-1">
                {Math.round(analytics.sunlight_intensity.min / 1000)}k - {Math.round(analytics.sunlight_intensity.max / 1000)}k {analytics.sunlight_intensity.trend}
              </p>
            </div>
          </div>

          {/* Charts */}
          {history.length > 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SensorChart
                data={history.map(h => ({ value: h.temperature, timestamp: h.timestamp }))}
                type="temperature"
                label="Temperature Trend"
                color="text-red-600"
                optimalRange={{ min: 10, max: 35, optimal: 22 }}
              />
              <SensorChart
                data={history.map(h => ({ value: h.humidity, timestamp: h.timestamp }))}
                type="humidity"
                label="Humidity Trend"
                color="text-blue-600"
                optimalRange={{ min: 20, max: 90, optimal: 65 }}
              />
              <SensorChart
                data={history.map(h => ({ value: h.soil_moisture, timestamp: h.timestamp }))}
                type="soil_moisture"
                label="Soil Moisture Trend"
                color="text-green-600"
                optimalRange={{ min: 30, max: 80, optimal: 55 }}
              />
              <SensorChart
                data={history.map(h => ({ value: h.sunlight_intensity / 1000, timestamp: h.timestamp }))}
                type="sunlight"
                label="Sunlight Trend (k lux)"
                color="text-yellow-600"
                optimalRange={{ min: 10, max: 80, optimal: 45 }}
              />
            </div>
          )}
        </div>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {loading && !sensorData ? (
          <>
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl shadow-xl p-6 border-2 border-gray-200">
                <div className="skeleton h-4 w-24 mb-4 rounded"></div>
                <div className="skeleton h-8 w-32 rounded"></div>
              </div>
            ))}
          </>
        ) : (
          <>
            <div className="bg-gradient-to-br from-white via-green-50 to-emerald-50 rounded-2xl shadow-xl p-6 lg:p-8 border-2 border-green-200 hover-lift animate-scaleIn">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs lg:text-sm font-bold uppercase tracking-wider mb-2">Status</p>
                  <p className={`text-2xl lg:text-3xl font-extrabold ${
                    sensorData?.status === 'optimal' ? 'text-green-600' :
                    sensorData?.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {sensorData?.status || 'Loading...'}
                  </p>
                </div>
                <div className="text-5xl lg:text-6xl animate-bounce-in">
                  {sensorData?.status === 'optimal' ? '✅' : 
                   sensorData?.status === 'warning' ? '⚠️' : '🔴'}
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white via-blue-50 to-cyan-50 rounded-2xl shadow-xl p-6 lg:p-8 border-2 border-blue-200 hover-lift animate-scaleIn" style={{animationDelay: '0.1s'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs lg:text-sm font-bold uppercase tracking-wider mb-2">Last Updated</p>
                  <p className="text-lg lg:text-xl font-bold text-gray-800">
                    {sensorData?.timestamp 
                      ? new Date(sensorData.timestamp).toLocaleTimeString()
                      : 'N/A'}
                  </p>
                </div>
                <div className="text-5xl lg:text-6xl animate-spin-slow">🕐</div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white via-emerald-50 to-teal-50 rounded-2xl shadow-xl p-6 lg:p-8 border-2 border-emerald-200 hover-lift animate-scaleIn" style={{animationDelay: '0.2s'}}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-xs lg:text-sm font-bold uppercase tracking-wider mb-2">Farm Health</p>
                  <p className={`text-2xl lg:text-3xl font-extrabold ${
                    sensorData?.status === 'optimal' ? 'text-green-600' :
                    sensorData?.status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                  }`}>
                    {sensorData?.status === 'optimal' ? 'Excellent' : 
                     sensorData?.status === 'warning' ? 'Good' : 'Needs Attention'}
                  </p>
                </div>
                <div className="text-5xl lg:text-6xl animate-pulse">🌱</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

