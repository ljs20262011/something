import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Send,
  Sparkles,
  RotateCcw,
  Bot,
  User,
  HelpCircle,
  Leaf,
  Globe,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { ChatMessage } from '../types';
import { generateClientFallbackChat } from '../services/ecoClientService';

interface EcoChatProps {
  onEarnExp: (exp: number, points: number) => void;
}

export const EcoChat: React.FC<EcoChatProps> = ({ onEarnExp }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      role: 'assistant',
      content: `안녕하세요! 환경·기후변화 전문 AI 도우미 '에코스피어 AI'입니다.

지구 온난화와 기후 위기, 일상 속 올바른 분리배출, 탄소발자국 저감 실천법 등 환경에 관한 모든 궁금증을 편하게 질문해주세요. 과학적 근거와 실천 가이드를 안내해 드립니다.`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      source: 'gemini'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickQuestions = [
    { label: '지구 1.5°C 상승의 위험성', query: '지구 평균 기온이 1.5도 상승하면 구체적으로 어떤 재난이 발생하나요?' },
    { label: '하루 탄소발자국 줄이기', query: '학생이나 직장인이 일상에서 실천할 수 있는 가장 효과적인 탄소 저감 방법 3가지는?' },
    { label: '헷갈리는 분리수거 품목', query: '피자 상자, 컵라면 용기, 젤 아이스팩의 정확한 분리배출 기준을 설명해주세요.' },
    { label: '미세플라스틱의 생태 위협', query: '바다로 유입된 미세플라스틱이 인간의 건강과 해양 생태계에 미치는 영향은?' }
  ];

  const handleSend = async (userText?: string) => {
    const textToSend = userText || input.trim();
    if (!textToSend || isLoading) return;

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMessage]);
    if (!userText) setInput('');
    setIsLoading(true);

    try {
      const historyPayload = messages.slice(-6).map(m => ({
        role: m.role,
        content: m.content
      }));

      let replyText = '';
      let sourceTag = 'gemini';

      try {
        const res = await fetch('/api/gemini/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: textToSend,
            history: historyPayload
          })
        });

        if (res.ok) {
          const data = await res.json();
          replyText = data.reply || '';
          sourceTag = data.source || 'gemini';
        } else {
          replyText = generateClientFallbackChat(textToSend);
          sourceTag = 'eco-knowledge';
        }
      } catch {
        replyText = generateClientFallbackChat(textToSend);
        sourceTag = 'eco-knowledge';
      }

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: replyText || generateClientFallbackChat(textToSend),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: sourceTag
      };

      setMessages(prev => [...prev, botMessage]);
      onEarnExp(15, 30);
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackReply = generateClientFallbackChat(textToSend);
      const errorMessage: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        role: 'assistant',
        content: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        source: 'eco-knowledge'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: 'assistant',
        content: '대화가 초기화되었습니다. 환경과 기후에 관한 새로운 질문을 언제든 입력해주세요.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  return (
    <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm flex flex-col h-[750px] relative overflow-hidden">
      {/* Chat Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#E2E8F0] shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#D8F3DC] flex items-center justify-center text-[#1B4332] font-black shadow-xs">
            <Bot className="w-5 h-5 text-[#2D6A4F]" />
          </div>
          <div>
            <h3 className="font-black text-[#1B4332] text-sm flex items-center gap-2">
              에코스피어 기후·환경 AI 전문 챗봇
              <span className="text-[10px] bg-[#D8F3DC] text-[#1B4332] px-2 py-0.5 rounded-full border border-[#B7E4C7] font-bold">
                Gemini 3.8 Flash 연동
              </span>
            </h3>
            <p className="text-xs text-[#52796F] font-medium">
              IPCC 기후 데이터 및 환경부 분리배출 규정을 기반으로 답변합니다.
            </p>
          </div>
        </div>

        <button
          id="btn-clear-chat"
          onClick={handleResetChat}
          className="flex items-center gap-1.5 text-xs text-[#52796F] hover:text-[#1B4332] bg-[#F8FAFC] hover:bg-[#EBF2EE] px-3 py-1.5 rounded-xl border border-[#E2E8F0] transition-all cursor-pointer font-medium"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          대화 초기화
        </button>
      </div>

      {/* Suggested Quick Question Chips */}
      <div className="py-3 flex flex-wrap gap-2 shrink-0 border-b border-[#E2E8F0]">
        <span className="text-xs text-[#52796F] font-bold flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-[#2D6A4F]" />
          추천 질문:
        </span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSend(q.query)}
            disabled={isLoading}
            className="text-xs bg-[#F8FAFC] hover:bg-[#EBF2EE] border border-[#E2E8F0] text-[#2C3E50] hover:text-[#1B4332] px-3 py-1.5 rounded-xl font-medium transition-all cursor-pointer"
          >
            {q.label}
          </button>
        ))}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
        {messages.map(msg => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-xl bg-[#D8F3DC] border border-[#B7E4C7] flex items-center justify-center text-[#2D6A4F] shrink-0 mt-1 shadow-xs">
                <Leaf className="w-4 h-4" />
              </div>
            )}

            <div
              className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-[#2D6A4F] text-white font-medium rounded-tr-none shadow-sm'
                  : 'bg-[#F8FAFC] border border-[#E2E8F0] text-[#2C3E50] rounded-tl-none shadow-xs'
              }`}
            >
              <div className="whitespace-pre-wrap font-normal leading-relaxed">{msg.content}</div>
              <div
                className={`text-[10px] mt-2 flex items-center justify-end gap-1 ${
                  msg.role === 'user' ? 'text-[#D8F3DC]' : 'text-[#718096]'
                }`}
              >
                <span>{msg.timestamp}</span>
                {msg.role === 'assistant' && (
                  <span className="font-mono text-[9px]">
                    ({msg.source === 'offline-knowledge' ? '공인 지식 데이터베이스' : 'Gemini AI'})
                  </span>
                )}
              </div>
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-xl bg-[#2D6A4F] text-white flex items-center justify-center shrink-0 mt-1 shadow-xs">
                <User className="w-4 h-4" />
              </div>
            )}
          </motion.div>
        ))}

        {isLoading && (
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#D8F3DC] border border-[#B7E4C7] flex items-center justify-center text-[#2D6A4F] shrink-0">
              <Leaf className="w-4 h-4 animate-pulse" />
            </div>
            <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl rounded-tl-none p-4 text-xs text-[#52796F] flex items-center gap-2 font-medium">
              <span className="inline-block w-2 h-2 rounded-full bg-[#2D6A4F] animate-ping" />
              환경 데이터를 분석하여 답변을 구성하고 있습니다...
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer Box */}
      <form
        onSubmit={e => {
          e.preventDefault();
          handleSend();
        }}
        className="pt-3 border-t border-[#E2E8F0] flex items-center gap-2 shrink-0"
      >
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="환경, 기후위기, 분리배출에 대해 궁금한 점을 질문해보세요..."
          className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-3 text-xs text-[#2C3E50] placeholder-[#718096] focus:outline-none focus:border-[#2D6A4F] transition-all"
        />
        <button
          id="btn-chat-send"
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-5 py-3 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-black text-xs rounded-xl transition-all disabled:opacity-40 flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Send className="w-3.5 h-3.5" />
          전송
        </button>
      </form>
    </div>
  );
};
