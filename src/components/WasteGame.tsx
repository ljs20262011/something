import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  RotateCcw,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Zap,
  Timer,
  Award,
  ChevronRight,
  ShieldCheck,
  AlertCircle,
  BookOpen,
  Play,
  Sparkles,
  Home,
  Recycle,
  Layers,
  Flame
} from 'lucide-react';
import { TrashItem, BinCategoryId } from '../types';
import { BIN_CATEGORIES, TRASH_ITEMS } from '../data/ecoData';

interface WasteGameProps {
  onEarnExp: (exp: number, points: number, co2Kg: number) => void;
}

interface FloatingScore {
  id: number;
  text: string;
  isPositive: boolean;
  combo?: number;
}

export const WasteGame: React.FC<WasteGameProps> = ({ onEarnExp }) => {
  const [gamePhase, setGamePhase] = useState<'intro' | 'playing' | 'ended'>('intro');
  const [deck, setDeck] = useState<TrashItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [highestStreak, setHighestStreak] = useState<number>(0);
  const [correctCount, setCorrectCount] = useState<number>(0);
  const [wrongCount, setWrongCount] = useState<number>(0);
  const [lastFeedback, setLastFeedback] = useState<{
    correct: boolean;
    item: TrashItem;
    selectedCategory: BinCategoryId;
  } | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [showRuleModal, setShowRuleModal] = useState<boolean>(false);
  const [floatingScores, setFloatingScores] = useState<FloatingScore[]>([]);

  // Safe Web Audio API synthesizer for instant audio cues without network dependencies
  const playSound = (isSuccess: boolean) => {
    try {
      if (typeof window === 'undefined') return;
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => {});
      }
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (isSuccess) {
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.exponentialRampToValueAtTime(783.99, ctx.currentTime + 0.15); // G5
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
      } else {
        osc.frequency.setValueAtTime(220, ctx.currentTime); // A3
        osc.frequency.setValueAtTime(196, ctx.currentTime + 0.1); // G3
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.25);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.25);
      }
    } catch {
      // Audio playback restrictions safely handled
    }
  };

  // Start new game session
  const handleStartGame = () => {
    const shuffled = [...TRASH_ITEMS].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setHighestStreak(0);
    setCorrectCount(0);
    setWrongCount(0);
    setLastFeedback(null);
    setFloatingScores([]);
    setTimeLeft(60);
    setIsTimerActive(true);
    setGamePhase('playing');
  };

  // Return to start intro screen
  const handleGoToIntro = () => {
    setIsTimerActive(false);
    setGamePhase('intro');
  };

  // Timer countdown
  useEffect(() => {
    if (!isTimerActive || gamePhase !== 'playing') return;

    if (timeLeft <= 0) {
      endGame();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isTimerActive, gamePhase]);

  const endGame = () => {
    setGamePhase('ended');
    setIsTimerActive(false);

    // Calculate final exp and points
    const earnedExp = Math.round(score / 5) + correctCount * 15;
    const earnedPoints = score + 50;
    const co2Kg = Number((correctCount * 0.25).toFixed(2));

    onEarnExp(earnedExp, earnedPoints, co2Kg);

    if (score >= 300) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch {
        // Safe confetti fallback
      }
    }
  };

  const handleClassify = (categoryId: BinCategoryId) => {
    if (gamePhase !== 'playing' || !deck[currentIndex]) return;

    const currentItem = deck[currentIndex];
    const isCorrect = currentItem.category === categoryId;

    playSound(isCorrect);

    const scoreId = Date.now();
    if (isCorrect) {
      const newStreak = streak + 1;
      const streakBonus = Math.min(newStreak * 10, 50);
      const pointsEarned = 50 + streakBonus;

      setScore(prev => prev + pointsEarned);
      setStreak(newStreak);
      if (newStreak > highestStreak) setHighestStreak(newStreak);
      setCorrectCount(prev => prev + 1);

      // Floating score pop anchored safely to the score metric widget
      setFloatingScores(prev => [
        ...prev.slice(-2),
        {
          id: scoreId,
          text: `+${pointsEarned} P`,
          isPositive: true,
          combo: newStreak >= 2 ? newStreak : undefined
        }
      ]);
    } else {
      setStreak(0);
      setWrongCount(prev => prev + 1);
    }

    // Auto remove floating score item after animation
    setTimeout(() => {
      setFloatingScores(prev => prev.filter(item => item.id !== scoreId));
    }, 1000);

    setLastFeedback({
      correct: isCorrect,
      item: currentItem,
      selectedCategory: categoryId
    });

    if (currentIndex + 1 >= deck.length) {
      endGame();
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const currentItem = deck[currentIndex];

  return (
    <div className="space-y-6">
      {/* 1. INTRO / START SCREEN ("게임을 시작하시겠습니까?") */}
      <AnimatePresence mode="wait">
        {gamePhase === 'intro' && (
          <motion.div
            key="intro-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
              {/* Subtle gentle background ambient glow */}
              <motion.div
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.35, 0.55, 0.35]
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute -top-12 -right-12 w-64 h-64 bg-[#D8F3DC]/60 rounded-full blur-3xl pointer-events-none"
              />
              <motion.div
                animate={{
                  scale: [1.1, 1, 1.1],
                  opacity: [0.25, 0.45, 0.25]
                }}
                transition={{
                  duration: 7,
                  repeat: Infinity,
                  ease: 'easeInOut'
                }}
                className="absolute -bottom-16 -left-16 w-64 h-64 bg-emerald-100/50 rounded-full blur-3xl pointer-events-none"
              />

              {/* Intro Header & Question */}
              <div className="text-center max-w-2xl mx-auto space-y-5 relative z-10">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.1, type: 'spring', stiffness: 200 }}
                  className="inline-flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-full bg-[#D8F3DC] text-[#1B4332] border border-[#B7E4C7] shadow-xs"
                >
                  <motion.div
                    animate={{ rotate: [0, 15, -15, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#2D6A4F]" />
                  </motion.div>
                  <span>에코 챌린지 실전 미션</span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="text-2xl sm:text-4xl font-black text-[#1B4332] tracking-tight"
                >
                  게임을 시작하시겠습니까?
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                  className="text-xs sm:text-sm text-[#52796F] leading-relaxed font-medium"
                >
                  제한시간 60초 동안 일상 속 다양한 폐기물을 올바른 분리수거함에 빠르게 분류해보세요!
                  연속 정답(콤보) 시 추가 보너스 점수와 에코링 캐릭터 성장 경험치(EXP)를 획득할 수 있습니다.
                </motion.p>

                {/* Animated Bento Feature Badges */}
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: { opacity: 0 },
                    visible: {
                      opacity: 1,
                      transition: { staggerChildren: 0.08, delayChildren: 0.25 }
                    }
                  }}
                  className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 text-left"
                >
                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ y: -3, transition: { type: 'spring', stiffness: 350 } }}
                    className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 transition-colors hover:border-[#B7E4C7] hover:bg-[#F4FBF7]"
                  >
                    <div className="w-9 h-9 rounded-xl bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center mb-2.5 shadow-xs">
                      <Timer className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#1B4332]">60초 타임어택</div>
                    <div className="text-[11px] text-[#52796F] mt-0.5 font-medium">순발력과 정확도 대결</div>
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ y: -3, transition: { type: 'spring', stiffness: 350 } }}
                    className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 transition-colors hover:border-amber-300 hover:bg-amber-50/40"
                  >
                    <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center mb-2.5 shadow-xs">
                      <Zap className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#1B4332]">콤보 보너스</div>
                    <div className="text-[11px] text-[#52796F] mt-0.5 font-medium">연속 정답 시 가산점</div>
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ y: -3, transition: { type: 'spring', stiffness: 350 } }}
                    className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 transition-colors hover:border-emerald-300 hover:bg-emerald-50/40"
                  >
                    <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-2.5 shadow-xs">
                      <Award className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#1B4332]">캐릭터 성장</div>
                    <div className="text-[11px] text-[#52796F] mt-0.5 font-medium">EXP 및 탄소 감축량 누적</div>
                  </motion.div>

                  <motion.div
                    variants={{
                      hidden: { opacity: 0, y: 12 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ y: -3, transition: { type: 'spring', stiffness: 350 } }}
                    className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 transition-colors hover:border-blue-300 hover:bg-blue-50/40"
                  >
                    <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center mb-2.5 shadow-xs">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <div className="text-xs font-bold text-[#1B4332]">8종 분리배출</div>
                    <div className="text-[11px] text-[#52796F] mt-0.5 font-medium">환경부 표준 분리함</div>
                  </motion.div>
                </motion.div>

                {/* Big Animated Start Button & Action Guide */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-4">
                  <div className="relative w-full sm:w-auto">
                    {/* Breathing glow halo */}
                    <motion.div
                      animate={{
                        scale: [1, 1.08, 1],
                        opacity: [0.4, 0.8, 0.4]
                      }}
                      transition={{
                        duration: 2.2,
                        repeat: Infinity,
                        ease: 'easeInOut'
                      }}
                      className="absolute inset-0 bg-[#2D6A4F] rounded-2xl blur-md -z-10"
                    />

                    <motion.button
                      id="btn-start-game"
                      onClick={handleStartGame}
                      whileHover={{ scale: 1.04, y: -2 }}
                      whileTap={{ scale: 0.96 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                      className="w-full sm:w-auto px-10 py-4 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-black text-base rounded-2xl shadow-lg flex items-center justify-center gap-2.5 cursor-pointer group"
                    >
                      <motion.div
                        animate={{ x: [0, 3, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        <Play className="w-5 h-5 fill-white" />
                      </motion.div>
                      <span>시작하기!</span>
                    </motion.button>
                  </div>

                  <motion.button
                    id="btn-open-rules-intro"
                    onClick={() => setShowRuleModal(true)}
                    whileHover={{ scale: 1.02, y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                    className="w-full sm:w-auto px-6 py-4 bg-[#F8FAFC] hover:bg-[#EBF2EE] text-[#2C3E50] border border-[#E2E8F0] hover:border-[#B7E4C7] font-bold text-xs rounded-2xl transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                  >
                    <BookOpen className="w-4 h-4 text-[#2D6A4F]" />
                    <span>배출 기준 가이드 확인</span>
                  </motion.button>
                </div>
              </div>
            </div>

            {/* Interactive Waste Categories Showcase (Smooth Animated Interactive Grid) */}
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-[#D8F3DC] text-[#2D6A4F] flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-[#1B4332]">분리수거 8대 분류함 미리보기</h3>
                    <p className="text-xs text-[#52796F] font-medium">
                      카드를 마우스로 올려 각 수거함의 핵심 배출 기준을 확인해보세요.
                    </p>
                  </div>
                </div>
                <span className="hidden sm:inline-flex text-xs font-bold text-[#52796F] bg-[#F8FAFC] border border-[#E2E8F0] px-3 py-1 rounded-full">
                  총 8개 수거함
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                {BIN_CATEGORIES.map((bin, index) => (
                  <motion.div
                    key={bin.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: index * 0.05 }}
                    whileHover={{
                      y: -4,
                      scale: 1.02,
                      transition: { type: 'spring', stiffness: 400, damping: 18 }
                    }}
                    className={`p-4 rounded-2xl border flex flex-col justify-between transition-shadow hover:shadow-md cursor-default ${bin.bgColor} ${bin.borderColor}`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className={`text-xs font-black ${bin.color}`}>{bin.shortName}</span>
                        <Recycle className="w-3.5 h-3.5 text-[#52796F]/70" />
                      </div>
                      <p className="text-[11px] text-[#52796F] line-clamp-2 leading-relaxed font-medium">
                        {bin.description}
                      </p>
                    </div>
                    <div className="mt-3 pt-2 border-t border-black/5 flex flex-wrap gap-1">
                      {bin.disposalRules.slice(0, 2).map((rule, idx) => (
                        <span
                          key={idx}
                          className="text-[10px] bg-white/80 text-[#2C3E50] px-1.5 py-0.5 rounded-md font-medium border border-black/5"
                        >
                          {rule}
                        </span>
                      ))}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. PLAYING SCREEN (Active Classification Game) */}
      <AnimatePresence mode="wait">
        {gamePhase === 'playing' && (
          <motion.div
            key="playing-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Game Header with Stats */}
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm relative overflow-hidden">
              {/* Progress bar along top of header */}
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#F1F5F9]">
                <motion.div
                  className={`h-full ${timeLeft <= 10 ? 'bg-rose-500' : 'bg-[#2D6A4F]'}`}
                  initial={{ width: '100%' }}
                  animate={{ width: `${(timeLeft / 60) * 100}%` }}
                  transition={{ duration: 1, ease: 'linear' }}
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
                <div>
                  <div className="flex items-center gap-2">
                    <motion.span
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#D8F3DC] text-[#1B4332] border border-[#B7E4C7]"
                    >
                      게임 진행 중
                    </motion.span>
                    <h2 className="text-xl font-black text-[#1B4332]">올바른 분리배출 실전 게임</h2>
                  </div>
                  <p className="text-xs text-[#52796F] mt-1 font-medium">
                    실제 헷갈리기 쉬운 일상 폐기물을 정확한 분리수거함으로 신속히 분류하세요.
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <motion.button
                    id="btn-rules-guide"
                    onClick={() => setShowRuleModal(true)}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#2C3E50] bg-[#F8FAFC] hover:bg-[#EBF2EE] border border-[#E2E8F0] rounded-xl px-3 py-2 transition-colors shadow-xs cursor-pointer"
                  >
                    <BookOpen className="w-3.5 h-3.5 text-[#2D6A4F]" />
                    배출 기준
                  </motion.button>
                  <motion.button
                    id="btn-restart-game"
                    onClick={handleStartGame}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#2D6A4F] hover:bg-[#1B4332] rounded-xl px-3 py-2 transition-colors shadow-xs cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    재시작
                  </motion.button>
                  <motion.button
                    id="btn-quit-to-intro"
                    onClick={handleGoToIntro}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="flex items-center gap-1.5 text-xs font-bold text-[#52796F] hover:text-[#1B4332] bg-[#F8FAFC] hover:bg-[#E2E8F0] border border-[#E2E8F0] rounded-xl px-3 py-2 transition-colors cursor-pointer"
                  >
                    <Home className="w-3.5 h-3.5" />
                    처음으로
                  </motion.button>
                </div>
              </div>

              {/* Real-time Bento Metric Dashboard */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-[#E2E8F0]">
                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-3.5 flex items-center justify-between relative overflow-visible">
                  {/* Floating Score Popups safely anchored to the Score card */}
                  <AnimatePresence>
                    {floatingScores.map(fs => (
                      <motion.div
                        key={fs.id}
                        initial={{ opacity: 0, y: 0, scale: 0.8 }}
                        animate={{ opacity: 1, y: -26, scale: 1.05 }}
                        exit={{ opacity: 0, y: -42, scale: 0.9 }}
                        transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute -top-2 right-3 z-30 pointer-events-none font-black text-xs px-2.5 py-0.5 rounded-full shadow-sm flex items-center gap-1 bg-[#2D6A4F] text-white border border-[#52B788]"
                      >
                        {fs.combo && (
                          <span className="text-[10px] text-amber-300 font-extrabold">
                            {fs.combo}X
                          </span>
                        )}
                        <span>{fs.text}</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  <div>
                    <div className="text-[11px] text-[#52796F] font-medium">현재 점수</div>
                    <motion.div
                      key={score}
                      initial={{ scale: 1.15, color: '#1B4332' }}
                      animate={{ scale: 1, color: '#2D6A4F' }}
                      transition={{ duration: 0.3 }}
                      className="text-lg font-black"
                    >
                      {score} P
                    </motion.div>
                  </div>
                  <Award className="w-5 h-5 text-[#2D6A4F]/60" />
                </div>

                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-3.5 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-[#52796F] font-medium">연속 정답 (콤보)</div>
                    <div className="text-lg font-black text-amber-700 flex items-center gap-1">
                      <motion.span
                        key={streak}
                        initial={{ scale: 1.3 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                      >
                        {streak} 연승
                      </motion.span>
                      {streak >= 3 && (
                        <motion.div
                          animate={{
                            scale: [1, 1.25, 1],
                            rotate: [0, -8, 8, 0]
                          }}
                          transition={{ duration: 0.6, repeat: Infinity, ease: 'easeInOut' }}
                        >
                          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <Zap className="w-5 h-5 text-amber-500/60" />
                </div>

                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-3.5 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-[#52796F] font-medium">남은 시간</div>
                    <motion.div
                      key={timeLeft}
                      animate={timeLeft <= 10 ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 0.5 }}
                      className={`text-lg font-black ${
                        timeLeft <= 10 ? 'text-rose-600 font-black' : 'text-[#1B4332]'
                      }`}
                    >
                      {timeLeft} 초
                    </motion.div>
                  </div>
                  <Timer className={`w-5 h-5 ${timeLeft <= 10 ? 'text-rose-500' : 'text-[#52796F]'}`} />
                </div>

                <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-3.5 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] text-[#52796F] font-medium">진행도</div>
                    <div className="text-lg font-black text-[#0369A1]">
                      {currentIndex + 1} / {deck.length || 12}
                    </div>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-[#0369A1]/60" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Current Trash Item Display (Left) */}
              <div className="lg:col-span-5 flex flex-col justify-between bg-white border border-[#E2E8F0] rounded-3xl p-6 relative overflow-hidden shadow-sm">
                <motion.div
                  animate={{
                    scale: [1, 1.1, 1],
                    opacity: [0.25, 0.45, 0.25]
                  }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                  className="absolute top-0 right-0 w-36 h-36 bg-[#D8F3DC]/40 rounded-full blur-2xl pointer-events-none"
                />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-[#F8FAFC] text-[#52796F] border border-[#E2E8F0]">
                      아이템 #{currentIndex + 1}
                    </span>
                    <span
                      className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                        currentItem?.difficulty === 'hard'
                          ? 'bg-rose-50 text-rose-700 border-rose-200'
                          : currentItem?.difficulty === 'medium'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-[#D8F3DC] text-[#1B4332] border-[#B7E4C7]'
                      }`}
                    >
                      난이도: {currentItem?.difficulty === 'hard' ? '고난도' : currentItem?.difficulty === 'medium' ? '중급' : '기초'}
                    </span>
                  </div>

                  {/* Item Artwork Box with Silky Smooth Spring Entrance */}
                  <div className="my-6 relative flex flex-col items-center justify-center p-8 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl min-h-[220px]">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentItem?.id}
                        initial={{ scale: 0.82, y: 15, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.85, y: -15, opacity: 0 }}
                        transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                        className="flex flex-col items-center justify-center"
                      >
                        <motion.div
                          animate={{ y: [0, -4, 0] }}
                          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                          className="w-20 h-20 rounded-2xl bg-[#D8F3DC] border border-[#B7E4C7] flex items-center justify-center text-[#2D6A4F] mb-4 shadow-sm"
                        >
                          <AlertCircle className="w-10 h-10" />
                        </motion.div>

                        <h3 className="text-2xl font-black text-[#1B4332] text-center tracking-tight">
                          {currentItem?.name}
                        </h3>
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Helpful Hint / Tip with Smooth Slide */}
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={currentItem?.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                      className="bg-[#D8F3DC]/40 border border-[#B7E4C7] rounded-2xl p-3.5 text-xs text-[#2D6A4F] space-y-1.5"
                    >
                      <div className="font-bold text-[#1B4332] flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-[#2D6A4F]" />
                        분리배출 핵심 힌트
                      </div>
                      <p className="text-[#2D6A4F] leading-relaxed font-medium">{currentItem?.tip}</p>
                    </motion.div>
                  </AnimatePresence>
                </div>

                {/* Footnote */}
                <div className="mt-6 pt-4 border-t border-[#E2E8F0] text-center">
                  <p className="text-xs text-[#52796F] font-medium">
                    오른쪽 8개의 분리수거함 중 올바른 대상을 클릭하세요.
                  </p>
                </div>
              </div>

              {/* 8 Waste Bins Selection Grid (Right) */}
              <div className="lg:col-span-7 flex flex-col space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {BIN_CATEGORIES.map(bin => (
                    <motion.button
                      key={bin.id}
                      id={`bin-select-${bin.id}`}
                      onClick={() => handleClassify(bin.id)}
                      whileHover={{
                        scale: 1.03,
                        y: -3,
                        transition: { type: 'spring', stiffness: 450, damping: 18 }
                      }}
                      whileTap={{
                        scale: 0.96,
                        transition: { type: 'spring', stiffness: 500, damping: 15 }
                      }}
                      className={`flex flex-col items-start justify-between p-4 rounded-2xl border text-left transition-shadow hover:shadow-md ${bin.bgColor} ${bin.borderColor} min-h-[110px] cursor-pointer`}
                    >
                      <div className="w-full flex items-center justify-between">
                        <span className={`text-sm font-bold ${bin.color}`}>{bin.shortName}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#52796F]" />
                      </div>
                      <p className="text-[11px] text-[#52796F] line-clamp-2 mt-2 leading-relaxed font-medium">
                        {bin.description}
                      </p>
                    </motion.button>
                  ))}
                </div>

                {/* Feedback Banner with Smooth Spring Animation */}
                <AnimatePresence mode="wait">
                  {lastFeedback && (
                    <motion.div
                      key={`${lastFeedback.item.id}-${lastFeedback.correct}`}
                      initial={{ opacity: 0, y: 10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -8, scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 350, damping: 20 }}
                      className={`p-4 rounded-2xl border flex items-start gap-3.5 shadow-sm ${
                        lastFeedback.correct
                          ? 'bg-[#D8F3DC] border-[#B7E4C7] text-[#1B4332]'
                          : 'bg-rose-50 border-rose-200 text-rose-900'
                      }`}
                    >
                      {lastFeedback.correct ? (
                        <motion.div
                          initial={{ scale: 0.5, rotate: -30 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 500 }}
                        >
                          <CheckCircle2 className="w-5 h-5 text-[#2D6A4F] shrink-0 mt-0.5" />
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ scale: 0.5, rotate: 30 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ type: 'spring', stiffness: 500 }}
                        >
                          <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        </motion.div>
                      )}
                      <div className="space-y-1 text-xs">
                        <div className="font-bold flex items-center gap-2">
                          <span>{lastFeedback.correct ? '정답입니다!' : '오답입니다.'}</span>
                          <span className="font-normal text-[#2C3E50]">
                            [{lastFeedback.item.name}] 정답:{' '}
                            <strong className="text-[#1B4332] font-bold">
                              {BIN_CATEGORIES.find(b => b.id === lastFeedback.item.category)?.name}
                            </strong>
                          </span>
                        </div>
                        <p className="leading-relaxed font-medium text-[#2C3E50]">
                          {lastFeedback.item.explanation}
                        </p>
                        {lastFeedback.item.commonMistakeNote && (
                          <p className="text-amber-800 font-bold pt-0.5">
                            주의: {lastFeedback.item.commonMistakeNote}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. GAME ENDED SCREEN */}
      <AnimatePresence mode="wait">
        {gamePhase === 'ended' && (
          <motion.div
            key="ended-screen"
            id="game-results-panel"
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="bg-white border border-[#E2E8F0] rounded-3xl p-8 text-center max-w-2xl mx-auto shadow-sm space-y-6"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -20 }}
              animate={{ scale: [0.8, 1.15, 1], rotate: [0, -8, 8, 0] }}
              transition={{ duration: 0.7, type: 'spring', stiffness: 300, damping: 15 }}
              className="w-16 h-16 bg-[#D8F3DC] border border-[#B7E4C7] text-[#2D6A4F] rounded-2xl flex items-center justify-center mx-auto shadow-sm"
            >
              <Award className="w-8 h-8" />
            </motion.div>

            <div>
              <h3 className="text-2xl font-black text-[#1B4332]">분리배출 챌린지 완료!</h3>
              <p className="text-xs sm:text-sm text-[#52796F] mt-1 font-medium">
                수고하셨습니다. 당신의 올바른 분리배출 실천이 지구의 탄소 배출을 줄였습니다.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]"
              >
                <div className="text-xs text-[#52796F] font-medium">최종 점수</div>
                <div className="text-2xl font-black text-[#2D6A4F] mt-1">{score} P</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]"
              >
                <div className="text-xs text-[#52796F] font-medium">정답률</div>
                <div className="text-2xl font-black text-[#0369A1] mt-1">
                  {Math.round((correctCount / (correctCount + wrongCount || 1)) * 100)}%
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]"
              >
                <div className="text-xs text-[#52796F] font-medium">최대 연속 정답</div>
                <div className="text-2xl font-black text-amber-700 mt-1">{highestStreak} 회</div>
              </motion.div>
            </div>

            <div className="flex flex-wrap justify-center gap-3 pt-2">
              <motion.button
                id="btn-play-again"
                onClick={handleStartGame}
                whileHover={{ scale: 1.04, y: -2 }}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                className="px-7 py-3.5 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>다시 도전하기</span>
              </motion.button>

              <motion.button
                onClick={handleGoToIntro}
                whileHover={{ scale: 1.02, y: -1 }}
                whileTap={{ scale: 0.98 }}
                className="px-6 py-3.5 bg-[#F8FAFC] hover:bg-[#EBF2EE] border border-[#E2E8F0] text-[#2C3E50] font-bold text-xs rounded-xl transition-colors flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Home className="w-4 h-4" />
                <span>처음 화면으로</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Rules Guide Modal */}
      <AnimatePresence>
        {showRuleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="bg-white border border-[#E2E8F0] rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="p-5 border-b border-[#E2E8F0] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[#2D6A4F]" />
                  <h3 className="font-bold text-[#1B4332] text-base">환경부 분리배출 4대 원칙 및 가이드</h3>
                </div>
                <button
                  onClick={() => setShowRuleModal(false)}
                  className="text-[#52796F] hover:text-[#1B4332] text-sm font-bold px-2 py-1 cursor-pointer"
                >
                  닫기
                </button>
              </div>

              <div className="p-5 overflow-y-auto space-y-4">
                <div className="bg-[#D8F3DC]/50 border border-[#B7E4C7] p-4 rounded-2xl">
                  <h4 className="font-bold text-[#1B4332] text-sm mb-1.5">분리배출 4대 핵심 원칙</h4>
                  <ul className="text-xs text-[#2D6A4F] space-y-1 font-medium">
                    <li>1. <strong>비운다</strong>: 용기 안의 내용물을 완전히 비웁니다.</li>
                    <li>2. <strong>헹군다</strong>: 이물질이나 양념, 기름때를 물로 깨끗이 헹굽니다.</li>
                    <li>3. <strong>분리한다</strong>: 라벨, 테이프, 스프링 등 다른 재질을 분리합니다.</li>
                    <li>4. <strong>섞지 않는다</strong>: 종류별로 규격에 맞게 수거함에 배출합니다.</li>
                  </ul>
                </div>

                <div className="space-y-3">
                  {BIN_CATEGORIES.map(bin => (
                    <div key={bin.id} className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold ${bin.color}`}>{bin.name}</span>
                      </div>
                      <p className="text-xs text-[#52796F] mb-2 font-medium">{bin.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {bin.disposalRules.map((rule, idx) => (
                          <span key={idx} className="text-[11px] bg-white text-[#2C3E50] px-2.5 py-0.5 rounded-lg border border-[#E2E8F0] font-medium">
                            {rule}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-[#E2E8F0] flex justify-end">
                <button
                  onClick={() => setShowRuleModal(false)}
                  className="px-5 py-2 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs rounded-xl cursor-pointer"
                >
                  확인했습니다
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
