import React from 'react';
import { Users, MousePointer, Type, Eye } from 'lucide-react';

const CollaborationPanel = ({ userActivity, activeUsers = [] }) => {
    const getActivityIcon = (type) => {
        switch (type) {
            case 'typing':
                return <Type size={14} className="animate-pulse" />;
            case 'cursor':
                return <MousePointer size={14} />;
            case 'selection':
                return <Eye size={14} />;
            default:
                return <Users size={14} />;
        }
    };

    const getActivityText = (activity) => {
        switch (activity.type) {
            case 'typing':
                return `User ${activity.userId?.slice(0, 8)} is typing...`;
            case 'cursor':
                return `User ${activity.userId?.slice(0, 8)} at line ${activity.line}`;
            case 'selection':
                return `User ${activity.userId?.slice(0, 8)} selected text`;
            case 'users_updated':
                return `${activity.users?.length || 0} users active`;
            default:
                return 'Activity detected';
        }
    };

    return (
        <div className="p-4 border-t border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2 mb-3">
                <Users size={16} className="text-slate-600" />
                <span className="text-sm font-medium text-slate-700">Collaboration</span>
            </div>
            
            {/* Active Users */}
            {activeUsers.length > 0 && (
                <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="flex -space-x-2">
                            {activeUsers.slice(0, 3).map((user, index) => (
                                <div
                                    key={user.id || index}
                                    className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center border-2 border-white"
                                    title={user.name || user.id}
                                >
                                    {(user.name || user.id || 'U').charAt(0).toUpperCase()}
                                </div>
                            ))}
                            {activeUsers.length > 3 && (
                                <div className="w-6 h-6 rounded-full bg-slate-400 text-white text-xs flex items-center justify-center border-2 border-white">
                                    +{activeUsers.length - 3}
                                </div>
                            )}
                        </div>
                        <span className="text-xs text-slate-600">
                            {activeUsers.length} active
                        </span>
                    </div>
                </div>
            )}

            {/* Recent Activity */}
            <div className="space-y-2">
                {Object.entries(userActivity).map(([key, activity]) => (
                    <div key={key} className="flex items-center gap-2 text-xs text-slate-600">
                        {getActivityIcon(activity.type)}
                        <span>{getActivityText(activity)}</span>
                    </div>
                ))}
                
                {Object.keys(userActivity).length === 0 && activeUsers.length === 0 && (
                    <div className="text-xs text-slate-500 italic">
                        No collaboration activity
                    </div>
                )}
            </div>
        </div>
    );
};

export default CollaborationPanel;
