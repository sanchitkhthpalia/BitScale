import React from 'react';
import { RefreshCw, Sparkles } from 'lucide-react';

interface EnrichmentDialogProps {
  progress: number;
}

export const EnrichmentDialog: React.FC<EnrichmentDialogProps> = ({ progress }) => {
  return (
    <div className="fixed inset-0 z-[100] bg-gray-900/10 backdrop-blur-[2px] flex items-center justify-center">
      <div className="bg-white p-8 rounded-3xl shadow-[0_32px_64px_-12px_rgba(0,0,0,0.14)] border border-gray-100 w-[380px] flex flex-col items-center animate-in zoom-in duration-300">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-blue-100 rounded-full animate-ping opacity-25" />
          <div className="bg-blue-600 p-4 rounded-full text-white relative">
            <Sparkles size={32} />
          </div>
        </div>
        <h3 className="text-xl font-black text-gray-900 mb-2">AI Enriching Grid</h3>
        <p className="text-sm text-gray-500 mb-8 text-center px-4 leading-relaxed font-medium">
          We&apos;re using Gemini to find high-quality company logos and data for you.
        </p>
        <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden mb-3 p-0.5">
          <div
            className="bg-blue-600 h-full rounded-full transition-all duration-500 shadow-[0_0_12px_rgba(37,99,235,0.4)]"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex items-center space-x-2">
          <RefreshCw className="text-blue-600 animate-spin" size={14} />
          <span className="text-xs font-black text-blue-600 uppercase tracking-widest">{progress}% Processing</span>
        </div>
      </div>
    </div>
  );
};

export default EnrichmentDialog;
