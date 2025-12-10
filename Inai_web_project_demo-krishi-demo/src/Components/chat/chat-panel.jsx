'use client';

import { ScrollArea } from '@/Components/ui/scroll-area';
import { ChatMessage } from './chat-message';
import { ChatInput } from './chat-input';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ChevronDown, ChevronUp, Sparkles, Settings, Mic, MicOff } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/Components/ui/dropdown-menu';
import { getProjectData } from '../Utils/projectStorage';

export function ChatPanel({ messages, isLoading, onSubmit, initialPrompt }) {
  const viewportRef = useRef(null);
  const inputRef = useRef(null);
  const [draftPrompt, setDraftPrompt] = useState(initialPrompt || '');
  const [showInspiration, setShowInspiration] = useState(true);
  const [selectedInteraction, setSelectedInteraction] = useState('text-to-text');
  const hasAppliedInitialPrompt = useRef(false);

  // Voice states
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [transcript, setTranscript] = useState('');

  // Callback refs to avoid closure issues
  const onSubmitRef = useRef(onSubmit);
  const selectedInteractionRef = useRef(selectedInteraction);
  const isFirstTimeUserRef = useRef(false);

  useEffect(() => {
    onSubmitRef.current = onSubmit;
  }, [onSubmit]);

  useEffect(() => {
    selectedInteractionRef.current = selectedInteraction;
  }, [selectedInteraction]);

  // Check if this is first-time user (has builderPrefillPrompt)
  useEffect(() => {
    try {
      const stored = getProjectData();
      isFirstTimeUserRef.current = !!(stored?.builderPrefillPrompt || stored?.metadataPayload);
      console.log('Is first time user:', isFirstTimeUserRef.current);
    } catch (error) {
      console.error('Error checking first time user:', error);
      isFirstTimeUserRef.current = false;
    }
  }, []);

  const quickPrompts = useMemo(
    () => [
      'Create a luxury SaaS hero with neon glow',
      'Design a bold ecommerce launch page',
      'Craft a portfolio with glassmorphism cards',
      'Generate a fintech dashboard with charts',
      'Build a vibrant festival landing page',
      'Make a minimalist pricing section',
    ],
    []
  );

  const handleQuickPrompt = (prompt) => {
    if (isLoading) return;
    setDraftPrompt(prompt);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const handleSubmitPrompt = (value) => {
    console.log('handleSubmitPrompt called with:', value);
    if (!value.trim()) {
      console.log('Empty value, not submitting');
      return;
    }
    console.log('Submitting to parent:', value);
    onSubmit(value, false, selectedInteraction.replace(/-/g, '_'));
    setDraftPrompt('');
  };

  const handleInteractionChange = (value) => {
    console.log('Interaction changed to:', value);
    setSelectedInteraction(value);

    // Handle voice interaction changes
    if (value === 'voice-to-text' || value === 'voice-to-voice') {
      startVoiceRecognition();
    } else {
      stopVoiceRecognition();
    }
  };

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;

      if (!SpeechRecognition) {
        console.warn('Speech recognition not supported in this browser');
        return;
      }

      const recognitionInstance = new SpeechRecognition();

      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = true;
      recognitionInstance.lang = 'en-US';
      recognitionInstance.maxAlternatives = 1;

      recognitionInstance.onresult = (event) => {
        console.log('Speech recognition result:', event);
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          console.log('Result:', transcript, 'Is final:', event.results[i].isFinal);
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        const currentTranscript = finalTranscript + interimTranscript;
        setTranscript(currentTranscript);

        // Auto-submit when we have a final result
        if (finalTranscript) {
          const currentInteraction = selectedInteractionRef.current;
          const interactionTypeWithUnderscore = currentInteraction.replace(/-/g, '_');
          console.log('Final transcript detected:', finalTranscript);
          console.log('Current interaction:', currentInteraction);
          console.log('Current interaction (underscore):', interactionTypeWithUnderscore);
          console.log('About to call onSubmit with interaction type:', interactionTypeWithUnderscore);

          // Always submit for voice interactions, regardless of the specific mode
          if (currentInteraction === 'voice-to-text' || currentInteraction === 'voice-to-voice') {
            console.log('Voice interaction detected, submitting...');
            // Capture the interaction type BEFORE setTimeout to avoid race conditions
            const capturedInteractionType = interactionTypeWithUnderscore;
            setTimeout(() => {
              const currentOnSubmit = onSubmitRef.current;
              const isFirstTime = false; // Force to false for voice interactions
              console.log('Calling onSubmit with:', finalTranscript.trim());
              console.log('Is first time user (forced):', isFirstTime);
              console.log('Captured interaction type being passed:', capturedInteractionType);
              console.log('onSubmit function type:', typeof currentOnSubmit);

              if (typeof currentOnSubmit === 'function') {
                // Always use /assistant/chat API for voice input
                console.log('ABOUT TO CALL onSubmit with interaction type:', capturedInteractionType);
                currentOnSubmit(finalTranscript.trim(), false, capturedInteractionType);
                setTranscript('');
                setIsListening(false);
                console.log('Prompt submitted using /assistant/chat API with interaction type:', capturedInteractionType);
              } else {
                console.error('onSubmit is not a function!');
              }
            }, 300);
          } else {
            console.log('Not a voice interaction, not submitting');
          }
        }
      };

      recognitionInstance.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        console.log('Speech recognition ended');
        setIsListening(false);
      };

      recognitionInstance.onstart = () => {
        console.log('Speech recognition started');
        setIsListening(true);
      };

      setRecognition(recognitionInstance);
    }
  }, []); // Empty dependency array - only initialize once

  const startVoiceRecognition = () => {
    console.log('Starting voice recognition...');
    if (recognition && !isListening) {
      try {
        recognition.start();
        console.log('Voice recognition started successfully');
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
      }
    } else {
      console.log('Cannot start: recognition not available or already listening');
    }
  };

  const stopVoiceRecognition = () => {
    console.log('Stopping voice recognition...');
    if (recognition && isListening) {
      try {
        recognition.stop();
        console.log('Voice recognition stopped successfully');
      } catch (error) {
        console.error('Failed to stop speech recognition:', error);
      }
      setIsListening(false);
      setTranscript('');
    } else {
      console.log('Cannot stop: recognition not available or not listening');
    }
  };

  const toggleVoiceRecognition = () => {
    if (isListening) {
      stopVoiceRecognition();
    } else {
      startVoiceRecognition();
    }
  };

  useEffect(() => {
    if (!initialPrompt || hasAppliedInitialPrompt.current) {
      return;
    }
    setDraftPrompt(initialPrompt);
    hasAppliedInitialPrompt.current = true;
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, [initialPrompt]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (viewport) {
      viewport.scrollTop = viewport.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="flex h-full flex-col bg-slate-950 text-slate-100">
      <div className="relative border-b border-white/5 bg-linear-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-4 shadow-sm">
        <div className="relative z-10 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-headline text-xl font-semibold">Build your website</h2>
            <div className="relative">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/80 hover:bg-white/10 hover:text-white transition-colors">
                    <Settings className="h-4 w-4" />
                    <span>Interactions</span>
                    <ChevronDown className="h-3 w-3" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="z-50 bg-slate-900 border border-white/10 rounded-md shadow-lg min-w-[180px]"
                  side="bottom"
                  align="end"
                  sideOffset={5}
                >
                  <DropdownMenuRadioGroup value={selectedInteraction} onValueChange={handleInteractionChange}>
                    <DropdownMenuRadioItem
                      value="text-to-text"
                      className="text-slate-200 cursor-pointer hover:bg-slate-800 focus:bg-slate-800 focus:text-white rounded-sm px-2 py-1.5 text-sm outline-none"
                    >
                      Text to Text
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="voice-to-text"
                      className="text-slate-200 cursor-pointer hover:bg-slate-800 focus:bg-slate-800 focus:text-white rounded-sm px-2 py-1.5 text-sm outline-none"
                    >
                      Voice to Text
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="text-to-voice"
                      className="text-slate-200 cursor-pointer hover:bg-slate-800 focus:bg-slate-800 focus:text-white rounded-sm px-2 py-1.5 text-sm outline-none"
                    >
                      Text to Voice
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      value="voice-to-voice"
                      className="text-slate-200 cursor-pointer hover:bg-slate-800 focus:bg-slate-800 focus:text-white rounded-sm px-2 py-1.5 text-sm outline-none"
                    >
                      Voice to Voice
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {/* <div className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-300">
                    <p className="text-slate-300/90">Need inspiration? Tap a preset below.</p>
                    <button
                      type="button"
                      onClick={() => setShowInspiration((prev) => !prev)}
                      className="flex items-center gap-1 rounded-full border border-white/10 px-2 py-0.5 text-[10px] uppercase tracking-wide text-white/80 hover:border-emerald-300/60"
                    >
                      {showInspiration ? 'Hide' : 'Show'} deck
                      {showInspiration ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                    </button>
                  </div>
                  {showInspiration && (
                    <div className="mt-3 flex max-h-28 flex-wrap gap-1.5 overflow-y-auto pr-1">
                      {quickPrompts.map((prompt) => (
                        <button
                          type="button"
                          key={prompt}
                          onClick={() => handleQuickPrompt(prompt)}
                          disabled={isLoading}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-0.5 text-[11px] font-medium text-slate-200 backdrop-blur transition hover:border-emerald-300/60 hover:text-white disabled:opacity-50"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  )}
                </div> */}
        </div>
        <div className="pointer-events-none absolute inset-y-0 right-0 h-full w-1/2 bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.25),transparent_60%)]" />
      </div>
      <ScrollArea className="flex-1" viewportRef={viewportRef}>
        <div className="space-y-5 px-4 py-5">
          {messages.map((msg, i) => (
            <ChatMessage key={i} message={msg} />
          ))}
        </div>
      </ScrollArea>
      <ChatInput
        value={draftPrompt}
        onChange={setDraftPrompt}
        onSubmit={handleSubmitPrompt}
        isLoading={isLoading}
        textareaRef={inputRef}
        isListening={isListening}
        transcript={transcript}
        selectedInteraction={selectedInteraction}
        onToggleVoice={toggleVoiceRecognition}
      />
    </div>
  );
}
