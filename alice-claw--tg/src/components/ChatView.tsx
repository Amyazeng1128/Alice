import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenAI } from "@google/genai";
import {
  Send, Paperclip, LayoutGrid, Zap, BarChart3,
  TrendingUp, ArrowUpRight, DollarSign, AlertTriangle,
  CheckSquare, Sparkles, BookOpen, Search, Info,
  Lightbulb, Rocket,
  Brain, MousePointer2, Plus
} from 'lucide-react';
import { ViewType } from '../types';

type MessageType = 'user' | 'ai';
type ContentType =
  | 'text'
  | 'market-analysis'
  | 'fed-analysis'
  | 'welcome-actions'
  | 'signal-push'
  | 'risk-guide'
  | 'positions'
  | 'stop-loss-confirm'
  | 'tariff-analysis'
  | 'probability-reasoning'
  | 'risk-reward-analysis'
  | 'signal-decoding'
  | 'learning-hub'
  | 'trade-prepare'
  | 'trade-success'
  | 'feedback-recorded'
  | 'latest-signals'
  | 'wallet-overview'
  | 'settings-menu'
  | 'agent-status'
  | 'agent-recommendations'
  | 'agent-custom-confirm'
  | 'portfolio-overview';

interface Message {
  id: string;
  type: MessageType;
  contentType: ContentType;
  text?: string;
  data?: any;
  isTyping?: boolean;
}

interface ChatViewProps {
  onViewChange?: (view: ViewType) => void;
}

const ChatView: React.FC<ChatViewProps> = ({ onViewChange }) => {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      type: 'ai',
      contentType: 'welcome-actions',
      text: '欢迎！Alice Claw 是你的 AI 交易助手。我可以帮你：',
      data: {
        footer: '你想从哪里开始呢？'
      }
    }
  ]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (text: string = inputValue, editMsgId?: string) => {
    if (!text.trim()) return;

    if (!editMsgId) {
      const userMsg: Message = {
        id: Date.now().toString(),
        type: 'user',
        contentType: 'text',
        text: text.trim()
      };
      setMessages(prev => [...prev, userMsg]);
    }
    setInputValue('');

    const placeholderId = editMsgId || (Date.now() + 1).toString();
    const hardcodedResponse = getHardcodedResponse(text.trim());

    if (hardcodedResponse) {
      if (editMsgId) {
        // In-place update / EditMessage
        setMessages(prev => prev.map(m =>
          m.id === placeholderId
            ? { ...m, ...hardcodedResponse, isTyping: false, id: placeholderId }
            : m
        ));
        return;
      }
      // Handle hardcoded response with typing animation
      const initialAiMsg: Message = {
        ...hardcodedResponse,
        id: placeholderId,
        text: '',
        isTyping: true,
        data: hardcodedResponse.contentType === 'trade-success' ? null : hardcodedResponse.data
      };

      setMessages(prev => [...prev, initialAiMsg]);

      if (hardcodedResponse.contentType === 'trade-success') {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setMessages(prev => prev.map(m =>
          m.id === placeholderId ? { ...m, ...hardcodedResponse, isTyping: false } : m
        ));
      } else {
        const fullText = hardcodedResponse.text || '';
        if (fullText) {
          for (let i = 1; i <= fullText.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 10));
            setMessages(prev => prev.map(m =>
              m.id === placeholderId ? { ...m, text: fullText.slice(0, i) } : m
            ));
          }
        }

        setMessages(prev => prev.map(m =>
          m.id === placeholderId ? { ...m, isTyping: false } : m
        ));
      }
    } else {
      // Fallback to Gemini
      const initialAiMsg: Message = {
        id: placeholderId,
        type: 'ai',
        contentType: 'text',
        text: '',
        isTyping: true
      };
      setMessages(prev => [...prev, initialAiMsg]);

      try {
        const ai = new GoogleGenAI({ apiKey: (import.meta as any).env.VITE_GEMINI_API_KEY || 'dummy_key' });
        const response = await ai.models.generateContent({
          model: "gemini-3-flash-preview",
          contents: text.trim(),
          config: {
            systemInstruction: "你是一个专业的预测市场交易助手 Alice Claw。你的语气专业、冷静、乐于助人。你擅长分析金融市场、预测市场（如 Polymarket）和地缘政治。如果用户问的问题不在你的专业范围内，请礼貌地引导他们回到预测市场相关的话题。请使用中文回答。"
          }
        });

        const geminiText = response.text || '抱歉，我暂时无法处理您的请求。';

        // Animate Gemini response
        for (let i = 1; i <= geminiText.length; i++) {
          // Faster typing for longer AI responses
          if (i % 3 === 0) await new Promise(resolve => setTimeout(resolve, 5));
          setMessages(prev => prev.map(m =>
            m.id === placeholderId ? { ...m, text: geminiText.slice(0, i) } : m
          ));
        }

        setMessages(prev => prev.map(m =>
          m.id === placeholderId ? { ...m, isTyping: false } : m
        ));
      } catch (error) {
        console.error('Gemini API Error:', error);
        setMessages(prev => prev.map(m =>
          m.id === placeholderId ? {
            ...m,
            text: '连接 AI 服务时出现错误，请稍后再试。',
            isTyping: false
          } : m
        ));
      }
    }
  };

  const getHardcodedResponse = (input: string): Message | null => {
    const id = (Date.now() + 1).toString();
    const normalizedInput = input.toLowerCase().trim();

    if (normalizedInput === '/start') {
      return {
        id,
        type: 'ai',
        contentType: 'welcome-actions',
        text: '欢迎！Alice Claw 是你的 AI 交易助手。我可以帮你：',
        data: {
          footer: '你想从哪里开始呢？'
        }
      };
    }

    if (normalizedInput.includes('关税') && normalizedInput.includes('分析')) {
      return {
        id,
        type: 'ai',
        contentType: 'tariff-analysis',
        text: '正在分析特朗普关税政策相关市场...',
        data: {
          markets: [
            '特朗普关税政策通过概率 (YES: 62%)',
            '美股指数预测市场 (YES: 45%)',
            '美元走势预测市场 (YES: 58%)'
          ],
          analysis: '🧠 AI 分析：基于近期新闻和聪明钱动向，关税政策通过概率上升 8%...'
        }
      };
    }

    if (normalizedInput.includes('关税') && normalizedInput.includes('概率') && normalizedInput.includes('上升')) {
      return {
        id,
        type: 'ai',
        contentType: 'probability-reasoning',
        text: '主要原因有三点：',
        data: {
          reasons: [
            { title: '聪明钱动向', desc: '过去 24 小时，顶级交易员增加 YES 仓位 $2.3M' },
            { title: '新闻情绪', desc: '特朗普最新演讲提及关税政策，正面报道占比 68%' },
            { title: '历史对比', desc: '类似政策在 2018 年通过概率为 71%' }
          ]
        }
      };
    }

    if (normalizedInput.includes('风险收益比') || (normalizedInput.includes('风险') && normalizedInput.includes('收益'))) {
      return {
        id,
        type: 'ai',
        contentType: 'risk-reward-analysis',
        text: '风险收益分析',
        data: {
          scenario: '当前情境',
          metrics: [
            { label: '入场价格', value: 'YES 62%' },
            { label: '潜在收益', value: '若通过，涨至 90%+ (+45%)' },
            { label: '潜在亏损', value: '若不通过，跌至 20% (-68%)' },
            { label: '预期收益', value: '+28% (基于当前概率)' }
          ]
        }
      };
    }

    if (normalizedInput.includes('止损') && (normalizedInput.includes('美联储') || normalizedInput.includes('fed'))) {
      return {
        id,
        type: 'ai',
        contentType: 'stop-loss-confirm',
        text: '止损已设置',
        data: {
          market: '美联储降息',
          price: '40.5% (-10%)',
          action: '自动卖出'
        }
      };
    }

    if (normalizedInput.includes('美联储') || normalizedInput.includes('降息') || normalizedInput.includes('fed')) {
      return {
        id,
        type: 'ai',
        contentType: 'fed-analysis',
        text: '美联储 3 月降息市场深度分析',
        data: {
          overview: {
            price: 'YES 45%',
            change: '+3%',
            volume: '$8.3M',
            oi: '$15.2M'
          },
          news: [
            { text: '鲍威尔讲话暗示可能暂停加息', time: '2小时前' },
            { text: 'CPI 数据低于预期，通胀放缓', time: '昨天' }
          ]
        }
      };
    }

    if (normalizedInput === '钱包' || normalizedInput === '我的钱包' || normalizedInput === '/wallet') {
      return {
        id,
        type: 'ai',
        contentType: 'wallet-overview',
        text: '💼 我的钱包',
        data: {
          balance: '1250.00 USDC'
        }
      };
    }

    if (normalizedInput === '设置' || normalizedInput === '系统设置' || normalizedInput === '/settings') {
      return {
        id,
        type: 'ai',
        contentType: 'settings-menu',
        text: '偏好设置',
        data: {}
      };
    }

    if (normalizedInput === '开启体育信号') {
      return {
        id,
        type: 'ai',
        contentType: 'text',
        text: '✅ 体育赛事信号已成功开启！您将收到相关赛事的智能预测推送。'
      };
    }

    if (normalizedInput === 'switch to english') {
      return {
        id,
        type: 'ai',
        contentType: 'text',
        text: 'Language preference saved! The interface will be updated shortly.'
      };
    }

    if (normalizedInput === 'alice claw' || normalizedInput === '任务管理' || normalizedInput === '返回主控台' || normalizedInput === '执行交易' || normalizedInput === '/agent') {
      return {
        id,
        type: 'ai',
        contentType: 'agent-status',
        text: '🤖 Alice Claw | Agent 调度中心',
        data: {}
      };
    }

    if (normalizedInput === '查看更多推荐' || normalizedInput === '管理运行中任务') {
      return {
        id,
        type: 'ai',
        contentType: 'agent-recommendations',
        text: '💡 发现更多 AI 自动化能力：',
        data: {}
      };
    }

    if (normalizedInput === '创建自定义指令' || normalizedInput === '➕ 创建自定义指令') {
      return {
        id,
        type: 'ai',
        contentType: 'text',
        text: '请告诉我你希望我监控什么？例如：“当某地址买入时通知我”或“某事件概率变动时提醒我”。'
      };
    }

    if (normalizedInput.includes('通知我') || normalizedInput.includes('提醒我')) {
      return {
        id,
        type: 'ai',
        contentType: 'agent-custom-confirm',
        text: '已识别任务：',
        data: { instruction: input }
      };
    }

    if (normalizedInput === '确认开启') {
      return {
        id,
        type: 'ai',
        contentType: 'text',
        text: '✅ 自定义监控任务已成功开启！'
      };
    }

    if (normalizedInput === '取消订阅') {
      return {
        id,
        type: 'ai',
        contentType: 'text',
        text: '🔕 您的订阅已被暂时挂起。您可以随时通过设置面板重新开启。'
      };
    }

    if (normalizedInput.includes('不感兴趣') || normalizedInput.includes('不想看') || normalizedInput.includes('不要推') || normalizedInput.includes('别推') || normalizedInput.includes('不喜欢')) {
      return {
        id,
        type: 'ai',
        contentType: 'feedback-recorded',
        text: '收到，偏好已更新',
        data: {
          insight: '已将该类话题降权，之后将减少此类相关推送。'
        }
      };
    }

    if (normalizedInput === '/portfolio' || normalizedInput === '查看持仓' || normalizedInput.includes('查看持仓') || normalizedInput.includes('资金与持仓') || normalizedInput.includes('我的持仓')) {
      return {
        id,
        type: 'ai',
        contentType: 'portfolio-overview',
        text: '💼 您的资金与持仓概览',
        data: {
          totalBalance: '$42,560.00',
          pnl24h: '+$1,245.50',
          positions: [
            { id: 'p1', title: '特朗普关税政策 (YES)', pnl: '+8.5%', isPositive: true },
            { id: 'p2', title: '美联储降息 (YES)', pnl: '-3.2%', isPositive: false },
            { id: 'p3', title: '特朗普 2028 辩论 (YES)', pnl: '+12.4%', isPositive: true },
            { id: 'p4', title: '以太坊 ETF (YES)', pnl: '-1.5%', isPositive: false }
          ]
        }
      };
    }

    if (normalizedInput === '最新信号' || normalizedInput === '执行交易' || normalizedInput === 'latest signals' || normalizedInput.includes('最新信号') || normalizedInput.includes('获取最新信号')) {
      return {
        id,
        type: 'ai',
        contentType: 'latest-signals',
        text: '🔥 AliceClaw | 最新市场情报',
        data: {
          hotPredictions: [
            { id: '1', title: '美军将于 3 月 14 日前进入伊朗？', extra: '概率：22% | 成交量：$9.7M 🔥' },
            { id: '2', title: 'BTC 3 月底突破 $90k？', extra: '概率：14.6% | 盈亏比：高' }
          ],
          smartMoney: [
            { id: '3', account: '新账户大额押注：$23.5k 注入伊朗预测', desc: '动态：20 分钟前建仓 | 均价 19.3¢' },
            { id: '4', account: '巨鲸加仓：以太坊 ETF 3 月通过', desc: '动态：加仓 $50k | 胜率 72% 👑' }
          ]
        }
      };
    }

    if (normalizedInput.startsWith('decode_') || normalizedInput.includes('查看解读') || normalizedInput.includes('解读信号') || normalizedInput.includes('详情')) {
      const isAlt = normalizedInput.includes('2') || normalizedInput.includes('4');
      const eventTitle = isAlt ? '巨鲸加仓：以太坊 ETF 3 月通过' : '新账户押注 $23.5k 美军将于 3 月 14 日前进入伊朗';
      return {
        id,
        type: 'ai',
        contentType: 'signal-decoding',
        text: eventTitle,
        data: {
          image: 'https://i.postimg.cc/0N0FHC2f/photo-2026-03-09-17-35-07.jpg',
          overview: isAlt
            ? '巨鲸持续增持以太坊ETF 3月通过，目前资金净流入已达$50k，综合胜率模型预估为72%。'
            : '在预测市场 Polymarket 上，20 分钟前一个新账户投入 $23.5k 买入「美军将在 3 月 14 日前进入伊朗」，开仓均价为 19.3¢，目前概率为 22%。该账户仍有约 $36k 可用资金。',
          aiInsight: isAlt
            ? '虽然市场整体受监管压力波动，但聪明钱持续建仓说明内部消息或深度评估极具信心。'
            : '虽然官方暂未宣布行动，但区域冲突推进构成了盘口概率背景。需注意结算规则：仅限出于作战目的（军事、人道主义等）蓄意进入伊朗领土才符合结算条件。',
          address: isAlt ? '0x1a2b3c4d5e6f7g8h9i0j' : '0x8f0f97f5fd54d9d74b34aca60709d42aada6dcda',
          tradeId: isAlt ? 2 : 1
        }
      };
    }

    if (normalizedInput.startsWith('trade_') || normalizedInput === '准备买入' || normalizedInput === '买入' || normalizedInput === '立即跟单' || normalizedInput === '跟单' || normalizedInput.includes('一键跟单')) {
      const isAlt = normalizedInput.includes('2');
      return {
        id,
        type: 'ai',
        contentType: 'trade-prepare',
        text: '🚀 准备执行跟单',
        data: {
          market: isAlt ? '以太坊 ETF 3月通过' : '美军将在 3 月 14 日前进入伊朗',
          price: isAlt ? '0.45 USDC' : '0.19 USDC',
          balance: '1250 USDC',
          amounts: ['50 USDC', '100 USDC', '200 USDC', '⌨️ 自定义'],
          tradeId: isAlt ? 2 : 1
        }
      };
    }

    if (normalizedInput.includes('usdc') || normalizedInput.includes('自定义') || normalizedInput === '执行') {
      const amountMatched = normalizedInput.match(/\d+/);
      const amountVal = amountMatched ? amountMatched[0] : '50';
      const price = 0.62;
      const shares = (parseInt(amountVal) / price).toFixed(1);

      return {
        id,
        type: 'ai',
        contentType: 'trade-success',
        text: '✅ 交易执行成功！',
        data: {
          shares: `${shares} 份 YES 份额`,
          cost: '0.62 USDC',
          stopLoss: '✅ 智能防御开启：止损线已设为 -10% (0.55 USDC)'
        }
      };
    }

    if (normalizedInput.includes('取消交易')) {
      return {
        id,
        type: 'ai',
        contentType: 'text',
        text: '交易已取消。您可以继续查看最新的市场信号。'
      };
    }

    if (normalizedInput === '/help' || normalizedInput.includes('学习知识') || normalizedInput.includes('学习中心')) {
      return {
        id,
        type: 'ai',
        contentType: 'learning-hub',
        text: '💡 AliceClaw 预测课堂',
        data: {
          subtitle: '你想了解哪方面的知识？',
          levels: [
            {
              icon: '🟢',
              title: '入门级：什么是预测市场？',
              desc: '了解预测市场与传统博彩的本质区别。'
            },
            {
              icon: '🟡',
              title: '进阶级：如何追踪聪明钱？',
              desc: '学习解析 $1M 以上大额资金流向的信号意义。'
            },
            {
              icon: '🔴',
              title: '实战级：Alice AI 评分系统说明',
              desc: '了解 1.42B 总交易量背后的算法评估逻辑。'
            }
          ]
        }
      };
    }

    if (normalizedInput.includes('什么是预测市场')) {
      return {
        id,
        type: 'ai',
        contentType: 'text',
        text: '🟢 入门级：什么是预测市场？\n\n**核心定义**：\n预测市场（Prediction Markets）是允许用户对未来事件结果进行押注的交易平台。不同于传统博彩，它更像是一个**“去中心化的民调机构”**。\n\n**与传统博彩的本质区别**：\n\n• **价格即概率**：在 Polymarket 等平台上，一份合约的价格（如 0.22 USDC）直接代表了市场认为该事件发生的概率（22%）。\n\n• **群体智慧**：价格会随着新信息的加入实时波动，能够比传统民调更精准地预判地缘政治或宏观经济走向。\n\n• **双向流动性**：你可以随时买入（Yes）或卖出（No），无需等待事件结果即可平仓获利。'
      };
    }

    if (normalizedInput.includes('如何追踪聪明钱')) {
      return {
        id,
        type: 'ai',
        contentType: 'text',
        text: '🟡 进阶级：如何追踪聪明钱？\n\n**核心逻辑**：\n“聪明钱”（Smart Money）通常指那些拥有内幕信息、深度行业洞察或高胜率记录的地址。追踪 $1M 以上的大额资金流向，是为了识别非对称信息风险。\n\n**追踪技巧**：\n\n• **识别新账户异动**：关注那些突然存入大笔资金并精准建仓未热议市场的账户。例如，一个新账户押注 $23.5k 押注伊朗事件。\n\n• **分析建仓成本**：观察聪明钱的平均成本（如 19.3¢）与当前市价的差距。\n\n• **多维度交叉验证**：结合社交媒体情绪与链上大额转账。当聪明钱顶级交易员进行大额反向建仓时，通常是极佳的风险预警信号。'
      };
    }

    if (normalizedInput.includes('评分系统说明')) {
      return {
        id,
        type: 'ai',
        contentType: 'text',
        text: '🔴 实战级：Alice AI 评分系统说明\n\n**核心原理**：\nAlice AI 系统通过对超过 1.42B 的历史总交易量进行回测，利用机器学习算法对每一个实时信号进行置信度评估。\n\n**核心算法评估逻辑**：\n\n• **资金质量分析**：区分“散户跟风”与“巨鲸布局”，为大额资金流入（如 $4.2M 流入）分配更高权重。\n\n• **NLP 情绪识别**：实时抓取 X (Twitter) 及路透社等新闻源，分析舆论变化与盘口概率的偏离度。\n\n• **冲突裁决模型**：当市场出现剧烈分歧时，AI 会对比多个预测市场的价差，找出套利空间或风险点。\n\n• **自动化风控**：系统会根据评分自动建议止损线（如 -10%）并监控地址是否反向平仓。'
      };
    }

    if (normalizedInput.includes('开始阅读第一课')) {
      return {
        id,
        type: 'ai',
        contentType: 'text',
        text: '🟢 入门级：什么是预测市场？\n\n**核心定义**：\n预测市场（Prediction Markets）是允许用户对未来事件结果进行押注的交易平台。不同于传统博彩，它更像是一个**“去中心化的民调机构”**。\n\n**与传统博彩的本质区别**：\n\n• **价格即概率**：在 Polymarket 等平台上，一份合约的价格（如 0.22 USDC）直接代表了市场认为该事件发生的概率（22%）。\n\n• **群体智慧**：价格会随着新信息的加入实时波动，能够比传统民调更精准地预判地缘政治或宏观经济走向。\n\n• **双向流动性**：你可以随时买入（Yes）或卖出（No），无需等待事件结果即可平仓获利。'
      };
    }

    if (normalizedInput.includes('分析市场')) {
      return {
        id,
        type: 'ai',
        contentType: 'market-analysis',
        text: '📊 AliceClaw 市场洞察',
        data: {
          segments: [
            { name: '政治大选', heat: '92%', desc: '特朗普关税政策概率波动中。' },
            { name: '加密生态', heat: '85%', desc: 'BTC 3 月底价格预测交易活跃。' },
            { name: '宏观经济', heat: '78%', desc: '美联储降息预期出现分歧。' }
          ],
          smartMoney: '过去 24 小时，约有 $12.5M 资金从“娱乐板块”流向“政策预测”，显示市场避险情绪升温。',
          footer: '💡 你可以回复“查看政治”获取深度分析报告。'
        }
      };
    }

    if (normalizedInput.includes('关税信号') || (normalizedInput.includes('关税') && normalizedInput.includes('信号'))) {
      return {
        id,
        type: 'ai',
        contentType: 'signal-push',
        text: '特朗普关税政策通过',
        data: {
          rating: '78',
          direction: 'YES',
          price: '62%',
          position: '$100-200',
          risk: '中等',
          summary: [
            '聪明钱动向：顶级交易员持续加仓',
            '新闻支撑：政策言论明确，媒体报道正面',
            '市场质量：流动性充足，价差合理'
          ]
        }
      };
    }

    if (normalizedInput.includes('信号') || normalizedInput.includes('推荐') || normalizedInput.includes('最新')) {
      return {
        id,
        type: 'ai',
        contentType: 'signal-push',
        text: 'Will Bitcoin dip to $64,000 March 2-8?',
        data: {
          recommendation: 'No',
          price: '99¢',
          potential: '$100 → $101 (+1%)',
          confidence: '84/100'
        }
      };
    }

    if (normalizedInput.includes('btc') || normalizedInput.includes('比特币')) {
      return {
        id,
        type: 'ai',
        contentType: 'signal-push',
        text: '比特币 3 月份会跌至 55,000 美元吗？',
        data: {
          recommendation: 'No',
          price: '75¢',
          potential: '$100 → $133 (+33%)',
          confidence: '70/100'
        }
      };
    }

    return null;
  };

  const renderMessageContent = (msg: Message) => {
    if (msg.isTyping && msg.type === 'ai' && !msg.text) {
      if (msg.contentType === 'trade-success') {
        return (
          <div className="flex items-center gap-2 py-2 text-emerald-400">
            <svg className="animate-spin h-4 w-4 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="text-[12px] font-bold">交易执行中...</span>
          </div>
        );
      }
      return (
        <div className="flex gap-1 py-1">
          <div className="w-1.5 h-1.5 bg-tg-text-muted rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 bg-tg-text-muted rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 bg-tg-text-muted rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      );
    }

    switch (msg.contentType) {
      case 'welcome-actions':
        return (
          <div className="space-y-3">
            <p className="text-[13px] font-bold leading-relaxed">{msg.text}</p>
            <div className="space-y-1.5">
              <button
                onClick={() => handleSend('获取最新信号')}
                className="w-full flex items-center gap-2 p-2 bg-tg-header border border-tg-border rounded-lg hover:bg-tg-border transition-colors text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-tg-bg flex items-center justify-center shrink-0">
                  <BarChart3 size={16} className="text-tg-text-muted group-hover:text-tg-accent transition-colors" />
                </div>
                <div>
                  <div className="text-[12px] font-bold">获取最新信号</div>
                  <div className="text-[10px] text-tg-text-muted">获取当前 AI 评分最高聪明钱信号</div>
                </div>
              </button>
              <button
                onClick={() => handleSend('解读信号')}
                className="w-full flex items-center gap-2 p-2 bg-tg-header border border-tg-border rounded-lg hover:bg-tg-border transition-colors text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-tg-bg flex items-center justify-center shrink-0">
                  <Search size={16} className="text-tg-text-muted group-hover:text-tg-accent transition-colors" />
                </div>
                <div>
                  <div className="text-[12px] font-bold">解读信号</div>
                  <div className="text-[10px] text-tg-text-muted">解释交易信号的含义和逻辑</div>
                </div>
              </button>
              <button
                onClick={() => handleSend('学习知识')}
                className="w-full flex items-center gap-2 p-2 bg-tg-header border border-tg-border rounded-lg hover:bg-tg-border transition-colors text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-tg-bg flex items-center justify-center shrink-0">
                  <Lightbulb size={16} className="text-tg-text-muted group-hover:text-tg-accent transition-colors" />
                </div>
                <div>
                  <div className="text-[12px] font-bold">学习知识</div>
                  <div className="text-[10px] text-tg-text-muted">学习预测市场的基础知识和策略</div>
                </div>
              </button>
              <button
                onClick={() => handleSend('执行交易')}
                className="w-full flex items-center gap-2 p-2 bg-tg-header border border-tg-border rounded-lg hover:bg-tg-border transition-colors text-left group"
              >
                <div className="w-8 h-8 rounded-lg bg-tg-bg flex items-center justify-center shrink-0">
                  <Rocket size={16} className="text-tg-text-muted group-hover:text-tg-accent transition-colors" />
                </div>
                <div>
                  <div className="text-[12px] font-bold">执行交易</div>
                  <div className="text-[10px] text-tg-text-muted">一键跟单，快速参与市场</div>
                </div>
              </button>
            </div>
            {msg.data?.footer && (
              <p className="text-[13px] font-bold leading-relaxed">{msg.data.footer}</p>
            )}
          </div>
        );

      case 'market-analysis':
        return (
          <div className="space-y-3">
            <h3 className="text-[14px] font-bold">{msg.text}</h3>
            <div className="space-y-2">
              <div className="text-[12px] font-bold text-tg-text-muted">当前热度 Top 3 板块：</div>
              {msg.data.segments.map((seg: any, i: number) => (
                <div key={i} className="p-2 bg-tg-header border border-tg-border rounded-lg space-y-1">
                  <div className="flex justify-between items-center">
                    <span className="text-[12px] font-bold">{seg.name}</span>
                    <span className="text-[10px] text-orange-500 font-bold">热度：🔥 {seg.heat}</span>
                  </div>
                  <p className="text-[11px] text-tg-text-muted leading-snug">{seg.desc}</p>
                </div>
              ))}
            </div>
            <div className="p-2 bg-tg-bubble border border-tg-border rounded-lg space-y-1">
              <div className="text-[12px] font-bold">聪明钱动向：</div>
              <p className="text-[11px] leading-relaxed">{msg.data.smartMoney}</p>
            </div>
            {msg.data.footer && (
              <p className="text-[12px] text-tg-accent font-medium">{msg.data.footer}</p>
            )}
          </div>
        );

      case 'fed-analysis':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BarChart3 size={20} className="text-tg-text-muted" />
              <h3 className="text-[14px] font-bold">{msg.text}</h3>
            </div>

            <div className="p-3 bg-tg-header border border-tg-border rounded-lg space-y-3">
              <h4 className="text-[12px] font-bold">市场概况</h4>
              <div className="grid grid-cols-2 gap-y-2 gap-x-3">
                <div>
                  <div className="text-[10px] text-tg-text-muted mb-0.5">当前价格:</div>
                  <div className="text-[12px] font-medium">{msg.data.overview.price}</div>
                </div>
                <div>
                  <div className="text-[10px] text-tg-text-muted mb-0.5">24h 变化:</div>
                  <div className="text-[12px] font-medium text-emerald-500">{msg.data.overview.change}</div>
                </div>
                <div>
                  <div className="text-[10px] text-tg-text-muted mb-0.5">交易量:</div>
                  <div className="text-[12px] font-medium">{msg.data.overview.volume}</div>
                </div>
                <div>
                  <div className="text-[10px] text-tg-text-muted mb-0.5">持仓量:</div>
                  <div className="text-[12px] font-medium">{msg.data.overview.oi}</div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <LayoutGrid size={18} className="text-tg-text-muted" />
                <h4 className="text-[12px] font-bold">最新新闻</h4>
              </div>
              <ul className="space-y-2 pl-1">
                {msg.data.news.map((item: any, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-[12px] leading-snug">
                    <span className="text-tg-text-muted mt-1">•</span>
                    <span>{item.text} <span className="text-tg-text-muted">({item.time})</span></span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );

      case 'positions':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <BarChart3 size={20} className="text-rose-500" />
              <h3 className="text-[14px] font-bold text-rose-500">{msg.text}</h3>
            </div>
            <div className="space-y-2">
              {msg.data.positions.map((pos: any, idx: number) => (
                <div key={idx} className="p-3 bg-tg-header border border-tg-border rounded-lg space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[13px] font-bold">{pos.name} {pos.change}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-y-1.5 text-[11px]">
                    <div className="text-tg-text-muted">持仓: <span className="text-tg-text font-medium">{pos.holding}</span></div>
                    <div className="text-tg-text-muted">入场: <span className="text-tg-text font-medium">{pos.entry}</span></div>
                    <div className="text-tg-text-muted">当前: <span className="text-tg-text font-medium">{pos.current}</span></div>
                    <div className="text-tg-text-muted">盈亏: <span className={pos.isPositive ? 'text-emerald-500 font-bold' : 'text-rose-500 font-bold'}>{pos.pnl}</span></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <span className="text-[14px] font-bold">总盈亏 <span className="text-tg-text">{msg.data.totalPnl}</span></span>
            </div>
          </div>
        );

      case 'stop-loss-confirm':
        return (
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <CheckSquare size={20} className="text-rose-500" />
              <h3 className="text-[14px] font-bold text-rose-500">{msg.text}</h3>
            </div>
            <div className="space-y-2 text-[12px]">
              <div className="flex gap-2">
                <span className="text-tg-text-muted">市场:</span>
                <span className="font-medium">{msg.data.market}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-tg-text-muted">止损价格:</span>
                <span className="font-medium">{msg.data.price}</span>
              </div>
              <div className="flex gap-2">
                <span className="text-tg-text-muted">触发后操作:</span>
                <span className="font-medium">{msg.data.action}</span>
              </div>
            </div>
          </div>
        );

      case 'tariff-analysis':
        return (
          <div className="space-y-3 -m-0.5">
            <p className="text-[13px] font-bold text-white mb-2">{msg.text}</p>
            <div className="bg-white/10 rounded-lg p-3 space-y-2 border border-white/10">
              <div className="flex items-center gap-2 text-[12px] font-bold text-white">
                <BarChart3 size={16} />
                <span>找到 3 个相关市场:</span>
              </div>
              <ul className="space-y-1.5 text-[11px] text-white/90">
                {msg.data.markets.map((m: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1">•</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </div>
            <p className="text-[12px] font-medium text-white/90 leading-relaxed">
              {msg.data.analysis}
            </p>
            <div className="flex gap-1.5 pt-1">
              <button className="flex-1 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-[10px] font-bold text-white transition-colors">查看详情</button>
              <button className="flex-1 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-[10px] font-bold text-white transition-colors">一键交易</button>
              <button className="flex-1 py-1.5 bg-white/20 hover:bg-white/30 rounded-full text-[10px] font-bold text-white transition-colors">加入观察</button>
            </div>
          </div>
        );

      case 'probability-reasoning':
        return (
          <div className="space-y-3 -m-0.5">
            <p className="text-[13px] font-bold text-white mb-2">{msg.text}</p>
            <div className="space-y-2">
              {msg.data.reasons.map((r: any, i: number) => (
                <div key={i} className="flex items-start gap-2">
                  <div className="w-5 h-5 rounded-md bg-white/20 flex items-center justify-center shrink-0 text-[10px] font-bold text-white">
                    {i + 1}
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-[12px] font-bold text-white">{r.title}:</div>
                    <div className="text-[11px] text-white/80 leading-snug">{r.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'risk-reward-analysis':
        return (
          <div className="space-y-3 -m-0.5">
            <div className="flex items-center gap-2 text-[13px] font-bold text-white mb-0.5">
              <span>📈</span>
              <span>{msg.text}</span>
            </div>
            <div className="bg-white/10 rounded-lg overflow-hidden border border-white/10">
              <div className="px-3 py-1.5 bg-white/10 border-bottom border-white/10">
                <span className="text-[12px] font-bold text-white">{msg.data.scenario}</span>
              </div>
              <div className="p-3 space-y-2">
                {msg.data.metrics.map((m: any, i: number) => (
                  <div key={i} className="flex justify-between items-center text-[11px]">
                    <span className="text-white/70">{m.label}:</span>
                    <span className="font-bold text-white">{m.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'signal-decoding':
        return (
          <div className="space-y-3 -m-0.5 max-w-[300px] sm:max-w-[340px]">
            {msg.data.image && (
              <div className="w-full h-auto aspect-[16/9] max-h-36 rounded-lg overflow-hidden border border-white/10">
                <img src={msg.data.image} alt="Chart" className="w-full h-full object-cover" />
              </div>
            )}

            <div className="text-[14px] font-bold text-white mb-2">
              {msg.text}
            </div>

            <div className="space-y-2 text-[12px] text-white">
              <div className="font-bold text-white/50">市场概况：</div>
              <div className="text-white/80 leading-relaxed">{msg.data.overview}</div>
            </div>

            <div className="space-y-2 text-[12px] text-white">
              <div className="font-bold text-white/50">AI 洞察：</div>
              <div className="text-white/80 leading-relaxed">{msg.data.aiInsight}</div>
            </div>

            <div className="space-y-2 text-[12px] text-white break-all">
              <div className="font-bold text-white/50">账户地址：</div>
              <div className="text-emerald-400 font-mono text-[11px] underline cursor-pointer">{msg.data.address}</div>
            </div>

            <div className="flex gap-2 pt-2 text-[12px]">
              <button
                onClick={() => handleSend(`trade_${msg.data.tradeId}`)}
                className="flex-[2] py-2 bg-tg-accent hover:bg-tg-accent/80 rounded font-bold text-white transition-colors flex items-center justify-center gap-1"
              >
                <span>🚀 准备执行跟单</span>
              </button>
              <button
                onClick={() => handleSend('最新信号', msg.id)}
                className="flex-[1.5] py-2 bg-white/10 hover:bg-white/20 rounded font-bold text-white transition-colors flex items-center justify-center gap-1"
              >
                <span>� 返回信号列表</span>
              </button>
            </div>
          </div>
        );

      case 'learning-hub':
        return (
          <div className="space-y-3 -m-0.5">
            <div className="flex items-center gap-2 text-[13px] font-bold text-white mb-0.5">
              <span>💡</span>
              <span>{msg.text}</span>
            </div>
            <p className="text-[12px] text-white/80">{msg.data.subtitle}</p>

            <div className="space-y-2.5">
              {msg.data.levels.map((level: any, i: number) => (
                <button
                  key={i}
                  onClick={() => handleSend(level.title)}
                  className="w-full text-left p-2.5 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[14px]">{level.icon}</span>
                    <span className="text-[12px] font-bold text-white group-hover:text-tg-accent transition-colors">{level.title}</span>
                  </div>
                  <p className="text-[11px] text-white/60 leading-snug pl-6">{level.desc}</p>
                </button>
              ))}
            </div>

            <div className="flex gap-1.5 pt-1">
              <button
                onClick={() => handleSend('开始阅读第一课')}
                className="flex-1 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-[11px] font-bold text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <span>📖 开始阅读第一课</span>
              </button>
              <button
                onClick={() => handleSend('向 AI 提问')}
                className="flex-1 py-1.5 bg-white/10 hover:bg-white/20 rounded-full text-[11px] font-bold text-white transition-colors flex items-center justify-center gap-1.5"
              >
                <span>❓ 向 AI 提问</span>
              </button>
            </div>
          </div>
        );

      case 'trade-prepare':
        return (
          <div className="space-y-3 -m-0.5">
            <div className="flex items-center gap-2 text-[14px] font-bold text-white mb-2 pb-2 border-b border-white/10">
              <span>{msg.text}</span>
            </div>
            <div className="space-y-2 text-[12px] bg-white/5 p-3 rounded-lg border border-white/10">
              <div className="flex justify-between">
                <span className="font-bold text-white">目标：</span>
                <span className="font-bold text-white">{msg.data.market}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-white">参考单价：</span>
                <span className="font-bold text-white">{msg.data.price}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-white">钱包余额：</span>
                <span className="text-tg-accent font-bold">{msg.data.balance}</span>
              </div>
            </div>

            <div className="pt-1 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {msg.data.amounts.map((amt: string, i: number) => (
                  <button
                    key={i}
                    onClick={() => handleSend(amt, msg.id)}
                    className="py-2.5 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg font-bold text-[13px] text-white transition-colors flex justify-center items-center"
                  >
                    {amt}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handleSend(`取消交易_${msg.data.tradeId}`, msg.id)}
                className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/5 rounded-lg font-bold text-[13px] text-white/80 transition-colors flex justify-center items-center"
              >
                ❌ 取消本次跟单
              </button>
            </div>
          </div>
        );

      case 'trade-success':
        return (
          <div className="space-y-3 -m-0.5">
            <div className="flex items-center gap-2 text-[14px] font-bold text-emerald-400 pb-2 border-b border-white/10">
              <span>✅</span>
              <span>{msg.text}</span>
            </div>

            <div className="space-y-1.5 text-[12px] bg-white/5 p-3 rounded-lg border border-white/10">
              <div className="flex justify-between">
                <span className="font-bold text-white">已买入：</span>
                <span className="text-white">{msg.data.shares}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-bold text-white">平均成本：</span>
                <span className="text-white">{msg.data.cost}</span>
              </div>
            </div>

            <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg mt-2">
              <p className="text-[12px] text-emerald-400 font-bold">
                {msg.data.stopLoss}
              </p>
            </div>

            <div className="flex gap-2 pt-2 text-[12px]">
              <button
                onClick={() => handleSend('查看持仓', msg.id)}
                className="flex-[2] py-2 bg-white/10 hover:bg-white/20 rounded font-bold text-white transition-colors flex items-center justify-center gap-1"
              >
                <span>📈 查看资金与持仓</span>
              </button>
              <button
                onClick={() => handleSend('最新信号', msg.id)}
                className="flex-[1] py-2 bg-white/5 hover:bg-white/10 rounded font-bold text-white transition-colors flex items-center justify-center gap-1"
              >
                <span>⬅️ 返回列表</span>
              </button>
            </div>
          </div>
        );

      case 'wallet-overview':
        return (
          <div className="space-y-3 -m-0.5 animate-fade-in w-full min-w-[240px]">
            <div className="flex items-center gap-2 text-[15px] font-bold text-white mb-2 pb-3 border-b border-white/20">
              <span>💼</span>
              <span>{msg.text}</span>
            </div>

            <div className="space-y-1 pb-3 border-b border-white/20">
              <div className="text-[14px] flex items-center gap-1.5 font-bold text-white">
                <span>💵</span>
                <span>余额</span>
              </div>
              <div className="pl-6 text-[14px] text-white">
                <span>交易钱包：</span>
                <span className="font-bold">{msg.data.balance}</span>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSend('查看持仓')}
                  className="py-3 bg-white/10 hover:bg-white/20 border border-white/5 rounded-xl font-bold text-white text-[14px] transition-colors flex items-center justify-center gap-2"
                >
                  📊 我的持仓
                </button>
                <button
                  onClick={() => handleSend('交易记录')}
                  className="py-3 bg-white/10 hover:bg-white/20 border border-white/5 rounded-xl font-bold text-white text-[14px] transition-colors flex items-center justify-center gap-2"
                >
                  📜 交易记录
                </button>
                <button
                  onClick={() => handleSend('充值')}
                  className="py-3 bg-white/10 hover:bg-white/20 border border-white/5 rounded-xl font-bold text-white text-[14px] transition-colors flex items-center justify-center gap-2"
                >
                  💰 充值
                </button>
                <button
                  onClick={() => handleSend('提现')}
                  className="py-3 bg-white/10 hover:bg-white/20 border border-white/5 rounded-xl font-bold text-white text-[14px] transition-colors flex items-center justify-center gap-2"
                >
                  💸 提现
                </button>
              </div>
              <button
                onClick={() => handleSend('钱包')}
                className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/5 rounded-xl font-bold text-white text-[14px] transition-colors flex items-center justify-center gap-2"
              >
                🔄 刷新
              </button>
            </div>
          </div>
        );

      case 'settings-menu':
        return (
          <div className="space-y-3 -m-0.5 animate-fade-in w-full min-w-[240px]">
            <div className="flex items-center gap-2 text-[15px] font-bold text-white mb-2 pb-3 border-b border-white/20">
              <span>⚙️</span>
              <span>{msg.text}</span>
            </div>

            <div className="space-y-1 pb-4 pt-1 border-b border-white/20">
              <div className="text-[14px] flex items-center justify-between text-white pt-1">
                <div className="flex items-center gap-1.5 font-bold">
                  <span>🏀</span>
                  <span>体育赛事信号</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-red-500">
                  <span>❌</span>
                  <span>已关闭</span>
                </div>
              </div>
            </div>

            <div className="text-[12px] text-white/80 pb-3 pt-2 leading-relaxed flex gap-1.5 items-start">
              <span>💡</span>
              <span>包含 NBA、NFL、足球等体育赛事相关的预测市场</span>
            </div>

            <div className="pt-1 space-y-2">
              <button
                onClick={() => handleSend('Switch to English')}
                className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/5 rounded-xl font-bold text-white text-[14px] transition-colors flex items-center justify-center gap-2"
              >
                🌐 Switch to English
              </button>
              <button
                onClick={() => handleSend('开启体育信号')}
                className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/5 rounded-xl font-bold text-white text-[14px] transition-colors flex items-center justify-center gap-2"
              >
                🏈 开启体育信号
              </button>
              <button
                onClick={() => handleSend('取消订阅')}
                className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/5 rounded-xl font-bold text-white text-[14px] transition-colors flex items-center justify-center gap-2"
              >
                🔕 取消订阅
              </button>
              <button
                onClick={() => handleSend('最新信号')}
                className="w-full py-3 bg-white/10 hover:bg-white/20 border border-white/5 rounded-xl font-bold text-white text-[14px] transition-colors flex items-center justify-center gap-2"
              >
                « 返回主控台
              </button>
            </div>
          </div>
        );

      case 'agent-status':
        return (
          <div className="space-y-3 -m-0.5 animate-fade-in w-full min-w-[260px]">
            <div className="flex items-center gap-2 text-[15px] font-bold text-white mb-2 pb-3 border-b border-white/20">
              <span>🤖</span>
              <span>{msg.text}</span>
            </div>

            <div className="space-y-2">
              <div className="text-[13px] font-bold text-white mb-1">📡 正在运行的任务 (2)：</div>
              <div className="bg-white/5 p-2.5 rounded-lg border border-white/10 space-y-2 text-[12px] text-white/90">
                <div className="flex items-start gap-1.5">
                  <span className="mt-0.5">🟢</span>
                  <div>
                    <span className="font-bold text-white">深度监控：</span>特朗普关税政策
                    <div className="text-white/60 text-[11px] mt-0.5">(概率 {'>'} 70% 触发分析)</div>
                  </div>
                </div>
                <div className="flex items-start gap-1.5">
                  <span className="mt-0.5">🟢</span>
                  <div>
                    <span className="font-bold text-white">自动跟单：</span>胜率 {'>'} 65% 地址
                    <div className="text-white/60 text-[11px] mt-0.5">(单笔限额 $50)</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="text-[13px] font-bold text-white mb-1">✨ 为你推荐的新指令：</div>
              <div className="space-y-2 text-[12px] text-white/90">
                <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 leading-relaxed">
                  <span className="font-bold text-tg-accent mr-1">1️⃣ 风险预警：</span>
                  当 聪明钱 在 2026 世界杯 市场大额反向建仓时提醒我。
                </div>
                <div className="bg-white/5 p-2.5 rounded-lg border border-white/5 leading-relaxed">
                  <span className="font-bold text-tg-accent mr-1">2️⃣ 定时简报：</span>
                  每日上午 9 点 推送加密货币预测市场深度简报。
                </div>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSend('管理运行中任务')}
                  className="py-2.5 bg-white/10 hover:bg-white/20 border border-white/5 rounded-xl font-bold text-white text-[13px] transition-colors flex items-center justify-center gap-1"
                >
                  🛠 管理运行中任务
                </button>
                <button
                  onClick={() => handleSend('创建自定义指令')}
                  className="py-2.5 bg-white/10 hover:bg-white/20 border border-white/5 rounded-xl font-bold text-white text-[13px] transition-colors flex items-center justify-center gap-1"
                >
                  ➕ 创建自定义指令
                </button>
              </div>
              <button
                onClick={() => handleSend('查看更多推荐')}
                className="w-full py-2.5 bg-tg-accent/10 border border-tg-accent/20 hover:bg-tg-accent/20 text-tg-accent rounded-xl font-bold text-[13px] transition-colors flex items-center justify-center gap-1"
              >
                🔍 查看更多推荐
              </button>
            </div>
          </div>
        );

      case 'agent-recommendations':
        return (
          <div className="space-y-3 -m-0.5 animate-fade-in w-full min-w-[260px]">
            <div className="flex items-center gap-2 text-[15px] font-bold text-white mb-2 pb-3 border-b border-white/20">
              <span>{msg.text}</span>
            </div>

            <div className="space-y-2 text-[13px] text-white/90">
              <div className="bg-white/5 p-3 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex gap-2 items-start">
                  <span className="mt-0.5">🔸</span>
                  <div className="leading-relaxed">
                    <span className="font-bold text-white">项目动态监控：</span>
                    监控所有关于 以太坊 ETF 的最新赔率变动。
                  </div>
                </div>
              </div>
              <div className="bg-white/5 p-3 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex gap-2 items-start">
                  <span className="mt-0.5">🔸</span>
                  <div className="leading-relaxed">
                    <span className="font-bold text-white">巨鲸追踪：</span>
                    发现交易量前 10 的地址进入新市场时立即报告。
                  </div>
                </div>
              </div>
              <div className="bg-white/5 p-3 rounded-lg border border-white/10 cursor-pointer hover:bg-white/10 transition-colors">
                <div className="flex gap-2 items-start">
                  <span className="mt-0.5">🔸</span>
                  <div className="leading-relaxed">
                    <span className="font-bold text-white">止损自动化：</span>
                    当持仓项目 AI 评分跌破 40 时，自动触发平仓建议。
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-2 space-y-2">
              <button
                onClick={() => handleSend('确认开启', msg.id)}
                className="w-full py-3 bg-tg-accent hover:bg-tg-accent/80 rounded-xl font-bold text-white text-[14px] transition-colors flex items-center justify-center gap-1"
              >
                ⚡️ 激活选中的推荐
              </button>
              <button
                onClick={() => handleSend('任务管理', msg.id)}
                className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/5 rounded-xl font-bold text-white text-[14px] transition-colors flex items-center justify-center gap-1"
              >
                🔙 返回
              </button>
            </div>
          </div>
        );

      case 'agent-custom-confirm':
        return (
          <div className="space-y-3 -m-0.5 animate-fade-in w-full min-w-[260px]">
            <div className="text-[13px] text-white mb-2 leading-relaxed">
              <span className="font-bold text-white opacity-80">{msg.text}</span><br />
              <div className="mt-1.5 p-2 bg-white/10 rounded border border-white/5 font-mono text-[11px] text-emerald-400">
                监控 "{msg.data.instruction}"
              </div>
              <div className="mt-2 text-white/80">是否现在开启？</div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={() => handleSend('确认开启', msg.id)}
                className="py-2.5 bg-tg-accent hover:bg-tg-accent/80 rounded-lg font-bold text-white text-[13px] transition-colors flex items-center justify-center gap-1"
              >
                ✅ 确认开启
              </button>
              <button
                onClick={() => handleSend('取消交易_0', msg.id)}
                className="py-2.5 bg-white/10 hover:bg-white/20 border border-white/5 rounded-lg font-bold text-white text-[13px] transition-colors flex items-center justify-center gap-1"
              >
                ❌ 取消
              </button>
            </div>
          </div>
        );

      case 'portfolio-overview':
        return (
          <div className="space-y-3 -m-0.5 animate-fade-in">
            <div className="flex items-center gap-2 text-[14px] font-bold text-white mb-2 pb-2 border-b border-white/10">
              <span>💼</span>
              <span>{msg.text}</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                <div className="text-[11px] text-white/50 mb-1">总账户余额</div>
                <div className="text-[18px] font-black text-white">{msg.data.totalBalance}</div>
              </div>
              <div className="bg-white/5 p-3 rounded-lg border border-white/10">
                <div className="text-[11px] text-white/50 mb-1">24h 盈亏</div>
                <div className="text-[18px] font-black text-emerald-400">🟢 {msg.data.pnl24h}</div>
              </div>
            </div>

            <div className="space-y-2 pt-1">
              <div className="text-[12px] font-bold text-white/60 uppercase tracking-wider mb-2">当前持仓详情</div>
              {msg.data.positions.map((pos: any, idx: number) => (
                <div key={idx} className="bg-tg-header border border-tg-border p-3 rounded-lg space-y-2.5">
                  <div className="flex justify-between items-start">
                    <div className="text-[13px] font-bold text-white flex-1 pr-2 leading-tight">{pos.title}</div>
                    <div className={`text-[13px] font-bold shrink-0 ${pos.isPositive ? 'text-emerald-400' : 'text-tg-accent'}`}>
                      {pos.isPositive ? '🟢 ' : '🔴 '}{pos.pnl}
                    </div>
                  </div>
                  <div className="flex gap-2 pt-1 text-[11px]">
                    <button
                      onClick={() => handleSend(`设置止损_${pos.id}`, msg.id)}
                      className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded font-bold text-white transition-colors flex justify-center items-center gap-1"
                    >
                      📉 止损
                    </button>
                    <button
                      onClick={() => handleSend(`平仓_${pos.id}`, msg.id)}
                      className="flex-1 py-2 bg-tg-accent/10 border border-tg-accent/20 hover:bg-tg-accent/20 text-tg-accent rounded font-bold transition-colors flex justify-center items-center gap-1"
                    >
                      💸 平仓
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2 flex gap-2">
              <button
                onClick={() => handleSend('最新信号', msg.id)}
                className="flex-1 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded font-bold text-[12px] text-white transition-colors flex items-center justify-center gap-1"
              >
                <span>⬅️ 返回工作台</span>
              </button>
              <button
                onClick={() => handleSend('刷新持仓', msg.id)}
                className="flex-[2] py-2 bg-tg-accent/10 hover:bg-tg-accent/20 border border-tg-accent/20 rounded font-bold text-[12px] text-tg-accent transition-colors flex items-center justify-center gap-1"
              >
                <span>🔄 刷新实时数据</span>
              </button>
            </div>
          </div>
        );

      case 'latest-signals':
        return (
          <div className="space-y-3 -m-0.5 animate-fade-in">
            <div className="text-[13px] font-bold text-white mb-2">
              {msg.text}
            </div>

            <div className="space-y-2">
              <div className="text-[12px] font-bold text-white/50 bg-white/5 px-2 py-1 rounded w-max">[热门预测]</div>
              <div className="space-y-2 pl-1 text-[12px] text-white">
                {msg.data.hotPredictions?.map((pred: any, i: number) => (
                  <div key={i} className="flex flex-col gap-0.5">
                    <div className="font-bold">{pred.title}</div>
                    <div className="text-white/60">{pred.extra}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="h-[1px] bg-white/10 w-full my-2" />

            <div className="space-y-2">
              <div className="text-[12px] font-bold text-white/50 bg-white/5 px-2 py-1 rounded w-max">[聪明钱异动]</div>
              <div className="space-y-2 pl-1 text-[12px] text-white">
                {msg.data.smartMoney?.map((sm: any, i: number) => (
                  <div key={i} className="flex flex-col gap-0.5">
                    <div className="font-bold">{sm.id}. {sm.account}</div>
                    <div className="text-white/60">{sm.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 space-y-2 text-[12px]">
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleSend('decode_1')}
                  className="py-2.5 bg-white/10 hover:bg-white/20 border border-white/5 rounded-lg font-bold text-white transition-colors flex items-center justify-center gap-1"
                >
                  🔍 查看 1 号
                </button>
                <button
                  onClick={() => handleSend('decode_2')}
                  className="py-2.5 bg-white/10 hover:bg-white/20 border border-white/5 rounded-lg font-bold text-white transition-colors flex items-center justify-center gap-1"
                >
                  🔍 查看 2 号
                </button>
                <button
                  onClick={() => handleSend('decode_3')}
                  className="py-2.5 bg-white/10 hover:bg-white/20 border border-white/5 rounded-lg font-bold text-white transition-colors flex items-center justify-center gap-1"
                >
                  🔍 查看 3 号
                </button>
                <button
                  onClick={() => handleSend('decode_4')}
                  className="py-2.5 bg-white/10 hover:bg-white/20 border border-white/5 rounded-lg font-bold text-white transition-colors flex items-center justify-center gap-1"
                >
                  🔍 查看 4 号
                </button>
              </div>
              <button
                onClick={() => handleSend('最新信号')}
                className="w-full py-2.5 bg-tg-accent/10 border border-tg-accent/20 hover:bg-tg-accent/20 text-tg-accent rounded-lg font-bold transition-colors flex items-center justify-center gap-1"
              >
                🔄 刷新信号
              </button>
            </div>
          </div>
        );

      case 'signal-push':
        return (
          <div className="space-y-3">
            <div className="space-y-2 text-white">
              <div className="flex items-center gap-2 text-[13px] font-bold">
                <span>📈</span>
                <span>{msg.text}</span>
              </div>

              <div className="space-y-1.5 text-[12px]">
                <div className="flex items-center gap-2">
                  <span>🎯</span>
                  <span>买入 {msg.data.direction || msg.data.recommendation} @ {msg.data.price}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>💰</span>
                  <span>若猜对：{msg.data.potential || '$100 → $102 (+2%)'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span>🏆</span>
                  <span>信心 {msg.data.confidence || '81/100'}</span>
                </div>
              </div>

              <div className="h-[1px] bg-white/10 w-full my-2" />

              <div className="flex items-center gap-2 text-[11px] text-white/60">
                <span>⚠️</span>
                <span>预测市场有风险，非投资建议</span>
              </div>
            </div>

            <div className="flex gap-1.5 pt-0.5">
              <button
                onClick={() => handleSend('查看详情')}
                className="tg-action-btn"
              >
                <BarChart3 size={14} className="text-blue-400" />
                <span>详情</span>
              </button>
              <button className="tg-action-btn">
                <Plus size={14} className="text-white/60" />
                <span>市场</span>
              </button>
              <button
                onClick={() => handleSend('买入')}
                className="tg-action-btn"
              >
                <span className="text-xs">💰</span>
                <span>跟单</span>
              </button>
            </div>
          </div>
        );

      case 'feedback-recorded':
        return (
          <div className="space-y-1.5 -m-0.5 animate-fade-in">
            <div className="flex items-center gap-1.5 text-[14px] font-bold text-emerald-400">
              <span className="text-sm">✅</span>
              <span>{msg.text}</span>
            </div>
            <div className="text-[12px] text-white/80 leading-relaxed bg-white/5 p-2 rounded-lg border border-white/5">
              💡 {msg.data.insight}
            </div>
          </div>
        );

      default:
        return <p className="text-[13px] leading-relaxed whitespace-pre-wrap">{msg.text}</p>;
    }
  };

  return (
    <>
      <div className="flex-1 flex flex-col overflow-hidden bg-transparent">
        {/* Chat Area */}
        <div className="tg-chat-area">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.type === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div className={`tg-bubble ${msg.type === 'user' ? 'tg-bubble-user' : 'tg-bubble-ai'}`}>
                {renderMessageContent(msg)}
              </div>
              <div className={`text-[9px] text-white/40 mt-1 mb-2 ${msg.type === 'user' ? 'mr-1' : 'ml-1'}`}>
                {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="tg-input-area">
          <div className="flex items-center gap-2">
            <button className="text-white/60 hover:text-white transition-colors p-1">
              <Paperclip size={20} />
            </button>

            <div className="flex-1 bg-white/10 rounded-xl px-3 py-1.5 flex items-center gap-2 border border-white/5 focus-within:border-white/20 transition-all">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder="输入消息..."
                className="flex-1 bg-transparent border-none focus:outline-none text-[13px] text-white placeholder:text-white/30"
              />
              <button className="text-white/40 hover:text-white transition-colors">
                <LayoutGrid size={18} />
              </button>
            </div>

            <button className="text-white/60 hover:text-white transition-colors p-1">
              <Brain size={20} />
            </button>
          </div>
        </div>
      </div>

      <div className="tg-keyboard">
        <button
          onClick={() => handleSend('最新信号')}
          className="tg-keyboard-btn"
        >
          <span className="text-xl">📋</span>
          <span>最新信号</span>
        </button>
        <button
          onClick={() => handleSend('钱包')}
          className="tg-keyboard-btn"
        >
          <span className="text-xl">💰</span>
          <span>钱包</span>
        </button>
        <button
          onClick={() => handleSend('设置')}
          className="tg-keyboard-btn"
        >
          <span className="text-xl">⚙️</span>
          <span>设置</span>
        </button>
        <button
          onClick={() => handleSend('alice claw')}
          className="tg-keyboard-btn"
        >
          <span className="text-xl">📊</span>
          <span>Alice Claw</span>
        </button>
      </div>
    </>
  );
};

export default ChatView;
