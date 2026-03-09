import React from 'react';
import { Wallet, TrendingUp, TrendingDown, Clock, ArrowUpRight, ChevronRight, PieChart, BarChart3, ShieldCheck, DollarSign } from 'lucide-react';
import { motion } from 'motion/react';

const PortfolioView: React.FC = () => {
  const positions = [
    {
      id: '1',
      event: '特朗普关税政策 (YES)',
      size: '500.00',
      entryPrice: '$0.48',
      currentPrice: '$0.55',
      pnl: '+$35.00',
      pnlPercent: '+8.5%',
      isPositive: true
    },
    {
      id: '2',
      event: '美联储降息 (YES)',
      size: '200.00',
      entryPrice: '$0.72',
      currentPrice: '$0.75',
      pnl: '+$6.00',
      pnlPercent: '-3.2%',
      isPositive: false
    },
    {
      id: '3',
      event: '特朗普 2028 辩论 (YES)',
      size: '120.00',
      entryPrice: '$0.42',
      currentPrice: '$0.38',
      pnl: '-$4.80',
      pnlPercent: '+12.4%',
      isPositive: true
    },
    {
      id: '4',
      event: '以太坊 ETF (YES)',
      size: '150.00',
      entryPrice: '$0.42',
      currentPrice: '$0.38',
      pnl: '-$4.80',
      pnlPercent: '-1.5%',
      isPositive: false
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-tg-bg overflow-y-auto">
      <div className="p-4 space-y-6">
        {/* Wallet Card */}
        <div className="bg-tg-accent p-6 rounded-3xl text-white space-y-4 shadow-lg shadow-tg-accent/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet size={18} />
              <span className="text-[13px] font-medium opacity-80 uppercase tracking-wider">我的钱包</span>
            </div>
            <button className="p-1.5 bg-white/20 rounded-lg">
              <ArrowUpRight size={16} />
            </button>
          </div>

          <div>
            <p className="text-[11px] opacity-70 mb-1">总账户余额 (USDC)</p>
            <h2 className="text-3xl font-bold tracking-tight">$42,560.00</h2>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/10">
            <div>
              <p className="text-[10px] opacity-60 uppercase tracking-wider mb-1">待结算</p>
              <p className="text-[15px] font-bold">$12,300.00</p>
            </div>
            <div>
              <p className="text-[10px] opacity-60 uppercase tracking-wider mb-1">24h 盈亏</p>
              <p className="text-[15px] font-bold text-emerald-300">+$1,245.50</p>
            </div>
          </div>
        </div>

        {/* Positions Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-[15px] font-bold text-white">当前头寸</h2>
            <button className="text-[13px] text-tg-accent font-medium">查看历史</button>
          </div>

          <div className="space-y-2">
            {positions.map((pos) => (
              <motion.div
                key={pos.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-tg-bubble p-4 rounded-2xl border border-tg-border flex items-center justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h3 className="text-[14px] font-bold text-white truncate mb-1">{pos.event}</h3>
                  <div className="flex items-center gap-3 text-[11px] text-tg-text-muted font-medium">
                    <span>仓位: {pos.size}</span>
                    <span>入场: {pos.entryPrice}</span>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <p className={`text-[14px] font-bold ${pos.isPositive ? 'text-emerald-500' : 'text-red-500'}`}>
                    {pos.pnl}
                  </p>
                  <p className={`text-[11px] font-bold ${pos.isPositive ? 'text-emerald-500' : 'text-red-500'} opacity-80`}>
                    {pos.pnlPercent}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <button className="flex items-center justify-center gap-2 p-4 bg-tg-bubble rounded-2xl border border-tg-border text-white font-bold text-[14px]">
            <TrendingUp size={18} className="text-emerald-500" />
            <span>充值</span>
          </button>
          <button className="flex items-center justify-center gap-2 p-4 bg-tg-bubble rounded-2xl border border-tg-border text-white font-bold text-[14px]">
            <TrendingDown size={18} className="text-red-500" />
            <span>提现</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PortfolioView;
