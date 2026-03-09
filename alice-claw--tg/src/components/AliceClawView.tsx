import React from 'react';
import { Zap, Play, Pause, Settings, Plus, Sparkles, ShieldCheck, Clock, ArrowUpRight, CheckCircle2, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'motion/react';

const AliceClawView: React.FC = () => {
  const activeTasks = [
    {
      id: '1',
      name: '每日大选简报',
      status: '运行中',
      description: '每早 9:00 聚合 Polymarket 与新闻面，分析持有仓位风险。',
      lastRun: '2小时前',
      uptime: '12h 45m',
      pnl: '+$245.20',
      lastAction: '执行买入: Trump win'
    },
    {
      id: '2',
      name: 'Solana 鲸鱼追踪',
      status: '运行中',
      description: '监控顶级钱包，当其在大额调仓时立即推送。',
      lastRun: '15分钟前',
      uptime: '3d 2h',
      pnl: '+$1,120.50',
      lastAction: '发现新仓位: ETH ETF'
    }
  ];

  const templates = [
    {
      title: '套利追踪',
      desc: '自动搜寻跨平台预测差价。',
      icon: TrendingUp,
    },
    {
      title: '防黑天鹅',
      desc: '配置止损逻辑，自动提醒。',
      icon: ShieldCheck,
    },
    {
      title: '瞬间反应',
      desc: '基于 NLP 分析，5 秒内推荐。',
      icon: Zap,
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-tg-bg overflow-y-auto">
      <div className="p-4 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Alice Claw</h1>
            <p className="text-tg-text-muted text-[12px]">自动化您的预测市场研究与执行</p>
          </div>
          <button className="w-10 h-10 bg-tg-accent text-white rounded-full flex items-center justify-center shadow-lg shadow-tg-accent/30 active:scale-95 transition-all">
            <Plus size={24} />
          </button>
        </div>

        {/* Running Tasks */}
        <div className="space-y-3">
          <h2 className="text-[15px] font-bold text-white px-1">正在运行 ({activeTasks.length})</h2>
          <div className="space-y-3">
            {activeTasks.map((task) => (
              <motion.div 
                key={task.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-tg-bubble p-4 rounded-2xl border border-tg-border space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <h3 className="text-[15px] font-bold text-white">{task.name}</h3>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1.5 text-tg-text-muted hover:text-white transition-colors">
                      <Pause size={18} />
                    </button>
                    <button className="p-1.5 text-tg-text-muted hover:text-white transition-colors">
                      <Settings size={18} />
                    </button>
                  </div>
                </div>
                
                <p className="text-[13px] text-tg-text-muted leading-relaxed">{task.description}</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-tg-bg rounded-xl border border-tg-border">
                    <p className="text-[10px] text-tg-text-muted uppercase font-bold mb-1">累计盈亏</p>
                    <p className="text-[14px] font-bold text-emerald-500">{task.pnl}</p>
                  </div>
                  <div className="p-3 bg-tg-bg rounded-xl border border-tg-border">
                    <p className="text-[10px] text-tg-text-muted uppercase font-bold mb-1">运行时间</p>
                    <p className="text-[14px] font-bold text-white">{task.uptime}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-tg-border/50">
                  <div className="flex items-center gap-1.5 text-[11px] text-tg-text-muted">
                    <Clock size={12} />
                    <span>上次: {task.lastRun}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-tg-text-muted max-w-[120px] truncate">
                    <AlertCircle size={12} />
                    <span>{task.lastAction}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Templates */}
        <div className="space-y-3">
          <h2 className="text-[15px] font-bold text-white px-1">AI 推荐模板</h2>
          <div className="grid grid-cols-3 gap-2">
            {templates.map((template, i) => (
              <div key={i} className="bg-tg-bubble p-4 rounded-2xl border border-tg-border flex flex-col items-center text-center space-y-2 active:scale-95 transition-all cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-tg-bg flex items-center justify-center text-tg-accent">
                  <template.icon size={20} />
                </div>
                <h3 className="text-[12px] font-bold text-white leading-tight">{template.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AliceClawView;
