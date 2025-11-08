import React from 'react';

const SensorPanel = ({ sensorData, loading, error }) => {
  if (loading && !sensorData) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <p className="text-center text-gray-500">Loading sensor data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        Error loading sensor data: {error}
      </div>
    );
  }

  if (!sensorData) {
    return null;
  }

  // Helper function to get status color
  const getStatusColor = (value, type) => {
    if (type === 'temperature') {
      if (value < 10 || value > 35) return 'text-red-600';
      if (value < 15 || value > 30) return 'text-yellow-600';
      return 'text-green-600';
    }
    if (type === 'humidity') {
      if (value < 20 || value > 90) return 'text-yellow-600';
      return 'text-green-600';
    }
    if (type === 'soil_moisture') {
      if (value < 30 || value > 80) return 'text-yellow-600';
      return 'text-green-600';
    }
    if (type === 'sunlight') {
      if (value < 10000) return 'text-yellow-600';
      return 'text-green-600';
    }
    return 'text-gray-600';
  };

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-green-100 transform hover:shadow-3xl transition-all duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <span className="text-4xl animate-pulse">📊</span>
        <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
          Real-Time Sensor Data
        </h3>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Temperature */}
        <div className="bg-gradient-to-br from-red-50 to-orange-50 border-2 border-red-200 rounded-2xl p-6 transform hover:scale-110 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-5xl animate-bounce">🌡️</span>
            <span className={`text-3xl font-bold ${getStatusColor(sensorData.temperature, 'temperature')}`}>
              {sensorData.temperature}°C
            </span>
          </div>
          <p className="text-sm font-semibold text-gray-700 mb-1">Temperature</p>
          <p className="text-xs text-gray-500 bg-white/50 px-2 py-1 rounded-full inline-block">
            Optimal: 18-25°C
          </p>
        </div>

        {/* Humidity */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-2xl p-6 transform hover:scale-110 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-5xl animate-bounce">💧</span>
            <span className={`text-3xl font-bold ${getStatusColor(sensorData.humidity, 'humidity')}`}>
              {sensorData.humidity}%
            </span>
          </div>
          <p className="text-sm font-semibold text-gray-700 mb-1">Humidity</p>
          <p className="text-xs text-gray-500 bg-white/50 px-2 py-1 rounded-full inline-block">
            Optimal: 40-70%
          </p>
        </div>

        {/* Soil Moisture */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-2xl p-6 transform hover:scale-110 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-5xl animate-bounce">🌱</span>
            <span className={`text-3xl font-bold ${getStatusColor(sensorData.soil_moisture, 'soil_moisture')}`}>
              {sensorData.soil_moisture}%
            </span>
          </div>
          <p className="text-sm font-semibold text-gray-700 mb-1">Soil Moisture</p>
          <p className="text-xs text-gray-500 bg-white/50 px-2 py-1 rounded-full inline-block">
            Optimal: 40-70%
          </p>
        </div>

        {/* Sunlight Intensity */}
        <div className="bg-gradient-to-br from-yellow-50 to-amber-50 border-2 border-yellow-200 rounded-2xl p-6 transform hover:scale-110 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <span className="text-5xl animate-spin-slow">☀️</span>
            <span className={`text-2xl font-bold ${getStatusColor(sensorData.sunlight_intensity, 'sunlight')}`}>
              {Math.round(sensorData.sunlight_intensity / 1000)}k lux
            </span>
          </div>
          <p className="text-sm font-semibold text-gray-700 mb-1">Sunlight Intensity</p>
          <p className="text-xs text-gray-500 bg-white/50 px-2 py-1 rounded-full inline-block">
            Optimal: 20k-80k lux
          </p>
        </div>
      </div>

      {/* Status Badge */}
      <div className="mt-8 pt-6 border-t-2 border-gray-200">
        <div className="flex items-center justify-between bg-gradient-to-r from-gray-50 to-green-50 p-4 rounded-xl">
          <span className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
            <span>📈</span>
            <span>Overall Status:</span>
          </span>
          <span className={`px-6 py-3 rounded-full font-bold text-lg shadow-lg transform hover:scale-110 transition-all ${
            sensorData.status === 'optimal'
              ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
              : sensorData.status === 'warning'
              ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white'
              : 'bg-gradient-to-r from-red-400 to-pink-500 text-white'
          }`}>
            {sensorData.status.toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SensorPanel;

