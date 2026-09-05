import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  Gamepad2,
  Image as ImageIcon,
  MessageSquare,
  BookOpen,
  Leaf,
  Presentation,
  Shield,
  Sparkles,
  Award,
  Heart,
  Globe,
  CheckCircle2,
  TrendingUp,
  Volume2,
  RotateCcw,
  AlertTriangle
} from 'lucide-react';
import { TabType, CharacterState } from './types';
import { CHARACTER_STAGES } from './data/ecoData';
import { WasteGame } from './components/WasteGame';
import { PosterStudio } from './components/PosterStudio';
import { EcoChat } from './components/EcoChat';
import { ClimateEducation } from './components/ClimateEducation';
import { EcoCharacter } from './components/EcoCharacter';
import { PresentationGuide } from './components/PresentationGuide';

const INITIAL_CHARACTER_STATE: CharacterState = {
  name: '에코링',
  level: 1,
  exp: 0,
  maxExp: 100,
  vitality: 100,
  stageTitle: CHARACTER_STAGES[0].title,
  stageDescription: '지구의 푸른 미래를 품은 작은 생명의 씨앗입니다.',
  mood: 'happy',
  activeQuote: CHARACTER_STAGES[0].dialogues[0],
  totalEcoPoints: 0,
  co2SavedKg: 0.0,
  badges: ['첫 걸음 환경 지킴이', '분리배출 새싹'],
  stats: {
    gameScore: 0,
    quizzesSolved: 0,
    postersMade: 0,
    chatsSent: 0
  }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('game');
  const [showLevelUpModal, setShowLevelUpModal] = useState<boolean>(false);
  const [showResetConfirmModal, setShowResetConfirmModal] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [newlyUnlockedStage, setNewlyUnlockedStage] = useState<any>(null);

  // Global Eco Character State
  const [character, setCharacter] = useState<CharacterState>(() => {
    const saved = localStorage.getItem('ecosphere_character_data');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // fallback
      }
    }
    return {
      name: '에코링',
      level: 1,
      exp: 40,
      maxExp: 100,
      vitality: 92,
      stageTitle: CHARACTER_STAGES[0].title,
      stageDescription: '지구의 푸른 미래를 품은 작은 생명의 씨앗입니다.',
      mood: 'happy',
      activeQuote: CHARACTER_STAGES[0].dialogues[0],
      totalEcoPoints: 240,
      co2SavedKg: 1.8,
      badges: ['첫 걸음 환경 지킴이', '분리배출 새싹'],
      stats: {
        gameScore: 150,
        quizzesSolved: 2,
        postersMade: 1,
        chatsSent: 1
      }
    };
  });

  // Save character state to localStorage
  useEffect(() => {
    localStorage.setItem('ecosphere_character_data', JSON.stringify(character));
  }, [character]);

  // Handle EXP Gain & Level-Up Progression
  const handleEarnExp = (expGain: number, pointsGain: number, co2KgGain: number = 0.2) => {
    setCharacter(prev => {
      let newExp = prev.exp + expGain;
      let newLevel = prev.level;
      let newMaxExp = prev.maxExp;
      let leveledUp = false;
      let stageInfo = CHARACTER_STAGES.find(s => s.level === newLevel) || CHARACTER_STAGES[0];

      while (newExp >= newMaxExp && newLevel < 4) {
        newExp -= newMaxExp;
        newLevel += 1;
        leveledUp = true;
        stageInfo = CHARACTER_STAGES.find(s => s.level === newLevel) || CHARACTER_STAGES[0];
        newMaxExp = stageInfo.maxExp;
      }

      if (leveledUp) {
        setNewlyUnlockedStage(stageInfo);
        setShowLevelUpModal(true);
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 }
        });
      }

      const updatedBadges = [...prev.badges];
      if (newLevel >= 2 && !updatedBadges.includes('초록 잎새 인증')) {
        updatedBadges.push('초록 잎새 인증');
      }
      if (newLevel >= 3 && !updatedBadges.includes('묘목 수호 훈장')) {
        updatedBadges.push('묘목 수호 훈장');
      }
      if (newLevel >= 4 && !updatedBadges.includes('지구 수호대장 마스터')) {
        updatedBadges.push('지구 수호대장 마스터');
      }

      return {
        ...prev,
        level: newLevel,
        exp: newExp,
        maxExp: newMaxExp,
        stageTitle: stageInfo.title,
        stageDescription:
          newLevel === 1
            ? '지구의 푸른 미래를 품은 작은 생명의 씨앗입니다.'
            : newLevel === 2
            ? '초록 잎사귀를 펼쳐 활발히 탄소를 흡수하는 중입니다.'
            : newLevel === 3
            ? '숲의 기둥이 되어 시원한 맑은 그늘을 선사합니다.'
            : '온 지구를 푸르게 감싸는 행성급 수호목으로 각성했습니다.',
        totalEcoPoints: prev.totalEcoPoints + pointsGain,
        co2SavedKg: prev.co2SavedKg + co2KgGain,
        vitality: Math.min(100, prev.vitality + 2),
        badges: updatedBadges,
        activeQuote: stageInfo.dialogues[Math.floor(Math.random() * stageInfo.dialogues.length)]
      };
    });
  };

  // Instant Level Up Trigger for Live Demonstration
  const handleInstantLevelUp = () => {
    handleEarnExp(150, 200, 1.5);
  };

  // Reset Level & Environmental Progress to Initial Seed State
  const handleResetProgress = () => {
    localStorage.removeItem('ecosphere_character_data');
    setCharacter(INITIAL_CHARACTER_STATE);
    setShowResetConfirmModal(false);
    setToastMessage('에코 캐릭터 레벨과 친환경 활동 데이터가 성공적으로 초기화되었습니다.');
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Character Touch Interaction
  const handleCharacterInteract = () => {
    setCharacter(prev => {
      const stageInfo = CHARACTER_STAGES.find(s => s.level === prev.level) || CHARACTER_STAGES[0];
      const randomQuote = stageInfo.dialogues[Math.floor(Math.random() * stageInfo.dialogues.length)];
      return {
        ...prev,
        activeQuote: randomQuote,
        vitality: Math.min(100, prev.vitality + 1)
      };
    });
  };

  const navTabs = [
    { id: 'game' as TabType, label: '분리배출 게임', icon: Gamepad2 },
    { id: 'poster' as TabType, label: 'AI 포스터 & 전시관', icon: ImageIcon },
    { id: 'chat' as TabType, label: '기후 AI 대화', icon: MessageSquare },
    { id: 'quiz' as TabType, label: '온난화 퀴즈 & 영상', icon: BookOpen },
    { id: 'character' as TabType, label: '에코 캐릭터 룸', icon: Leaf },
    { id: 'presentation' as TabType, label: '발표자 모드', icon: Presentation }
  ];

  return (
    <div className="min-h-screen bg-[#F4F7F5] text-[#2C3E50] flex flex-col selection:bg-[#2D6A4F] selection:text-white">
      {/* Top Ambient Subtle Tone */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-32 bg-[#2D6A4F]/5 blur-[80px] pointer-events-none z-0" />

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-[#E2E8F0] shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          {/* Logo & Platform Name */}
          <div
            id="brand-logo"
            onClick={() => setActiveTab('game')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-2xl bg-[#2D6A4F] flex items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
              <Globe className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base tracking-tight text-[#1B4332] font-['Plus_Jakarta_Sans',sans-serif]">
                  EcoSphere
                </span>
                <span className="text-[10px] font-bold bg-[#D8F3DC] text-[#1B4332] border border-[#B7E4C7] px-2 py-0.5 rounded-lg">
                  환경인식 복합앱
                </span>
              </div>
              <p className="text-[11px] text-[#52796F] hidden sm:block font-medium">
                게임 · AI 포스터 전시 · 기후 챗봇 · 온난화 교육
              </p>
            </div>
          </div>

          {/* Center / Right Companion Status Badge & Reset Button */}
          <div className="flex items-center gap-2">
            <EcoCharacter
              character={character}
              onInteract={handleCharacterInteract}
              compact
            />
            <button
              id="btn-header-reset-level"
              onClick={() => setShowResetConfirmModal(true)}
              title="레벨 및 친환경 활동 데이터 초기화"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-rose-50 text-[#52796F] hover:text-rose-700 border border-[#E2E8F0] hover:border-rose-300 rounded-full text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-rose-500" />
              <span className="hidden sm:inline">초기화</span>
            </button>
          </div>
        </div>

        {/* Modular Bento Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-2.5 overflow-x-auto no-scrollbar">
          <nav className="flex space-x-1.5 p-1 bg-[#E8EFEA] rounded-2xl border border-[#D8E2DC]">
            {navTabs.map(tab => {
              const IconComponent = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`nav-tab-${tab.id}`}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#2D6A4F] text-white shadow-sm'
                      : 'text-[#52796F] hover:text-[#1B4332] hover:bg-white/70'
                  }`}
                >
                  <IconComponent className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#52796F]'}`} />
                  <span>{tab.label}</span>
                  {tab.id === 'poster' && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#D8F3DC] text-[#1B4332]'
                    }`}>
                      전시
                    </span>
                  )}
                  {tab.id === 'presentation' && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-800'
                    }`}>
                      시연
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
          >
            {activeTab === 'game' && (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                <div className="xl:col-span-8">
                  <WasteGame
                    onEarnExp={(exp, pts, co2) => handleEarnExp(exp, pts, co2)}
                  />
                </div>
                <div className="xl:col-span-4">
                  <EcoCharacter
                    character={character}
                    onInteract={handleCharacterInteract}
                    onReset={() => setShowResetConfirmModal(true)}
                  />
                </div>
              </div>
            )}

            {activeTab === 'poster' && (
              <PosterStudio
                onEarnExp={(exp, pts) => handleEarnExp(exp, pts, 0.4)}
              />
            )}

            {activeTab === 'chat' && (
              <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                <div className="xl:col-span-8">
                  <EcoChat
                    onEarnExp={(exp, pts) => handleEarnExp(exp, pts, 0.1)}
                  />
                </div>
                <div className="xl:col-span-4">
                  <EcoCharacter
                    character={character}
                    onInteract={handleCharacterInteract}
                    onReset={() => setShowResetConfirmModal(true)}
                  />
                </div>
              </div>
            )}

            {activeTab === 'quiz' && (
              <ClimateEducation
                onEarnExp={(exp, pts) => handleEarnExp(exp, pts, 0.3)}
              />
            )}

            {activeTab === 'character' && (
              <div className="max-w-3xl mx-auto space-y-6">
                <EcoCharacter
                  character={character}
                  onInteract={handleCharacterInteract}
                  onReset={() => setShowResetConfirmModal(true)}
                />

                <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm space-y-4">
                  <h4 className="text-sm font-bold text-[#1B4332] flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#2D6A4F]" />
                    나의 친환경 실천 누적 통계
                  </h4>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0] text-center">
                      <div className="text-[11px] text-[#52796F] font-medium">누적 에코 포인트</div>
                      <div className="text-lg font-black text-[#2D6A4F] mt-0.5">
                        {character.totalEcoPoints} P
                      </div>
                    </div>

                    <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0] text-center">
                      <div className="text-[11px] text-[#52796F] font-medium">탄소 배출 저감량</div>
                      <div className="text-lg font-black text-[#1B4332] mt-0.5">
                        {character.co2SavedKg.toFixed(1)} kg
                      </div>
                    </div>

                    <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0] text-center">
                      <div className="text-[11px] text-[#52796F] font-medium">현재 캐릭터 단계</div>
                      <div className="text-lg font-black text-amber-700 mt-0.5">
                        Lv.{character.level}
                      </div>
                    </div>

                    <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0] text-center">
                      <div className="text-[11px] text-[#52796F] font-medium">보유 훈장·배지</div>
                      <div className="text-lg font-black text-blue-700 mt-0.5">
                        {character.badges.length} 개
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-[#D8F3DC]/40 border border-[#B7E4C7] rounded-2xl text-xs text-[#2D6A4F] leading-relaxed font-medium">
                    에코스피어에서 분리배출 게임을 하거나, AI 포스터를 제작해 전시하고, 온난화 퀴즈를 풀면 경험치와 탄소 감축량이 쌓여 캐릭터가 계속해서 다음 단계로 성장합니다.
                  </div>
                </div>

                {/* Level & Data Reset Management Card */}
                <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold px-2 py-0.5 bg-rose-100 text-rose-800 rounded-md border border-rose-200">
                          데이터 관리
                        </span>
                        <h4 className="text-sm font-bold text-[#1B4332] flex items-center gap-1.5">
                          <RotateCcw className="w-4 h-4 text-rose-600" />
                          캐릭터 레벨 및 누적 활동 초기화
                        </h4>
                      </div>
                      <p className="text-xs text-[#52796F] mt-1.5 leading-relaxed max-w-xl">
                        처음부터 새롭게 에코링을 키우고 싶거나 수업·발표 시연을 위해 레벨과 데이터를 초기 상태(Lv.1 새싹)로 되돌릴 수 있습니다.
                      </p>
                    </div>
                    <button
                      id="btn-character-room-reset"
                      onClick={() => setShowResetConfirmModal(true)}
                      className="flex items-center justify-center gap-2 px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 hover:border-rose-300 font-bold text-xs rounded-xl transition-all shadow-xs cursor-pointer whitespace-nowrap"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      레벨 및 데이터 초기화
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'presentation' && (
              <PresentationGuide
                onNavigateTab={tab => setActiveTab(tab)}
                onInstantLevelUp={handleInstantLevelUp}
                onResetLevel={() => setShowResetConfirmModal(true)}
                currentLevel={character.level}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#E2E8F0] bg-white py-6 text-xs text-[#718096] text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#2D6A4F]" />
            <span className="font-bold text-[#2C3E50]">EcoSphere 환경 인식 개선 복합 웹 애플리케이션</span>
          </div>
          <div className="flex items-center gap-4 text-[#52796F] font-medium">
            <span>IPCC 1.5°C 보고서 기반</span>
            <span>대한민국 환경부 분리배출 표준</span>
            <button
              onClick={() => setActiveTab('presentation')}
              className="text-[#2D6A4F] hover:text-[#1B4332] font-bold underline underline-offset-4"
            >
              발표 시연 모드 열기
            </button>
          </div>
        </div>
      </footer>

      {/* Level Up Celebratory Modal */}
      {showLevelUpModal && newlyUnlockedStage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white border-2 border-[#2D6A4F] rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden"
          >
            <div className="w-20 h-20 mx-auto rounded-3xl bg-[#D8F3DC] border border-[#B7E4C7] text-[#2D6A4F] flex items-center justify-center mb-4">
              <Award className="w-10 h-10 animate-bounce" />
            </div>

            <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#D8F3DC] text-[#1B4332] border border-[#B7E4C7]">
              레벨 업 축하!
            </span>

            <h3 className="text-2xl font-black text-[#1B4332] mt-2">
              에코링이 <span className="text-[#2D6A4F]">{newlyUnlockedStage.title}</span>(으)로 진화했습니다!
            </h3>

            <p className="text-xs text-[#52796F] mt-2 leading-relaxed">
              당신의 환경 실천 노력이 지구의 생명력을 되살리고 있습니다. 새로운 배지 획득 및 지구 보호력이 대폭 상승했습니다.
            </p>

            <div className="my-5 p-3.5 bg-[#F4F7F5] border border-[#E2E8F0] rounded-2xl text-xs text-[#2D6A4F] font-semibold">
              "{newlyUnlockedStage.dialogues[0]}"
            </div>

            <button
              id="btn-close-levelup-modal"
              onClick={() => setShowLevelUpModal(false)}
              className="w-full py-3 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-black text-sm rounded-xl transition-all shadow-md"
            >
              계속해서 지구 지키기
            </button>
          </motion.div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white border-2 border-rose-200 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
          >
            <div className="w-16 h-16 mx-auto rounded-3xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center mb-4">
              <RotateCcw className="w-8 h-8" />
            </div>

            <div className="text-center">
              <span className="text-[11px] font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-800 border border-rose-200">
                데이터 초기화 확인
              </span>
              <h3 className="text-xl font-black text-[#1B4332] mt-2.5">
                레벨과 활동 기록을 초기화할까요?
              </h3>
              <p className="text-xs text-[#52796F] mt-2 leading-relaxed">
                초기화 시 에코링 캐릭터가 <span className="font-bold text-[#1B4332]">Lv.1 새싹 단계</span>로 돌아가며, 누적된 포인트와 탄소 감축량이 재설정됩니다.
              </p>
            </div>

            {/* Before vs After Summary */}
            <div className="my-5 p-4 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#52796F]">
                <span>현재 상태</span>
                <span className="font-bold text-[#1B4332]">Lv.{character.level} ({character.stageTitle})</span>
              </div>
              <div className="flex items-center justify-between text-[#52796F]">
                <span>누적 에코 포인트</span>
                <span className="font-bold text-[#2D6A4F]">{character.totalEcoPoints.toLocaleString()} P</span>
              </div>
              <div className="flex items-center justify-between text-[#52796F]">
                <span>탄소 감축 기여량</span>
                <span className="font-bold text-[#1B4332]">{character.co2SavedKg.toFixed(1)} kg</span>
              </div>
              <div className="pt-2 border-t border-[#E2E8F0] flex items-center justify-between font-bold text-rose-600">
                <span>초기화 후</span>
                <span>Lv.1 새싹 (0 P / 0.0 kg)</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="btn-cancel-reset"
                onClick={() => setShowResetConfirmModal(false)}
                className="flex-1 py-3 bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#475569] font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                취소
              </button>
              <button
                id="btn-confirm-reset"
                onClick={handleResetProgress}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                초기화 실행
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Floating Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#1B4332] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2.5 text-xs font-bold border border-[#2D6A4F]"
          >
            <CheckCircle2 className="w-4 h-4 text-[#52B788]" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
