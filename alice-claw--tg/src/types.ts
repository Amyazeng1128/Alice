export type ViewType = 'chat' | 'discovery' | 'alice' | 'portfolio';

export interface MarketSignal {
  id: string;
  title: string;
  probability: number;
  change: number;
  volume: string;
  category: string;
  aiScore: number;
  smartMoneyFlow: 'in' | 'out' | 'neutral';
}

export interface Position {
  id: string;
  event: string;
  side: 'Long' | 'Short';
  entryPrice: number;
  currentPrice: number;
  pnl: number;
  pnlPercent: number;
}
