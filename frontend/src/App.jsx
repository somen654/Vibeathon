import React, { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import CropPlanner from './components/CropPlanner';
import ChatBot from './components/ChatBot';
import PlantHealth from './components/PlantHealth';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Animated background particles
  useEffect(() => {
    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      const size = Math.random() * 4 + 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${Math.random() * 100}%`;
      particle.style.top = `${Math.random() * 100}%`;
      particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
      particle.style.animationDelay = `${Math.random() * 5}s`;
      document.body.appendChild(particle);
      
      setTimeout(() => particle.remove(), 30000);
    };

    const interval = setInterval(createParticle, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Enhanced Animated Background */}
      <div className="fixed inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 via-teal-50 to-cyan-50"></div>
        
        {/* Animated gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-100/30 via-emerald-100/20 to-teal-100/30 animate-gradientShift"></div>
        
        {/* Radial gradients for depth */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(34,197,94,0.15),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_70%,rgba(16,185,129,0.15),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_80%,rgba(5,150,105,0.12),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(6,182,212,0.1),transparent_50%)]"></div>
        
        {/* Pattern overlay */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        ></div>
        
        {/* Animated circles for movement */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-200/20 rounded-full blur-3xl animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-teal-200/15 rounded-full blur-3xl animate-float" style={{animationDelay: '4s'}}></div>
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(34,197,94,0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(34,197,94,0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        ></div>
      </div>

      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl shadow-2xl' 
          : 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600'
      }`}>
        <div className="container mx-auto px-4 py-4 lg:py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 lg:space-x-4">
              <div className={`text-4xl lg:text-5xl transition-transform duration-300 hover:scale-110 ${
                isScrolled ? 'animate-bounce' : 'animate-float'
              }`}>
                🌱
              </div>
              <div>
                <h1 className={`text-2xl lg:text-3xl font-extrabold transition-colors duration-300 ${
                  isScrolled 
                    ? 'gradient-text' 
                    : 'bg-gradient-to-r from-white to-green-100 bg-clip-text text-transparent'
                }`}>
                  FarmMind AI
                </h1>
                <span className={`text-xs px-3 py-1 rounded-full font-bold transition-all duration-300 ${
                  isScrolled
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    : 'bg-white/20 backdrop-blur-sm text-white'
                }`}>
                  Rooftop Farming Assistant
                </span>
              </div>
            </div>
            <nav className="hidden md:flex space-x-2">
              {[
                { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
                { id: 'crop-planner', label: '🌾 Crop Planner', icon: '🌾' },
                { id: 'chat', label: '💬 Farm Chat', icon: '💬' },
                { id: 'plant-health', label: '🔬 Plant Health', icon: '🔬' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 lg:px-5 py-2 lg:py-2.5 rounded-xl font-bold text-sm lg:text-base transition-all duration-300 transform hover:scale-105 ${
                    activeTab === tab.id
                      ? isScrolled
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl scale-105'
                        : 'bg-white text-green-600 shadow-lg scale-105'
                      : isScrolled
                        ? 'text-gray-700 hover:bg-green-50'
                        : 'text-white hover:bg-white/20 backdrop-blur-sm'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
            {/* Mobile Menu Button */}
            <button className="md:hidden text-white text-2xl">
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-24 pb-8 lg:pt-28 relative z-10">
        <div className="animate-fadeIn">
          {activeTab === 'dashboard' && <Dashboard apiUrl={API_BASE_URL} />}
          {activeTab === 'crop-planner' && <CropPlanner apiUrl={API_BASE_URL} />}
          {activeTab === 'chat' && <ChatBot apiUrl={API_BASE_URL} />}
          {activeTab === 'plant-health' && <PlantHealth apiUrl={API_BASE_URL} />}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative mt-20 bg-gradient-to-r from-green-800 via-emerald-800 to-teal-800 text-white py-12 shadow-2xl">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-3">
                <span className="text-3xl animate-float">🌾</span>
                <p className="text-2xl font-bold">FarmMind AI</p>
              </div>
              <p className="text-green-200 text-sm">
                Revolutionizing urban agriculture with AI-powered insights
              </p>
            </div>
            <div className="text-center">
              <h3 className="font-bold mb-3">Features</h3>
              <ul className="space-y-2 text-sm text-green-200">
                <li>🌱 Smart Crop Planning</li>
                <li>📊 Real-time Monitoring</li>
                <li>💬 AI Farming Assistant</li>
                <li>🔬 Disease Detection</li>
              </ul>
            </div>
            <div className="text-center md:text-right">
              <h3 className="font-bold mb-3">Tech Stack</h3>
              <p className="text-sm text-green-200">
                FastAPI • React • Tailwind CSS<br />
                Hugging Face AI • IoT Simulation
              </p>
            </div>
          </div>
          <div className="border-t border-green-700 pt-6 text-center">
            <p className="text-sm text-green-200">
              © 2024 FarmMind AI | Powered by Free AI Models & IoT Simulation | Built for Replit Hackathon
            </p>
            <div className="flex justify-center space-x-4 mt-4">
              <span className="text-xs bg-green-700 px-3 py-1 rounded-full">🚀 Hackathon MVP</span>
              <span className="text-xs bg-emerald-700 px-3 py-1 rounded-full">🌍 Global Ready</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;

