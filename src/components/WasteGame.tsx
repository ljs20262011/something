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
  BookOpen
} from 'lucide-react';
import { TrashItem, BinCategoryId } from '../types';
import { BIN_CATEGORIES, TRASH_ITEMS } from '../data/ecoData';

interface WasteGameProps {
  onEarnExp: (exp: number, points: number, co2Kg: number) => void;
}

export const WasteGame: React.FC<WasteGameProps> = ({ onEarnExp }) => {
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
  const [gameEnded, setGameEnded] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isTimerActive, setIsTimerActive] = useState<boolean>(false);
  const [showRuleModal, setShowRuleModal] = useState<boolean>(false);

  // Synthesize clean audio cues via Web Audio API without external file dependencies
  const playSound = (isSuccess: boolean) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
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
      // Audio context might be restricted before user gesture, safely ignored
    }
  };

  const startNewGame = () => {
    // Shuffle items
    const shuffled = [...TRASH_ITEMS].sort(() => Math.random() - 0.5);
    setDeck(shuffled);
    setCurrentIndex(0);
    setScore(0);
    setStreak(0);
    setCorrectCount(0);
    setWrongCount(0);
    setLastFeedback(null);
    setGameEnded(false);
    setTimeLeft(60);
    setIsTimerActive(true);
  };

  useEffect(() => {
    startNewGame();
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!isTimerActive || gameEnded) return;

    if (timeLeft <= 0) {
      endGame();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, isTimerActive, gameEnded]);

  const endGame = () => {
    setGameEnded(true);
    setIsTimerActive(false);

    // Calculate final exp and points
    const earnedExp = Math.round(score / 5) + correctCount * 15;
    const earnedPoints = score + 50;
    const co2Kg = correctCount * 0.25;

    onEarnExp(earnedExp, earnedPoints, co2Kg);

    if (score >= 300) {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  const handleClassify = (categoryId: BinCategoryId) => {
    if (gameEnded || !deck[currentIndex]) return;

    const currentItem = deck[currentIndex];
    const isCorrect = currentItem.category === categoryId;

    playSound(isCorrect);

    if (isCorrect) {
      const newStreak = streak + 1;
      const streakBonus = Math.min(newStreak * 10, 50);
      const pointsEarned = 50 + streakBonus;

      setScore(prev => prev + pointsEarned);
      setStreak(newStreak);
      if (newStreak > highestStreak) setHighestStreak(newStreak);
      setCorrectCount(prev => prev + 1);
    } else {
      setStreak(0);
      setWrongCount(prev => prev + 1);
    }

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
      {/* Game Header with Stats */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#D8F3DC] text-[#1B4332] border border-[#B7E4C7]">
                인터랙티브 챌린지
              </span>
              <h2 className="text-xl font-black text-[#1B4332]">올바른 분리배출 실전 게임</h2>
            </div>
            <p className="text-xs text-[#52796F] mt-1 font-medium">
              실제 헷갈리기 쉬운 일상 폐기물을 정확한 분리수거함으로 분류하세요.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-rules-guide"
              onClick={() => setShowRuleModal(true)}
              className="flex items-center gap-1.5 text-xs font-bold text-[#2C3E50] bg-[#F8FAFC] hover:bg-[#EBF2EE] border border-[#E2E8F0] rounded-xl px-3.5 py-2 transition-all shadow-xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-[#2D6A4F]" />
              배출 기준 가이드
            </button>
            <button
              id="btn-restart-game"
              onClick={startNewGame}
              className="flex items-center gap-1.5 text-xs font-bold text-white bg-[#2D6A4F] hover:bg-[#1B4332] rounded-xl px-3.5 py-2 transition-all shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              게임 재시작
            </button>
          </div>
        </div>

        {/* Real-time Bento Metric Dashboard */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-5 border-t border-[#E2E8F0]">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-3.5 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-[#52796F] font-medium">현재 점수</div>
              <div className="text-lg font-black text-[#2D6A4F]">{score} P</div>
            </div>
            <Award className="w-5 h-5 text-[#2D6A4F]/60" />
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-3.5 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-[#52796F] font-medium">연속 정답 (콤보)</div>
              <div className="text-lg font-black text-amber-700 flex items-center gap-1">
                {streak} 연승
                {streak >= 3 && <Zap className="w-4 h-4 text-amber-500 fill-amber-500 animate-bounce" />}
              </div>
            </div>
            <Zap className="w-5 h-5 text-amber-500/60" />
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-3.5 flex items-center justify-between">
            <div>
              <div className="text-[11px] text-[#52796F] font-medium">남은 시간</div>
              <div className={`text-lg font-black ${timeLeft <= 10 ? 'text-rose-600 animate-pulse' : 'text-[#1B4332]'}`}>
                {timeLeft} 초
              </div>
            </div>
            <Timer className="w-5 h-5 text-[#52796F]" />
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

      {!gameEnded ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Current Trash Item Display (Left / Top) */}
          <div className="lg:col-span-5 flex flex-col justify-between bg-white border border-[#E2E8F0] rounded-3xl p-6 relative overflow-hidden shadow-sm">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D8F3DC]/30 rounded-full blur-2xl pointer-events-none" />

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

              {/* Item Card Artwork Box */}
              <div className="my-6 flex flex-col items-center justify-center p-8 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl">
                <motion.div
                  key={currentItem?.id}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="w-20 h-20 rounded-2xl bg-[#D8F3DC] border border-[#B7E4C7] flex items-center justify-center text-[#2D6A4F] mb-4 shadow-xs"
                >
                  <AlertCircle className="w-10 h-10" />
                </motion.div>

                <h3 className="text-2xl font-black text-[#1B4332] text-center tracking-tight">
                  {currentItem?.name}
                </h3>
              </div>

              {/* Helpful Hint / Tip */}
              <div className="bg-[#D8F3DC]/40 border border-[#B7E4C7] rounded-2xl p-3.5 text-xs text-[#2D6A4F] space-y-1.5">
                <div className="font-bold text-[#1B4332] flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-[#2D6A4F]" />
                  분리배출 핵심 힌트
                </div>
                <p className="text-[#2D6A4F] leading-relaxed font-medium">{currentItem?.tip}</p>
              </div>
            </div>

            {/* Instruction footnote */}
            <div className="mt-6 pt-4 border-t border-[#E2E8F0] text-center">
              <p className="text-xs text-[#52796F] font-medium">
                오른쪽 8개의 분리수거함 중 올바른 대상을 클릭하세요.
              </p>
            </div>
          </div>

          {/* 8 Waste Bins Selection Grid (Right / Bottom) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {BIN_CATEGORIES.map(bin => (
                <motion.button
                  key={bin.id}
                  id={`bin-select-${bin.id}`}
                  onClick={() => handleClassify(bin.id)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`flex flex-col items-start justify-between p-4 rounded-2xl border text-left transition-all ${bin.bgColor} ${bin.borderColor} min-h-[110px] shadow-xs cursor-pointer`}
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

            {/* Real-time Feedback Banner for the last action */}
            <AnimatePresence>
              {lastFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className={`p-4 rounded-2xl border flex items-start gap-3.5 shadow-xs ${
                    lastFeedback.correct
                      ? 'bg-[#D8F3DC] border-[#B7E4C7] text-[#1B4332]'
                      : 'bg-rose-50 border-rose-200 text-rose-900'
                  }`}
                >
                  {lastFeedback.correct ? (
                    <CheckCircle2 className="w-5 h-5 text-[#2D6A4F] shrink-0 mt-0.5" />
                  ) : (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1 text-xs">
                    <div className="font-bold flex items-center gap-2">
                      <span>{lastFeedback.correct ? '정답입니다!' : '오답입니다.'}</span>
                      <span className="font-normal text-[#2C3E50]">
                        [{lastFeedback.item.name}] 정답: {' '}
                        <strong className="text-[#1B4332] font-bold">
                          {BIN_CATEGORIES.find(b => b.id === lastFeedback.item.category)?.name}
                        </strong>
                      </span>
                    </div>
                    <p className="leading-relaxed font-medium text-[#2C3E50]">{lastFeedback.item.explanation}</p>
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
      ) : (
        // Game Completed Summary Screen
        <div id="game-results-panel" className="bg-white border border-[#E2E8F0] rounded-3xl p-8 text-center max-w-2xl mx-auto shadow-sm">
          <div className="w-16 h-16 bg-[#D8F3DC] border border-[#B7E4C7] text-[#2D6A4F] rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Award className="w-8 h-8" />
          </div>

          <h3 className="text-2xl font-black text-[#1B4332]">분리배출 챌린지 완료!</h3>
          <p className="text-sm text-[#52796F] mt-1 font-medium">
            수고하셨습니다. 당신의 올바른 분리배출이 지구의 탄소 배출을 줄였습니다.
          </p>

          <div className="grid grid-cols-3 gap-3 my-6">
            <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
              <div className="text-xs text-[#52796F] font-medium">최종 점수</div>
              <div className="text-2xl font-black text-[#2D6A4F] mt-1">{score} P</div>
            </div>
            <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
              <div className="text-xs text-[#52796F] font-medium">정답률</div>
              <div className="text-2xl font-black text-[#0369A1] mt-1">
                {Math.round((correctCount / (correctCount + wrongCount || 1)) * 100)}%
              </div>
            </div>
            <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
              <div className="text-xs text-[#52796F] font-medium">최대 연속 정답</div>
              <div className="text-2xl font-black text-amber-700 mt-1">{highestStreak} 회</div>
            </div>
          </div>

          <div className="flex justify-center gap-3">
            <button
              id="btn-play-again"
              onClick={startNewGame}
              className="px-6 py-2.5 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-sm rounded-xl transition-all shadow-md"
            >
              다시 도전하기
            </button>
            <button
              onClick={() => setShowRuleModal(true)}
              className="px-6 py-2.5 bg-[#F8FAFC] hover:bg-[#EBF2EE] border border-[#E2E8F0] text-[#2C3E50] font-bold text-sm rounded-xl transition-all"
            >
              오답 가이드 복습
            </button>
          </div>
        </div>
      )}

      {/* Rules Guide Modal */}
      {showRuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border border-[#E2E8F0] rounded-3xl max-w-2xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
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
          </div>
        </div>
      )}
    </div>
  );
};
