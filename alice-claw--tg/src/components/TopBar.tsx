import React from 'react';
import { Search, Bell, Wallet, ChevronDown } from 'lucide-react';

const TopBar: React.FC = () => {
  return (
    <header className="h-16 bg-white flex items-center justify-between px-8 sticky top-0 z-40 border-b border-gray-50">
      <div className="flex-1 flex items-center max-w-2xl">
        <div className="relative w-full max-w-sm group">
          <Search className="absolute left-0 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="搜索市场信号..."
            className="w-full pl-8 pr-4 py-1.5 bg-transparent rounded-lg text-sm focus:outline-none transition-all placeholder-gray-400"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-white border border-gray-100 px-4 py-1.5 rounded-xl shadow-sm">
          <Wallet size={16} className="text-gray-400" />
          <span className="text-sm font-bold text-gray-900">1250 USDC</span>
        </div>

        <div className="w-8 h-8 rounded-full overflow-hidden shadow-sm">
          <img 
            src="https://i.postimg.cc/kMkxR1R7/6.png" 
            alt="User" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>
    </header>
  );
};

export default TopBar;
