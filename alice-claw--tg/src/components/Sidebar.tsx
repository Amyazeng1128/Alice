import React from 'react';
import { MessageSquare, Compass, Zap, Wallet, Menu, X, ChevronRight } from 'lucide-react';
import { ViewType } from '../types';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { motion } from 'motion/react';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarProps {
  activeView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const navItems = [
    { id: 'chat' as ViewType, label: '聊天', icon: MessageSquare },
    { id: 'discovery' as ViewType, label: '市场发现', icon: Compass },
    { id: 'alice' as ViewType, label: 'Alice Claw', icon: Zap },
    { id: 'portfolio' as ViewType, label: '资金与持仓', icon: Wallet },
  ];

  return (
    <aside className="w-64 h-screen bg-[#f7f7f7] flex flex-col border-r border-gray-100 flex-shrink-0">
      <div className="p-8 pb-12 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full overflow-hidden shadow-sm">
          <img 
            src="https://i.postimg.cc/BQs8Hdpt/c403beb885997a465b2c38b1120e6c16.png" 
            alt="Alice Claw" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        <span className="text-xl font-bold tracking-tight text-gray-900">Alice Claw</span>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={cn(
              "sidebar-item w-full",
              activeView === item.id && "sidebar-item-active"
            )}
          >
            <item.icon size={20} />
            <span className="flex-1 text-left font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;
