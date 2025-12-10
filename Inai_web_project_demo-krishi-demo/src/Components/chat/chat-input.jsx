'use client';

import { Button } from '@/Components/ui/button';
import { Textarea } from '@/Components/ui/textarea';
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
      className="flex flex-col gap-3 border-t border-white/5 bg-slate-950/95 px-5 py-4"
    >
      <div className="relative w-full">
        <Textarea
          ref={textareaRef}
          value={displayValue}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening..." : "Describe the vibe, layout, or interactions you want..."}
          className={`flex-1 resize-none border-white/10 bg-white/5 pr-12 text-slate-100 placeholder:text-slate-400 focus-visible:ring-emerald-400 ${isListening ? 'border-emerald-400/50 bg-emerald-400/10' : ''}`}
          rows={1}
          disabled={isLoading || isListening}
        />
        <Sparkles className="absolute top-1/2 -translate-y-1/2 right-4 h-5 w-5 text-emerald-300/70" />
        
        {/* Microphone button for voice interactions */}
        {(selectedInteraction === 'voice-to-text' || selectedInteraction === 'voice-to-voice') && (
          <Button
            type="button"
            onClick={onToggleVoice}
            disabled={isLoading}
            className={`absolute top-1/2 -translate-y-1/2 right-12 h-8 w-8 rounded-full p-0 transition-colors ${
              isListening 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
        )}
      </div>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <p className="text-[11px] text-slate-400">
          {isListening ? "Listening... Speak now!" : "Press Enter to send. Shift + Enter for a new line."}
        </p>
      </div>
      <div className="flex items-center justify-between text-xs text-slate-400">
        <Button 
          type="submit" 
          size="sm" 
          disabled={isLoading || !(isListening ? transcript.trim() : value.trim())} 
          className="gap-2 rounded-full bg-emerald-500/90 px-4 text-white hover:bg-emerald-400"
        >
          {isLoading ? (
            <LoaderCircle className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Ship it
        </Button>
      </div>
    </form>
  );
}
