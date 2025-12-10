'use client';

import { CheckCircle2, Loader2, XCircle, Circle, Brain, Code2, Sparkles, FileCode, Search, Wrench } from 'lucide-react';

export function ExecutionSteps({ steps, animate = true }) {
    if (!steps || steps.length === 0) return null;

    const normalizedSteps = steps.map((step, index) => {
        const hasCompletedAfter = steps.slice(index + 1).some(s => s.status === 'completed');
        if (hasCompletedAfter && (step.status === 'in_progress' || step.status === 'pending')) {
            return { ...step, status: 'completed' };
        }
        return step;
    });

    const getStepIcon = (stepType, status) => {
        if (status === 'completed') return <CheckCircle2 className="h-2.5 w-2.5 text-emerald-400" />;
        if (status === 'error') return <XCircle className="h-2.5 w-2.5 text-red-400" />;
        if (status === 'in_progress') return <Loader2 className="h-2.5 w-2.5 text-blue-400 animate-spin" />;

        switch (stepType) {
            case 'thinking': return <Brain className="h-2.5 w-2.5 text-purple-400" />;
            case 'analyzing':
            case 'search': return <Search className="h-2.5 w-2.5 text-yellow-400" />;
            case 'modify':
            case 'code': return <Code2 className="h-2.5 w-2.5 text-cyan-400" />;
            case 'file': return <FileCode className="h-2.5 w-2.5 text-orange-400" />;
            case 'complete': return <Sparkles className="h-2.5 w-2.5 text-emerald-400" />;
            default: return <Circle className="h-2.5 w-2.5 text-slate-500" />;
        }
    };

    const getStatusClasses = (status) => {
        switch (status) {
            case 'completed': return 'border-emerald-500/30 bg-emerald-500/5';
            case 'in_progress': return 'border-blue-500/30 bg-blue-500/10';
            case 'error': return 'border-red-500/30 bg-red-500/5';
            default: return 'border-slate-700/50 bg-slate-800/30';
        }
    };

    return (
        <div className="execution-steps mt-2 space-y-1 w-full">
            {normalizedSteps.map((step, index) => (
                <div
                    key={step.step_number || index}
                    className={`
                        flex items-center gap-1.5 p-1.5 rounded border
                        ${getStatusClasses(step.status)}
                        ${animate ? 'opacity-0' : 'opacity-100'}
                    `}
                    style={{
                        animation: animate ? `slideIn 0.3s ease-out ${index * 100}ms forwards` : 'none'
                    }}
                >
                    {/* Icon */}
                    <div className={`
                        flex-shrink-0 w-5 h-5 rounded flex items-center justify-center
                        ${step.status === 'completed' ? 'bg-emerald-500/20' :
                            step.status === 'in_progress' ? 'bg-blue-500/20' :
                                step.status === 'error' ? 'bg-red-500/20' : 'bg-slate-700/50'}
                    `}>
                        {getStepIcon(step.step_type, step.status)}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1">
                            <span className={`
                                text-[10px] font-semibold truncate
                                ${step.status === 'completed' ? 'text-emerald-300' :
                                    step.status === 'in_progress' ? 'text-blue-300' :
                                        step.status === 'error' ? 'text-red-300' : 'text-slate-300'}
                            `}>
                                {step.title}
                            </span>
                        </div>
                        {step.description && (
                            <p className="text-[8px] text-slate-400 truncate">
                                {step.description}
                            </p>
                        )}
                    </div>

                    {/* Badge + Dot */}
                    <div className="flex items-center gap-1 flex-shrink-0">
                        <span className={`
                            text-[7px] px-1 rounded font-mono
                            ${step.status === 'completed' ? 'bg-emerald-500/20 text-emerald-400' :
                                step.status === 'in_progress' ? 'bg-blue-500/20 text-blue-400' :
                                    'bg-slate-700/50 text-slate-500'}
                        `}>
                            #{step.step_number}
                        </span>
                        <div className={`
                            w-1 h-1 rounded-full
                            ${step.status === 'completed' ? 'bg-emerald-400' :
                                step.status === 'in_progress' ? 'bg-blue-400 animate-pulse' :
                                    step.status === 'error' ? 'bg-red-400' : 'bg-slate-600'}
                        `} />
                    </div>
                </div>
            ))}

            <style jsx>{`
                @keyframes slideIn {
                    0% {
                        opacity: 0;
                        transform: translateX(-10px);
                    }
                    100% {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `}</style>
        </div>
    );
}

export default ExecutionSteps;
