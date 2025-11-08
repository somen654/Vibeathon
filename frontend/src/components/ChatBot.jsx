import React, { useState, useRef, useEffect } from 'react';

const ChatBot = ({ apiUrl }) => {
  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem('chatHistory');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.length > 0 ? parsed : [{
          role: 'assistant',
          content: 'Hello! I\'m FarmGPT, your rooftop farming assistant. Ask me anything about urban farming, crop care, or plant health! 🌱'
        }];
      } catch (e) {
        return [{
          role: 'assistant',
          content: 'Hello! I\'m FarmGPT, your rooftop farming assistant. Ask me anything about urban farming, crop care, or plant health! 🌱'
        }];
      }
    }
    return [{
      role: 'assistant',
      content: 'Hello! I\'m FarmGPT, your rooftop farming assistant. Ask me anything about urban farming, crop care, or plant health! 🌱'
    }];
  });
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
    // Save messages to localStorage
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  const clearChat = () => {
    const defaultMessage = [{
      role: 'assistant',
      content: 'Hello! I\'m FarmGPT, your rooftop farming assistant. Ask me anything about urban farming, crop care, or plant health! 🌱'
    }];
    setMessages(defaultMessage);
    localStorage.setItem('chatHistory', JSON.stringify(defaultMessage));
  };

  const exportChat = () => {
    const chatText = messages.map(msg => 
      `${msg.role === 'user' ? 'You' : 'FarmGPT'}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([chatText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `farmmind-chat-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMessage.trim() || loading) return;

    const userMessage = inputMessage.trim();
    setInputMessage('');
    setLoading(true);

    // Add user message to chat
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

    try {
      const response = await fetch(`${apiUrl}/ai/farmchat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversation_id: 'default'
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');
      const data = await response.json();

      // Add assistant response to chat
      setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again or check your API connection.'
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn relative z-10">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl shadow-2xl p-8 text-white transform hover:scale-[1.01] transition-all duration-300">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between">
          <div className="flex items-center space-x-4 mb-4 lg:mb-0">
            <span className="text-5xl animate-bounce">💬</span>
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-2">Farm Chat - Ask FarmGPT</h2>
              <p className="text-purple-100 text-base lg:text-lg">
                Chat with your AI farming mentor for expert advice
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={clearChat}
              className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl font-semibold hover:bg-white/30 transition-all text-sm"
            >
              🗑️ Clear
            </button>
            <button
              onClick={exportChat}
              className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl font-semibold hover:bg-white/30 transition-all text-sm"
            >
              📥 Export
            </button>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-green-100">
        <div className="h-96 overflow-y-auto mb-6 space-y-4 p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-100">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-slideIn`}
            >
              <div
                className={`max-w-xs md:max-w-md px-5 py-3 rounded-2xl shadow-lg transform hover:scale-105 transition-all duration-200 ${
                  msg.role === 'user'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white'
                    : 'bg-white border-2 border-green-200 text-gray-800'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xl">🌱</span>
                    <span className="text-xs font-semibold text-green-600">FarmGPT</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start animate-pulse">
              <div className="bg-white border-2 border-green-200 px-5 py-3 rounded-2xl shadow-lg">
                <div className="flex items-center space-x-2">
                  <span className="text-xl animate-spin">🌱</span>
                  <p className="text-sm text-gray-600 font-semibold">FarmGPT is thinking...</p>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSend} className="flex space-x-3">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask about watering, fertilizing, pests, or any farming question..."
            className="flex-1 px-5 py-3 border-2 border-green-200 rounded-xl focus:ring-4 focus:ring-green-300 focus:border-green-500 transition-all text-gray-700 placeholder-gray-400"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transform hover:scale-105 shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? (
              <span className="flex items-center space-x-2">
                <span className="animate-spin">⏳</span>
                <span>Sending...</span>
              </span>
            ) : (
              <span className="flex items-center space-x-2">
                <span>Send</span>
                <span>➤</span>
              </span>
            )}
          </button>
        </form>

        {/* Quick Suggestions */}
        <div className="mt-6 pt-6 border-t-2 border-green-200">
          <p className="text-sm font-semibold text-gray-700 mb-3 flex items-center space-x-2">
            <span>💡</span>
            <span>Quick questions:</span>
          </p>
          <div className="flex flex-wrap gap-3">
            {['How often should I water?', 'What fertilizer to use?', 'How to prevent pests?', 'Best time to harvest?'].map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => setInputMessage(suggestion)}
                className="text-sm bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-4 py-2 rounded-full hover:from-green-200 hover:to-emerald-200 transform hover:scale-105 shadow-md transition-all duration-200 font-semibold border border-green-300"
                disabled={loading}
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;

