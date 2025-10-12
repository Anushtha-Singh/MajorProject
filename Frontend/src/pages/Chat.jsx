import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import YojnaSaathi from '../components/YojnaSaathi';
import { ArrowLeft } from 'lucide-react';

const Chat = () => {
  const navigate = useNavigate();
  const [isFullPage, setIsFullPage] = useState(true);

  const handleToggleFullPage = () => {
    setIsFullPage(!isFullPage);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Go back to home"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">YojnaSaathi Chat</h1>
              <p className="text-sm text-gray-600">Your multilingual government scheme assistant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Chatbot */}
      <div className="h-[calc(100vh-80px)]">
        <YojnaSaathi 
          isFullPage={isFullPage} 
          onToggleFullPage={handleToggleFullPage}
        />
      </div>
    </div>
  );
};

export default Chat;

