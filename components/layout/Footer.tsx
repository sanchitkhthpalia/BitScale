import React from 'react';
import { HelpCircle, Layers, Zap, XCircle, Table as TableIcon, Users, BarChart3 } from 'lucide-react';
import { Tooltip } from '../common/Tooltip';

type ViewType = 'grid' | 'engagement' | 'insights';

interface FooterProps {
  activeView?: ViewType;
  onViewChange?: (view: ViewType) => void;
  onKillRun?: () => void;
  onAutoRun?: () => void;
  onDedupe?: () => void;
  onSupport?: () => void;
  isAutoRunActive?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  activeView = 'grid',
  onViewChange,
  onKillRun,
  onAutoRun,
  onDedupe,
  onSupport,
  isAutoRunActive = false,
}) => {
  const views: Array<{ id: ViewType; label: string; icon: React.ReactNode }> = [
    { id: 'grid', label: 'Grid view', icon: <TableIcon size={14} className="mr-2" /> },
    { id: 'engagement', label: 'User Engagement', icon: <Users size={14} className="mr-2" /> },
    { id: 'insights', label: 'Customer Insights', icon: <BarChart3 size={14} className="mr-2" /> },
  ];

  return (
    <footer className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 h-10 flex items-center justify-between px-4 z-50 shadow-[0_-4px_10px_-4px_rgba(0,0,0,0.05)]">
      <nav className="flex items-center h-full" aria-label="View navigation">
        {views.map((view) => {
          const isActive = activeView === view.id;
          return (
            <button
              key={view.id}
              onClick={() => onViewChange?.(view.id)}
              className={`flex items-center h-full px-4 border-r border-gray-200 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
                isActive
                  ? 'bg-blue-50 border-b-2 border-b-blue-600 text-blue-700'
                  : 'text-gray-400 hover:bg-gray-50 hover:text-gray-700'
              }`}
              aria-current={isActive ? 'page' : undefined}
              aria-label={view.label}
            >
              <span className="text-[11px] font-bold uppercase tracking-tight flex items-center">
                {view.icon}
                {view.label}
              </span>
            </button>
          );
        })}
      </nav>
      <div className="flex items-center space-x-4">
        <Tooltip content="Stop all running operations" position="bottom">
          <button
            onClick={onKillRun}
            className="flex items-center space-x-1.5 text-red-500 hover:bg-red-50 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-red-500/20"
            aria-label="Kill run - stop all operations"
          >
            <XCircle size={14} />
            <span>Kill Run</span>
          </button>
        </Tooltip>
        <Tooltip content={isAutoRunActive ? 'Disable automatic enrichment' : 'Enable automatic enrichment'} position="bottom">
          <button
            onClick={onAutoRun}
            className={`flex items-center space-x-1.5 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${
              isAutoRunActive
                ? 'text-blue-600 bg-blue-50 border border-blue-200'
                : 'text-gray-500 hover:bg-gray-50'
            }`}
            aria-label={isAutoRunActive ? 'Auto run enabled' : 'Auto run disabled'}
            aria-pressed={isAutoRunActive}
          >
            <Zap size={14} className={isAutoRunActive ? 'animate-pulse' : ''} />
            <span>Auto Run</span>
          </button>
        </Tooltip>
        <Tooltip content="Remove duplicate records" position="bottom">
          <button
            onClick={onDedupe}
            className="flex items-center space-x-1.5 text-gray-500 hover:bg-gray-50 px-2 py-1 rounded text-[10px] font-black uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            aria-label="Deduplicate records"
          >
            <Layers size={14} />
            <span>Dedupe</span>
          </button>
        </Tooltip>
        <Tooltip content="Get help and contact support" position="bottom">
          <button
            onClick={onSupport}
            className="flex items-center space-x-1.5 text-blue-600 hover:bg-blue-50 px-3 py-1 rounded text-[10px] font-black uppercase tracking-wider border border-blue-100 bg-blue-50/50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            aria-label="Support"
          >
            <HelpCircle size={14} />
            <span>Support</span>
          </button>
        </Tooltip>
      </div>
    </footer>
  );
};

export default Footer;
