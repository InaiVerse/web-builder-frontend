import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { IoMdSend } from 'react-icons/io';
import { FaArrowLeft } from 'react-icons/fa';
import Header from '../Dashboard/Header';

const ChatEditor = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');

  // ---- Helpers to safely read data from navigate state ----
  const aiResponse = location.state?.aiResponse;
  const inputPrompt = location.state?.inputPrompt || '';

  const extractAiText = (res) => {
    if (!res) return '';

    // Most common API shapes cover karva
    if (typeof res === 'string') return res;

    if (res.text) return res.text;
    if (res.message) return res.message;
    if (res.content) return res.content;

    if (res.result?.text) return res.result.text;
    if (res.result?.output?.text) return res.result.output.text;
    if (res.data?.text) return res.data.text;

    // Fallback: stringify
    try {
      return JSON.stringify(res, null, 2);
    } catch {
      return String(res);
    }
  };

  const aiText = extractAiText(aiResponse);

  // (Optional) if you want first AI message to also appear in chat list
  // uncomment this useEffect
  /*
  useEffect(() => {
    if (aiText) {
      setMessages([{ text: aiText, sender: 'ai' }]);
    }
  }, [aiText]);
  */

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    // Right now only local chat; later tame yaha thi API call kari shakso
    setMessages((prev) => [...prev, { text: inputValue.trim(), sender: 'user' }]);
    setInputValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handlePrototype = () => {
    if (!aiText) return;
    navigate('/project-builder/builder', {
      state: {
        blueprint: aiText,
        aiResponse,
        inputPrompt,
      },
    });
  };

  const hasBlueprint = Boolean(inputPrompt || aiText);

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-8 md:mx-8 lg:mx-16 border-x border-black relative">
        {/* Header */}
        <div className="border-b border-black relative">
          <Header />
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-black" />
          <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-black" />
        </div>

        {/* Page Content */}
        <div className="flex flex-col h-[calc(100vh-80px)]">
          {/* Back Button */}
          <div className="p-4">
            <button
              onClick={() => navigate('/project-builder/input')}
              className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors"
            >
              <FaArrowLeft />
              <span>Back to Input</span>
            </button>
          </div>

          {/* Scrollable main area (Blueprint + Messages) */}
          <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-6">
            {/* Blueprint Card */}
            {hasBlueprint && (
              <div className="border border-black rounded-2xl bg-white shadow-[3px_4px_0px_#000] p-6 max-w-3xl mx-auto">
                {/* Top meta row */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs tracking-[0.15em] uppercase text-gray-500">
                      App Blueprint
                    </p>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {aiResponse?.app_name || aiResponse?.title || 'Generated Concept'}
                    </h2>
                  </div>
                  <span className="px-3 py-1 text-xs border border-gray-300 rounded-full text-gray-700">
                    AI Teammate
                  </span>
                </div>

                {/* Prompt block */}
                {inputPrompt && (
                  <div className="mb-5">
                    <p className="text-xs font-semibold text-gray-500 mb-1">
                      Prompt
                    </p>
                    <div className="border border-gray-200 rounded-xl bg-gray-50 px-4 py-3 text-sm text-gray-800 whitespace-pre-wrap">
                      {inputPrompt}
                    </div>
                  </div>
                )}

                {/* Response block */}
                {aiText && (
                  <div>
                    <p className="text-xs font-semibold text-gray-500 mb-1">
                      AI Response
                    </p>
                    <div className="border border-gray-200 rounded-xl bg-white px-4 py-3 text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                      {aiText}
                    </div>
                  </div>
                )}

                {/* CTA row */}
                <div className="mt-6 flex justify-end">
                  <button
                    type="button"
                    onClick={handlePrototype}
                    disabled={!aiText}
                    className={`px-4 py-2 text-sm border border-black rounded-full shadow-[2px_2px_0px_#000] transition ${
                      aiText ? 'bg-black text-white hover:bg-[#1a1a1a]' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                    }`}
                  >
                    Prototype this App
                  </button>
                </div>
              </div>
            )}

            {/* Messages Area (below blueprint) */}
            <div className="max-w-3xl mx-auto w-full">
              {messages.length === 0 && !hasBlueprint && (
                <div className="text-center text-gray-500 mt-8">
                  <h3 className="text-lg font-semibold mb-2">Chat Editor</h3>
                  <p>Start a conversation by typing a message below</p>
                </div>
              )}

              {messages.length === 0 && hasBlueprint && (
                <div className="text-center text-gray-500 mt-6 text-sm">
                  Start a conversation by refining this blueprint below.
                </div>
              )}

              {messages.length > 0 && (
                <div className="mt-4 space-y-3">
                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${
                        message.sender === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg text-sm leading-relaxed ${
                          message.sender === 'user'
                            ? 'bg-black text-white'
                            : 'bg-gray-200 text-gray-800'
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Input Area (fixed at bottom) */}
          <div className="border-t border-black p-4">
            <div className="flex gap-2 max-w-3xl mx-auto">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Refine this blueprint or ask a follow-up..."
                className="flex-1 px-4 py-2 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-300"
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors flex items-center gap-2"
              >
                <IoMdSend size={20} />
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatEditor;
