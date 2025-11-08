import React, { useState, useEffect } from 'react';

const PlantHealth = ({ apiUrl }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState(() => {
    const saved = localStorage.getItem('plantHealthHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const saved = localStorage.getItem('plantHealthHistory');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Error loading plant health history:', e);
      }
    }
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setAnalysis(null);
      setError(null);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch(`${apiUrl}/ai/plant-health`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to analyze image');
      const data = await response.json();
      setAnalysis(data);
      
      // Save to history
      const newRecord = {
        id: Date.now(),
        image: preview,
        analysis: data,
        timestamp: new Date().toISOString()
      };
      const updatedHistory = [...history, newRecord].slice(-20); // Keep last 20
      setHistory(updatedHistory);
      localStorage.setItem('plantHealthHistory', JSON.stringify(updatedHistory));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn relative z-10">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-teal-500 to-cyan-600 rounded-2xl shadow-2xl p-8 text-white transform hover:scale-[1.01] transition-all duration-300">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <span className="text-5xl animate-pulse">🔬</span>
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-2">Plant Health Analyzer</h2>
              <p className="text-teal-100 text-base lg:text-lg">
                Upload a photo of your plant leaves for AI-powered disease detection
              </p>
            </div>
          </div>
          {history.length > 0 && (
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="text-sm font-semibold">
                📚 {history.length} Previous Analysis{history.length !== 1 ? 'es' : ''}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* History Section */}
      {history.length > 0 && (
        <div className="bg-white rounded-2xl shadow-xl p-6 border-2 border-teal-100">
          <h3 className="text-2xl font-bold text-teal-700 mb-4 flex items-center space-x-2">
            <span>📚</span>
            <span>Analysis History</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {history.slice().reverse().map((record) => (
              <div
                key={record.id}
                className="bg-gradient-to-br from-teal-50 to-cyan-50 border-2 border-teal-200 rounded-xl p-4 hover:shadow-lg transition-all cursor-pointer"
                onClick={() => {
                  setAnalysis(record.analysis);
                  setPreview(record.image);
                }}
              >
                <img
                  src={record.image}
                  alt="Previous analysis"
                  className="w-full h-24 object-cover rounded-lg mb-2"
                />
                <p className={`text-xs font-bold ${
                  record.analysis.status === 'healthy' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {record.analysis.status === 'healthy' ? '✅ Healthy' : '⚠️ ' + (record.analysis.disease_name || 'Diseased')}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(record.timestamp).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Section */}
      <div className="bg-white rounded-2xl shadow-2xl p-8 border-2 border-green-100">
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3 flex items-center space-x-2">
              <span>📸</span>
              <span>Upload Leaf Photo</span>
            </label>
            <div className="border-2 border-dashed border-green-300 rounded-xl p-8 bg-gradient-to-br from-green-50 to-emerald-50 hover:border-green-500 transition-all">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-bold file:bg-gradient-to-r file:from-green-500 file:to-emerald-600 file:text-white hover:file:from-green-600 hover:file:to-emerald-700 file:cursor-pointer file:shadow-lg file:transform file:hover:scale-105 file:transition-all"
              />
            </div>
          </div>

          {preview && (
            <div className="mt-6 animate-fadeIn">
              <p className="text-sm font-bold text-gray-700 mb-3 flex items-center space-x-2">
                <span>🖼️</span>
                <span>Preview:</span>
              </p>
              <div className="relative">
                <img
                  src={preview}
                  alt="Preview"
                  className="max-w-md rounded-2xl border-4 border-green-200 shadow-xl transform hover:scale-105 transition-all duration-300"
                />
                <div className="absolute top-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                  Ready to Analyze
                </div>
              </div>
            </div>
          )}

          <button
            onClick={handleAnalyze}
            disabled={!selectedFile || loading}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <span className="animate-spin">🔍</span>
                <span>Analyzing...</span>
              </>
            ) : (
              <>
                <span>Analyze Plant Health</span>
                <span>➤</span>
              </>
            )}
          </button>
        </div>
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

      {/* Analysis Results */}
      {analysis && (
        <div className={`rounded-2xl shadow-2xl p-8 border-4 animate-fadeIn ${
          analysis.status === 'healthy'
            ? 'bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 border-green-400'
            : 'bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 border-yellow-400'
        }`}>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-6 flex items-center space-x-3">
            <span className="text-4xl">📊</span>
            <span>Analysis Results</span>
          </h3>
          
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-green-200">
              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-gray-700 flex items-center space-x-2">
                  <span>📈</span>
                  <span>Status:</span>
                </span>
                <span className={`px-6 py-3 rounded-full font-bold text-lg shadow-lg ${
                  analysis.status === 'healthy'
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                    : 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white'
                }`}>
                  {analysis.status === 'healthy' ? '✅ Healthy' : '⚠️ Diseased'}
                </span>
              </div>
            </div>

            {analysis.disease_name && (
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-red-200">
                <span className="text-xl font-bold text-gray-700 flex items-center space-x-2 mb-2">
                  <span>🦠</span>
                  <span>Disease Detected:</span>
                </span>
                <p className="text-3xl text-red-600 font-bold mt-2">
                  {analysis.disease_name}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-blue-200">
                <span className="text-lg font-bold text-gray-700 flex items-center space-x-2 mb-2">
                  <span>🎯</span>
                  <span>Confidence:</span>
                </span>
                <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mt-2">
                  {Math.round(analysis.confidence * 100)}%
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-200">
                <span className="text-lg font-bold text-gray-700 flex items-center space-x-2 mb-2">
                  <span>⚡</span>
                  <span>Severity:</span>
                </span>
                <p className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mt-2 capitalize">
                  {analysis.severity}
                </p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-white to-green-50 rounded-xl p-6 shadow-lg border-2 border-green-300">
              <span className="text-xl font-bold text-gray-700 flex items-center space-x-2 mb-3">
                <span>💡</span>
                <span>Suggested Fix:</span>
              </span>
              <p className="text-gray-800 leading-relaxed text-lg">{analysis.suggested_fix}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlantHealth;

