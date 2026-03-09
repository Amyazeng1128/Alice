/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import ChatView from './components/ChatView';
import MarketDiscoveryView from './components/MarketDiscoveryView';
import AliceClawView from './components/AliceClawView';
import PortfolioView from './components/PortfolioView';
import { ViewType } from './types';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, MoreVertical, LayoutGrid, Wallet, Settings, Zap } from 'lucide-react';

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('chat');

  const renderView = () => {
    switch (activeView) {
      case 'chat':
        return <ChatView onViewChange={setActiveView} />;
      case 'discovery':
        return <MarketDiscoveryView />;
      case 'alice':
        return <AliceClawView />;
      case 'portfolio':
        return <PortfolioView />;
      default:
        return <ChatView onViewChange={setActiveView} />;
    }
  };

  const getHeaderTitle = () => {
    switch (activeView) {
      case 'chat': return 'Alice Claw';
      case 'discovery': return '市场发现';
      case 'alice': return 'Alice Claw';
      case 'portfolio': return '钱包与持仓';
      default: return 'Alice Claw';
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="tg-container">
        {/* Telegram Header */}
        <header className="tg-header">
          <div className="flex items-center w-full justify-between">
            <button
              onClick={() => setActiveView('chat')}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white transition-all hover:bg-white/20"
            >
              <ChevronLeft size={20} />
            </button>

            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1">
                <h1 className="text-[13px] font-bold text-white">Alice Claw</h1>
                <Settings size={12} className="text-white/40" />
              </div>
              <p className="text-[9px] text-white/40">机器人</p>
            </div>

            <div className="w-8 h-8 rounded-full overflow-hidden border border-white/10">
              <img
                src="https://i.postimg.cc/BQs8Hdpt/c403beb885997a465b2c38b1120e6c16.png"
                alt="User"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex flex-col overflow-hidden"
            >
              {renderView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

