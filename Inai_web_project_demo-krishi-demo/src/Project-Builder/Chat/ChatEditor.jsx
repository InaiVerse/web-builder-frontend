import React, { useState, useRef, useEffect, useContext } from 'react';
import Header from '../Components/Header';
import backgroundImg from '../assets/background_img.png';
import { IoSend } from "react-icons/io5";
import { FiPaperclip } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import { ThemeContext } from '../contexts/ThemeContext';

// Custom CSS for hiding scrollbar
const scrollbarHideStyles = `
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const ChatEditor = () => {
  const { theme } = useContext(ThemeContext);
  const [messages, setMessages] = useState([
    { id: 1, type: 'user', text: 'Hello, can you help me with something?' },
    { id: 2, type: 'bot', text: 'Of course! I\'m here to help. What would you like to know?' }
  ]);
  const [inputText, setInputText] = useState('');
  const textareaRef = useRef(null);

  // Inject custom CSS for hiding scrollbar
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = scrollbarHideStyles;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleSendMessage = () => {
    if (inputText.trim()) {
      const newMessage = {
        id: messages.length + 1,
        type: 'user',
        text: inputText
      };
      setMessages([...messages, newMessage]);
      
      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: messages.length + 2,
          type: 'bot',
          text: 'I understand your question. Let me help you with that...'
        };
        setMessages(prev => [...prev, botResponse]);
      }, 1000);
      
      setInputText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = Math.min(textarea.scrollHeight, 200) + 'px';
    }
  }, [inputText]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <div className="mx-8 md:mx-8 lg:mx-16 border-x border-black dark:border-white relative">
        
        <div className="border-b border-black dark:border-white relative sticky top-0 z-10 bg-white dark:bg-gray-900">
          <Header />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-black dark:bg-white"></div>
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-black dark:bg-white"></div>
        </div>

        <div 
          className="p-8 pb-32"
          style={{
            backgroundColor: theme === 'dark' ? '#1A1A1A' : '#F1F5F9',
            backgroundImage: `url(${backgroundImg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            minHeight: '100vh',
            position: 'relative'
            
          }}
        >
          <div className="max-w-4xl mx-auto">
            
            {/* Chat Messages */}
            <div className="mb-8 pb-32 min-h-[400px] max-h-[550px] overflow-y-auto scrollbar-hide">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${message.type === 'user' ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                  className={`max-w-[70%] p-4 rounded-lg ${
                    message.type === 'user'
                      ? (theme === 'dark' ? 'bg-gray-800 border border-white shadow-[2px_2px_0px_0px_#FFFFFF]' : 'bg-white border border-[#333333] shadow-[2px_2px_0px_0px_#333333]')
                      : (theme === 'dark' ? 'bg-gray-700 border border-gray-600 shadow-[2px_2px_0px_0px_#333333]' : 'bg-gray-100 border border-[#333333] shadow-[2px_2px_0px_0px_#333333]')
                  }`}
                  >
                    <p className={theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}>{message.text}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Box */}
            <div className={`fixed bottom-10 left-0 right-0 rounded-lg p-4 border shadow-[2px_2px_0px_0px_#333333] w-[890px] m-auto z-50 ${
              theme === 'dark' 
                ? 'bg-gray-800 border-white' 
                : 'bg-white border-[#333333]'
            }`}>

              <div className="flex items-start gap-3 w-[100%]">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Example : 'Explain quantum computing in simple terms'"
                  className={`flex-1 px-4 py-3 border-none focus:outline-none resize-none overflow-hidden ${
                    theme === 'dark' 
                      ? 'bg-gray-800 text-gray-200 placeholder-gray-400' 
                      : 'bg-white text-gray-800 placeholder-gray-400'
                  }`}
                  rows="1"
                  ref={textareaRef}
                />
                <button
                  onClick={handleSendMessage}
                  className={`p-3 rounded-lg hover:opacity-90 transition-colors mt-0 ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-white text-white' 
                      : 'bg-white border-[#333333] text-gray-700'
                  }`}
                  style={{
                    border: theme === 'dark' ? '1px solid #FFFFFF' : '1px solid #333333',
                    boxShadow: theme === 'dark' ? '2px 2px 0px 0px #FFFFFF' : '2px 2px 0px 0px #333333'
                  }}
                >
                  <IoSend className={`text-xl ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`} />
                </button>
              </div>
              
              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-3">
                <button
                  className={`w-10 h-10 rounded-full flex items-center justify-center hover:opacity-90 transition-colors ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-white text-white' 
                      : 'bg-white border-[#333333] text-gray-700'
                  }`}
                  style={{
                    border: theme === 'dark' ? '1px solid #FFFFFF' : '1px solid #333333',
                    boxShadow: theme === 'dark' ? '2px 2px 0px 0px #FFFFFF' : '2px 2px 0px 0px #333333'
                  }}
                >
                  <FaPlus className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} />
                </button>
                <button
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 hover:opacity-90 transition-colors ${
                    theme === 'dark' 
                      ? 'bg-gray-700 border-white text-white' 
                      : 'bg-white border-[#333333] text-gray-700'
                  }`}
                  style={{
                    border: theme === 'dark' ? '1px solid #FFFFFF' : '1px solid #333333',
                    boxShadow: theme === 'dark' ? '2px_2px_0px_0px_#FFFFFF' : '2px_2px_0px_0px_#333333'
                  }}
                >
                  <FiPaperclip className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} />
                  <span className={theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}>Attach</span>
                </button>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default ChatEditor;
