import { cn } from '@/Web-Builder/lib/utils';
import { Bot, User, Sparkles } from 'lucide-react';
// import { Avatar, AvatarFallback } from '../../../Web-Builder/Components/ui/avatar';
import { Avatar, AvatarImage, AvatarFallback } from "../../../Web-Builder/Components/ui/avatar"
import { useEffect, useRef } from 'react';
import Prism from 'prismjs';
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import { ExecutionSteps } from './execution-steps';

export function ChatMessage({ message }) {
  const isAssistant = message.role === 'assistant';
  const codeLanguageClass =
    message.language === 'css'
      ? 'language-css'
      : message.language === 'js'
        ? 'language-javascript'
        : 'language-html';

  const containerRef = useRef(null);

  useEffect(() => {
    if (message.code && containerRef.current) {
      Prism.highlightAllUnder(containerRef.current);
    }
  }, [message.code, message.language]);

  return (
    <div
      className={cn(
        'flex items-start gap-3 animate-in fade-in-50 slide-in-from-bottom-2 duration-300',
        !isAssistant && 'justify-end'
      )}
    >
      {isAssistant && (
        <Avatar className="h-7 w-7 border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 flex-shrink-0">
          <AvatarFallback className="bg-transparent">
            <Sparkles className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
      <div
        ref={containerRef}
        className={cn(
          'rounded-xl px-3.5 py-2.5 shadow-sm transition-all duration-200',
          message.code || message.execution_steps ? 'w-full max-w-full' : 'max-w-[85%]',
          isAssistant
            ? 'bg-slate-800/40 border border-slate-700/50 text-slate-200 backdrop-blur-sm'
            : 'bg-gradient-to-br from-emerald-500/90 to-emerald-600/90 text-white border border-emerald-400/30 shadow-emerald-500/20'
        )}
      >
        {message.code ? (
          <div className="space-y-1.5">
            {message.content && (
              <p className="text-xs text-slate-400">{message.content}</p>
            )}
            <pre className="mt-1 max-h-[28rem] overflow-auto rounded-lg border border-slate-700/50 bg-slate-900/70 px-3 py-2.5 text-xs font-mono backdrop-blur-sm">
              <code className={`whitespace-pre-wrap break-words ${codeLanguageClass}`}>
                {message.code}
              </code>
            </pre>
          </div>
        ) : (
          <>
            <p className={cn(
              "whitespace-pre-wrap leading-relaxed",
              isAssistant ? "text-xs" : "text-sm font-medium"
            )}>
              {message.content}
            </p>

            {/* Display Execution Steps if available */}
            {message.execution_steps && message.execution_steps.length > 0 && (
              <ExecutionSteps steps={message.execution_steps} animate={true} />
            )}
          </>
        )}
      </div>
      {!isAssistant && (
        <Avatar className="h-7 w-7 border border-slate-600/50 bg-slate-700/50 text-slate-300 flex-shrink-0">
          <AvatarFallback className="bg-transparent">
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}
