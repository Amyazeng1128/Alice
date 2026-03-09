import React from 'react';
import { TrendingUp, TrendingDown, Search, Filter, ChevronRight, Zap, Users, BarChart3, Globe, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { motion } from 'motion/react';

const MarketDiscoveryView: React.FC = () => {
  const stats = [
    { label: '总交易量', value: '$1.42B' },
    { label: '看涨情绪', value: '68%', color: 'text-emerald-500' },
    { label: '活跃市场', value: '1,245' },
  ];

  const categories = ['全部', '政治', '经济', '加密', '娱乐'];

  const markets = [
    {
      id: '1',
      title: '特朗普 vs 拜登: 2028辩论',
      price: '500 USDC',
      potential: '+24.5%',
      aiScore: '92分',
      smartMoney: '🔥 聪明钱流入',
      isPositive: true,
      color: 'bg-blue-500'
    },
    {
      id: '2',
      title: '以太坊 ETF 获得通过',
      price: '200 USDC',
      potential: '+12.8%',
      aiScore: '85分',
      smartMoney: '🧱 聪明钱加仓',
      isPositive: true,
      color: 'bg-purple-500'
    },
    {
      id: '3',
      title: '美联储 3 月降息 25bp',
      price: '0.45 USDC',
      potential: '+122%',
      aiScore: '78分',
      smartMoney: '📈 机构布局',
      isPositive: true,
      color: 'bg-emerald-500'
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-tg-bg overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2">
          {stats.map((stat, i) => (
            <div 
              key={i}
              className="bg-tg-bubble p-3 rounded-xl border border-tg-border"
            >
              <p className="text-[10px] text-tg-text-muted mb-1 uppercase tracking-wider">{stat.label}</p>
              <p className={`text-lg font-bold ${stat.color || 'text-white'}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat, i) => (
            <button 
              key={i} 
              className={`px-4 py-1.5 rounded-full text-[13px] font-medium transition-all border shrink-0 ${i === 0 ? 'bg-tg-accent text-white border-tg-accent' : 'bg-tg-bubble text-tg-text-muted border-tg-border'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Market Cards */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[15px] font-bold text-white">热门预测</h2>
            <button className="text-[13px] text-tg-accent font-medium flex items-center gap-1">
              查看全部 <ChevronRight size={14} />
            </button>
          </div>

          {markets.map((market) => (
            <motion.div 
              key={market.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-tg-bubble p-4 rounded-2xl border border-tg-border space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-xl ${market.color} flex items-center justify-center text-white shrink-0`}>
                    <Globe size={20} />
                  </div>
                  <div>
                    <h3 className="text-[15px] font-bold text-white leading-tight mb-1">{market.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] px-1.5 py-0.5 bg-tg-bg rounded text-tg-accent font-bold">{market.aiScore}</span>
                      <span className="text-[11px] text-tg-text-muted font-medium">{market.smartMoney}</span>
                    </div>
                  </div>
                </div>
                <ArrowUpRight size={18} className="text-tg-text-muted" />
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-tg-border/50">
                <div className="flex gap-4">
                  <div>
                    <p className="text-[10px] text-tg-text-muted uppercase tracking-wider mb-0.5">价格</p>
                    <p className="text-[13px] font-bold text-white">{market.price}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-tg-text-muted uppercase tracking-wider mb-0.5">潜力</p>
                    <p className="text-[13px] font-bold text-emerald-500">{market.potential}</p>
                  </div>
                </div>
                <button className="px-4 py-1.5 bg-tg-accent text-white rounded-lg text-[13px] font-bold active:scale-95 transition-all">
                  跟单
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MarketDiscoveryView;
