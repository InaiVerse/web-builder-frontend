import React, { useState } from 'react';
import { Folder, File, ChevronRight, ChevronDown, Files, Search, GitGraph, Bug, Box } from 'lucide-react';

const FileTreeItem = ({ item, level = 0, onSelect }) => {
    const [isOpen, setIsOpen] = useState(true);

    if (item.type === 'file') {
        return (
            <div
                className="flex items-center gap-2 rounded-xl py-1 pl-2 pr-3 text-sm text-slate-600 hover:bg-slate-100 cursor-pointer"
                style={{ paddingLeft: `${level * 12 + 20}px` }}
                onClick={() => onSelect(item)}
            >
                <File size={14} className="text-slate-400" />
                <span>{item.name}</span>
            </div>
        );
    }

    return (
        <div className="space-y-1">
            <div
                className="flex items-center gap-2 rounded-xl py-1 pl-2 pr-3 text-sm font-medium text-slate-700 hover:bg-slate-100 cursor-pointer"
                style={{ paddingLeft: `${level * 12 + 8}px` }}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                <Folder size={14} className="text-sky-400" />
                <span>{item.name}</span>
            </div>
            {isOpen && item.children && (
                <div>
                    {item.children.map((child, index) => (
                        <FileTreeItem key={index} item={child} level={level + 1} onSelect={onSelect} />
                    ))}
                </div>
            )}
        </div>
    );
};

const Sidebar = ({ projectStructure, projectLabel, onFileSelect }) => {
    return (
        <div className="flex h-full">
            {/* Activity Bar */}
            <div className="flex w-12 flex-col items-center gap-4 rounded-2xl border-r border-slate-100 bg-white py-4">
                <div className="rounded-xl border border-slate-200 bg-slate-900/90 p-2 text-white shadow">
                    <Files size={20} strokeWidth={1.5} />
                </div>
                {[Search, GitGraph, Bug, Box].map((Icon, idx) => (
                    <div
                        key={idx}
                        className="text-slate-400 hover:text-slate-900 cursor-pointer rounded-xl p-2 transition"
                    >
                        <Icon size={20} strokeWidth={1.5} />
                    </div>
                ))}
            </div>

            {/* Explorer */}
            <div className="flex flex-1 flex-col">
                <div className="flex items-center justify-between px-4 pt-4">
                    <div>
                        <p className="text-[11px] uppercase tracking-[0.4em] text-slate-400">Explore</p>
                        <h3 className="text-sm font-semibold text-slate-800 mt-1">{projectLabel || projectStructure?.name || 'Project'}</h3>
                    </div>
                    <button className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-500 hover:bg-slate-50">
                        ...
                    </button>
                </div>
                <div className="mt-3 flex-1 overflow-y-auto px-2 pb-4 custom-scrollbar">
                    {projectStructure ? (
                        <div className="rounded-2xl bg-slate-50/60 px-2 py-2">
                            <FileTreeItem item={projectStructure} onSelect={onFileSelect} />
                        </div>
                    ) : (
                        <div className="p-4 text-center text-sm text-slate-400">No project loaded.</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
