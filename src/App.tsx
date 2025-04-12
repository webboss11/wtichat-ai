import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Flag, ExternalLink, MessageCircle, Zap, Star } from 'lucide-react';

function App() {
  const [messages, setMessages] = useState<Array<{text: string, isBot: boolean}>>([
    { text: "Namaste! I'm WTIChat, India's First AI Assistant. How can I help you today?", isBot: true }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setIsLoading(true);

    setMessages(prev => [...prev, { text: userMessage, isBot: false }]);

    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'WTIChat'
        },
        body: JSON.stringify({
          model: 'mistralai/mistral-7b-instruct',
          messages: [
            { role: 'system', content: "You are WTIChat, India's premier AI assistant. You are helpful, knowledgeable, and respectful. You provide accurate and informative responses while maintaining a professional tone." },
            ...messages.map(msg => ({
              role: msg.isBot ? 'assistant' : 'user',
              content: msg.text
            })),
            { role: 'user', content: userMessage }
          ]
        })
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      setMessages(prev => [...prev, { text: aiResponse, isBot: true }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        text: "I apologize, but I'm having trouble connecting right now. Please try again later.",
        isBot: true
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF6B6B] via-[#4ECDC4] to-[#1A1A1A] text-white relative overflow-hidden flex flex-col">
      <div className="absolute inset-0 india-pattern opacity-10"></div>
      
      {/* Header Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/30 via-white/20 to-green-500/30 blur-xl"></div>
        <div className="relative py-12 text-center">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Flag className="w-8 h-8 text-orange-400 floating-animation" />
            <h1 className="text-7xl font-bold tracking-tight perspective-text">
              <span className="inline-block transform hover:scale-110 transition-transform duration-300">
                WTIChat
              </span>
            </h1>
            <Flag className="w-8 h-8 text-green-400 floating-animation" />
          </div>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Sparkles className="w-5 h-5 text-orange-400 floating-animation" />
            <p className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-orange-400 via-white to-green-400 text-3d">
              India's First AI Assistant
            </p>
            <Sparkles className="w-5 h-5 text-green-400 floating-animation" />
          </div>
          
          {/* Features Section */}
          <div className="flex justify-center gap-6 mt-8">
            <div className="glass-morphism px-6 py-4 rounded-2xl hover-3d">
              <Zap className="w-6 h-6 text-yellow-400 mb-2 mx-auto" />
              <p className="text-sm font-medium">Lightning Fast</p>
            </div>
            <div className="glass-morphism px-6 py-4 rounded-2xl hover-3d">
              <Star className="w-6 h-6 text-purple-400 mb-2 mx-auto" />
              <p className="text-sm font-medium">Smart Responses</p>
            </div>
            <div className="glass-morphism px-6 py-4 rounded-2xl hover-3d">
              <Bot className="w-6 h-6 text-blue-400 mb-2 mx-auto" />
              <p className="text-sm font-medium">24/7 Available</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Container */}
      <div className="flex-1 max-w-5xl mx-auto p-6 w-full">
        <div className="glass-morphism rounded-3xl shadow-2xl p-6 min-h-[600px] flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto mb-6 space-y-6 pr-4 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex items-start gap-4 ${
                  message.isBot ? 'justify-start' : 'justify-end'
                }`}
              >
                {message.isBot && (
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-orange-500 to-green-500 p-0.5 hover-3d">
                    <div className="w-full h-full rounded-2xl bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <Bot className="w-6 h-6" />
                    </div>
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl px-6 py-3 hover-3d ${
                    message.isBot
                      ? 'bg-gradient-to-br from-orange-500/50 to-green-500/50 backdrop-blur-sm'
                      : 'glass-morphism'
                  }`}
                >
                  <p className="text-white text-lg">{message.text}</p>
                </div>
                {!message.isBot && (
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 p-0.5 hover-3d">
                    <div className="w-full h-full rounded-2xl bg-black/50 backdrop-blur-sm flex items-center justify-center">
                      <User className="w-6 h-6" />
                    </div>
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSubmit} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={isLoading ? "AI is thinking..." : "Type your message..."}
              disabled={isLoading}
              className="w-full glass-morphism rounded-2xl py-4 pl-6 pr-14 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50 text-lg disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isLoading}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-gradient-to-br from-orange-500 to-green-500 rounded-xl hover:opacity-90 transition-opacity hover-3d disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative py-6 text-center space-y-4">
        <div className="flex items-center justify-center gap-4">
          <a
            href="https://webtechinfinity.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass-morphism hover-3d group"
          >
            <span className="text-lg font-semibold bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
              Powered by WebTech Infinity
            </span>
            <ExternalLink className="w-4 h-4 text-white/70 group-hover:text-white transition-colors" />
          </a>
          <a
            href="https://wa.me/919140626921"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2 rounded-full glass-morphism hover-3d group"
          >
            <MessageCircle className="w-5 h-5 text-green-400 group-hover:text-green-300 transition-colors" />
            <span className="text-lg font-semibold text-green-400 group-hover:text-green-300 transition-colors">
              +91-9140626921
            </span>
          </a>
        </div>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-orange-500/0 via-white/20 to-green-500/0"></div>
      </footer>
    </div>
  );
}

export default App;