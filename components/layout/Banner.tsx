import React from 'react';
import { AlertTriangle, XCircle } from 'lucide-react';

interface BannerProps {
  onDismiss?: () => void;
}

export const Banner: React.FC<BannerProps> = ({ onDismiss }) => {
  return (
    <div className="bg-red-600 text-white px-4 py-2.5 flex items-center justify-center space-x-3 text-sm font-medium animate-in slide-in-from-top duration-300">
      <AlertTriangle size={16} />
      <span>Payment failed. 450,000 credits will permanently expire in 30 days</span>
      <button className="bg-white text-red-600 px-4 py-1 rounded-md font-bold text-xs uppercase shadow-sm hover:bg-gray-100 transition-colors ml-4">
        Pay Now
      </button>
      <XCircle
        size={16}
        className="ml-auto cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
        onClick={onDismiss}
      />
    </div>
  );
};

export default Banner;
