import React, { useState, useEffect, useRef } from 'react';
import axios from '../../utils/axios';
import './DairyChatAI.css'; // Use the same CSS for styling

const GeminiAI = () => {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || loading) return;

    try {
      setLoading(true);
      
      // Add user message immediately
      const userMessage = {
        id: messages.length,
        text: newMessage,
        sender: 'user',
        timestamp: new Date().toLocaleTimeString()
      };
      
      setMessages(prev => [...prev, userMessage]);
      setNewMessage('');

      // Get AI response from Gemini API
      const response = await axios.post('/api/gemini/generate', { prompt: newMessage });

      if (response.data && response.data.response) {
        setMessages(prev => [...prev, {
          id: prev.length,
          text: response.data.response,
          sender: 'ai',
          timestamp: new Date().toLocaleTimeString()
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Add error message to chat
      setMessages(prev => [...prev, {
        id: prev.length,
        text: "I apologize, but I'm having trouble responding right now. Please try again later.",
        sender: 'ai',
        timestamp: new Date().toLocaleTimeString()
      }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="chat-container max-w-2xl mx-auto border-2 border-gray-300 rounded-lg shadow-lg"> 
      <div className="chat-header bg-gray-800 p-4 rounded-t-lg">
        <h2 style={{ color: 'rgb(255, 255, 255)' }}>Dairy Chat AI Assistant</h2>
      </div>
      <div className="chat-messages p-4 h-[500px] overflow-y-auto border-t border-b border-gray-200">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`message flex flex-col ${
              message.sender === 'user' 
                ? 'items-end ml-12' 
                : 'items-start mr-12'
            } mb-4`}
          >
            <div className={`message-content p-3 rounded-lg ${
              message.sender === 'user'
                ? 'bg-blue-500 text-white'
                : 'bg-green-100 text-gray-800'
            }`}>
              {message.text.split('\n').map((line, i) => (
                <p key={i}>{line}</p>
              ))}
            </div>
            <div className="message-timestamp text-xs text-gray-500 mt-1">
              {message.timestamp}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="chat-input-form p-4 border-t border-gray-200">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your question here..."
          disabled={loading}
          className="w-full p-2 border border-gray-300 rounded-lg mr-2"
        />
        <button 
          type="submit" 
          disabled={!newMessage.trim() || loading}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default GeminiAI; 