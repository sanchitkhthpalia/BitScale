import React from 'react';
import { Modal } from './Modal';
import { Sparkles, TrendingUp, Zap } from 'lucide-react';

interface PlanUsageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgrade?: () => void;
}

export const PlanUsageModal: React.FC<PlanUsageModalProps> = ({ isOpen, onClose, onUpgrade }) => {
  const usage = {
    current: 500,
    limit: 500,
    percentage: 100,
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Plan Usage" size="md">
      <div className="p-6 space-y-6">
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Free Plan</h3>
              <p className="text-sm text-gray-600">Monthly credit allowance</p>
            </div>
            <div className="bg-blue-600 p-3 rounded-xl text-white">
              <Sparkles size={24} />
            </div>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">Credits Used</span>
              <span className="font-bold text-gray-900">
                {usage.current.toLocaleString()} / {usage.limit.toLocaleString()}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-500 flex items-center justify-end pr-1"
                style={{ width: `${usage.percentage}%` }}
              >
                {usage.percentage >= 90 && (
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                )}
              </div>
            </div>
            {usage.percentage >= 100 && (
              <p className="text-xs text-orange-600 font-medium flex items-center space-x-1">
                <span>⚠️</span>
                <span>You've reached your plan limit</span>
              </p>
            )}
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wide">What are credits?</h4>
          <p className="text-sm text-gray-600 leading-relaxed">
            Credits are used for AI-powered enrichment operations. Each record enrichment consumes credits based on the complexity of the operation.
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
          <div className="flex items-start space-x-3">
            <Zap size={18} className="text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-bold text-gray-900">Pro Plan</p>
              <p className="text-xs text-gray-600">5,000 credits/month</p>
            </div>
          </div>
          <button
            onClick={() => {
              onUpgrade?.();
              onClose();
            }}
            className="w-full px-4 py-2.5 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          >
            Upgrade to Pro
          </button>
        </div>

        <div className="text-xs text-gray-500 text-center">
          Credits reset on the 1st of each month
        </div>
      </div>
    </Modal>
  );
};
