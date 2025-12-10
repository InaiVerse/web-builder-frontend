'use client';

import { Button } from '@/Web-Builder/Components/ui/button';
import { Textarea } from '@/Web-Builder/Components/ui/textarea';
import { Send, LoaderCircle, Sparkles, Mic, MicOff } from 'lucide-react';

export function ChatInput({ value, onChange, onSubmit, isLoading, textareaRef, isListening, transcript, selectedInteraction, onToggleVoice }) {

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalValue = isListening && transcript ? transcript : value;
    if (!finalValue.trim() || isLoading) return;
    onSubmit(finalValue);
    if (isListening) {
      onToggleVoice(); // Stop listening after submission
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      const finalValue = isListening && transcript ? transcript : value;
      if (finalValue.trim() && !isLoading) {
        onSubmit(finalValue);
        if (isListening) {
          onToggleVoice(); // Stop listening after submission
        }
      }
    }
  };

  // Update textarea value when transcript changes
  const displayValue = isListening ? transcript : value;

  const handleTextareaChange = (e) => {
    if (!isListening) {
      onChange(e.target.value);
    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 border-t border-white/5 bg-black px-4 py-3"
    >
      <div className="relative w-full">
        <Textarea
          ref={textareaRef}
          value={displayValue}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening..." : "Describe what you want..."}
          className={`flex-1 resize-none border-white/10 bg-white/5 pr-10 text-xs text-slate-100 placeholder:text-slate-400 focus-visible:ring-emerald-400 ${isListening ? 'border-emerald-400/50 bg-emerald-400/10' : ''}`}
          rows={1}
          disabled={isLoading || isListening}
        />
        <Sparkles className="absolute top-1/2 -translate-y-1/2 right-3 h-4 w-4 text-emerald-300/70" />

        {/* Microphone button for voice interactions */}
        {(selectedInteraction === 'voice-to-text' || selectedInteraction === 'voice-to-voice') && (
          <Button
            type="button"
            onClick={onToggleVoice}
            disabled={isLoading}
            className={`absolute top-1/2 -translate-y-1/2 right-10 h-7 w-7 rounded-full p-0 transition-colors ${isListening
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
          >
            {isListening ? <MicOff className="h-3.5 w-3.5" /> : <Mic className="h-3.5 w-3.5" />}
          </Button>
        )}
      </div>
      <div className="flex items-center justify-between">
        <p className="text-[9px] text-slate-400">
          {isListening ? "Listening... Speak now!" : "Press Enter to send"}
        </p>
        <Button
          type="submit"
          size="sm"
          disabled={isLoading || !(isListening ? transcript.trim() : value.trim())}
          className="gap-1.5 rounded-full bg-emerald-500/90 px-3 py-1 text-xs text-white hover:bg-emerald-400 transition-all duration-300"
        >
          {isLoading ? (
            <>
              <div className="flex items-center gap-0.5">
                <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1 h-1 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
              <span className="animate-pulse text-[10px]">Processing</span>
            </>
          ) : (
            <>
              <Send className="h-3 w-3" />
              <span className="text-[10px]">Ship it</span>
            </>
          )}
        </Button>
      </div>
    </form>
  );
}