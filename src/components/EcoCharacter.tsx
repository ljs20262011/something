import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Heart, Trophy, Leaf, RefreshCw, Shield, Award } from 'lucide-react';
import { CharacterState } from '../types';
import { CHARACTER_STAGES } from '../data/ecoData';

interface EcoCharacterProps {
  character: CharacterState;
  onInteract: () => void;
  compact?: boolean;
}

export const EcoCharacter: React.FC<EcoCharacterProps> = ({ character, onInteract, compact = false }) => {
  const [bubbleText, setBubbleText] = useState<string>(character.activeQuote);
  const [isWiggling, setIsWiggling] = useState(false);

  const stageData = CHARACTER_STAGES.find(s => s.level === character.level) || CHARACTER_STAGES[0];

  const handleCharacterClick = () => {
    setIsWiggling(true);
    setTimeout(() => setIsWiggling(false), 800);

    const randomQuote = stageData.dialogues[Math.floor(Math.random() * stageData.dialogues.length)];
    setBubbleText(randomQuote);
    onInteract();
  };

  const expPercentage = Math.min(100, Math.round((character.exp / character.maxExp) * 100));

  if (compact) {
    return (
      <div
        id="compact-eco-character"
        onClick={handleCharacterClick}
        className="flex items-center gap-3 bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] rounded-full px-3.5 py-1.5 cursor-pointer transition-all shadow-sm group"
      >
        <div className="relative w-8 h-8 flex items-center justify-center bg-[#D8F3DC] rounded-full border border-[#B7E4C7]">
          <motion.div
            animate={isWiggling ? { rotate: [0, -15, 15, -10, 10, 0] } : { y: [0, -2, 0] }}
            transition={isWiggling ? { duration: 0.6 } : { repeat: Infinity, duration: 2.5 }}
          >
            <Leaf className="w-4 h-4 text-[#2D6A4F]" />
          </motion.div>
          <span className="absolute -bottom-1 -right-1 bg-[#2D6A4F] text-white text-[10px] font-black rounded-full px-1">
            Lv.{character.level}
          </span>
        </div>
        <div className="text-left">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-[#1B4332]">{character.name}</span>
            <span className="text-[11px] text-[#52796F]">({stageData.title})</span>
          </div>
          <div className="w-20 bg-[#EDF2F4] h-1.5 rounded-full overflow-hidden mt-0.5">
            <div
              className="bg-gradient-to-r from-[#2D6A4F] to-[#40916C] h-full rounded-full transition-all duration-500"
              style={{ width: `${expPercentage}%` }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="eco-character-card" className="bg-white border border-[#E2E8F0] rounded-3xl p-6 relative overflow-hidden shadow-sm">
      {/* Background subtle light ambient tint */}
      <div className="absolute -right-16 -top-16 w-52 h-52 bg-[#D8F3DC]/30 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex items-center justify-between relative z-10 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 bg-[#D8F3DC] border border-[#B7E4C7] rounded-xl text-[#2D6A4F]">
            <Shield className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-[#1B4332] text-sm flex items-center gap-1.5">
              {character.name}
              <span className="text-xs font-bold px-2 py-0.5 bg-[#D8F3DC] text-[#1B4332] rounded-full border border-[#B7E4C7]">
                Lv.{character.level} {stageData.title}
              </span>
            </h3>
            <p className="text-xs text-[#52796F]">{character.stageDescription}</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-[#1B4332] font-bold bg-[#D8F3DC] border border-[#B7E4C7] px-3 py-1 rounded-full shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#2D6A4F]" />
          <span>{character.totalEcoPoints.toLocaleString()} P</span>
        </div>
      </div>

      {/* Dialogue Speech Bubble */}
      <div className="relative z-10 mb-5 min-h-[48px] flex items-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={bubbleText}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.2 }}
            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-3.5 text-xs text-[#2C3E50] relative shadow-xs"
          >
            <div className="absolute -bottom-2 left-10 w-3 h-3 bg-[#F8FAFC] border-r border-b border-[#E2E8F0] rotate-45" />
            <p className="font-medium leading-relaxed">{bubbleText}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Central Interactive Avatar Stage */}
      <div className="flex flex-col items-center justify-center my-2 relative z-10">
        <motion.div
          id="character-avatar-touch"
          onClick={handleCharacterClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={
            isWiggling
              ? { rotate: [0, -12, 12, -8, 8, 0], scale: [1, 1.1, 1] }
              : { y: [0, -6, 0] }
          }
          transition={
            isWiggling
              ? { duration: 0.7 }
              : { repeat: Infinity, duration: 3.2, ease: "easeInOut" }
          }
          className="cursor-pointer relative w-36 h-36 flex items-center justify-center"
        >
          {/* Outer Halo */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-emerald-500/20 via-teal-400/20 to-transparent border border-emerald-400/20 animate-pulse" />

          {/* SVG Character Graphics by Level */}
          <svg viewBox="0 0 160 160" className="w-32 h-32" fill="none">
            {character.level === 1 && (
              // Stage 1: Sprout in small mound
              <g id="char-stage-1">
                {/* Soil Mound */}
                <ellipse cx="80" cy="120" rx="42" ry="14" fill="#3E2723" opacity="0.9" />
                <ellipse cx="80" cy="118" rx="34" ry="10" fill="#5D4037" />
                {/* Sprout Stem */}
                <path d="M80 118 Q76 90 80 75" stroke="#10B981" strokeWidth="6" strokeLinecap="round" />
                {/* Twin Leaves */}
                <path d="M80 85 C60 80 50 65 65 55 C80 55 80 75 80 85 Z" fill="#34D399" />
                <path d="M80 78 C100 73 110 58 95 48 C80 48 80 68 80 78 Z" fill="#10B981" />
                {/* Cute Facial Feature on Mound */}
                <circle cx="73" cy="116" r="2.5" fill="#FFFFFF" />
                <circle cx="87" cy="116" r="2.5" fill="#FFFFFF" />
                <path d="M78 121 Q80 124 82 121" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" />
              </g>
            )}

            {character.level === 2 && (
              // Stage 2: Friendly Leafling with body and arms
              <g id="char-stage-2">
                {/* Soft glow */}
                <circle cx="80" cy="80" r="50" fill="#065F46" opacity="0.4" />
                {/* Body Pear shape */}
                <path
                  d="M80 40 C105 40 115 65 115 95 C115 125 100 135 80 135 C60 135 45 125 45 95 C45 65 55 40 80 40 Z"
                  fill="#10B981"
                />
                {/* Belly patch */}
                <ellipse cx="80" cy="100" rx="22" ry="25" fill="#A7F3D0" />
                {/* Big cute eyes */}
                <ellipse cx="68" cy="78" rx="5" ry="6" fill="#0F172A" />
                <circle cx="66" cy="76" r="2" fill="#FFFFFF" />
                <ellipse cx="92" cy="78" rx="5" ry="6" fill="#0F172A" />
                <circle cx="90" cy="76" r="2" fill="#FFFFFF" />
                {/* Rosy Cheeks */}
                <circle cx="60" cy="86" r="4" fill="#F472B6" opacity="0.6" />
                <circle cx="100" cy="86" r="4" fill="#F472B6" opacity="0.6" />
                {/* Smile */}
                <path d="M75 88 Q80 94 85 88" stroke="#0F172A" strokeWidth="2.5" strokeLinecap="round" />
                {/* Leaf Antenna on Head */}
                <path d="M80 40 Q80 20 95 18 C95 28 85 35 80 40 Z" fill="#34D399" />
              </g>
            )}

            {character.level === 3 && (
              // Stage 3: Young Guardian Tree with cute crown and foliage
              <g id="char-stage-3">
                {/* Trunk */}
                <path d="M70 140 L73 80 Q80 75 87 80 L90 140 Z" fill="#78350F" />
                {/* Foliage Cloud 1 */}
                <circle cx="80" cy="55" r="32" fill="#059669" />
                <circle cx="58" cy="65" r="24" fill="#10B981" />
                <circle cx="102" cy="65" r="24" fill="#10B981" />
                <circle cx="80" cy="40" r="22" fill="#34D399" />
                {/* Face on Trunk */}
                <circle cx="76" cy="98" r="3" fill="#FFFFFF" />
                <circle cx="84" cy="98" r="3" fill="#FFFFFF" />
                <path d="M77 106 Q80 110 83 106" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" />
                {/* Golden Leaf Crown */}
                <polygon points="80,18 84,28 92,26 87,33 90,40 80,36 70,40 73,33 68,26 76,28" fill="#FBBF24" />
              </g>
            )}

            {character.level >= 4 && (
              // Stage 4: Cosmic Guardian World Tree with Planet and Aura
              <g id="char-stage-4">
                {/* Cosmic Orbit Rings */}
                <ellipse cx="80" cy="80" rx="65" ry="24" stroke="#38BDF8" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.7" transform="rotate(-20 80 80)" />
                <circle cx="130" cy="65" r="5" fill="#38BDF8" />
                {/* Earth Base */}
                <circle cx="80" cy="115" r="32" fill="#1D4ED8" />
                <path d="M65 110 C70 98 85 100 90 112 C85 125 68 128 65 110 Z" fill="#10B981" />
                <path d="M92 118 C96 112 104 116 102 125 Z" fill="#059669" />
                {/* Majestic Sacred Tree atop Earth */}
                <path d="M76 100 L76 60 Q80 55 84 60 L84 100 Z" fill="#92400E" />
                <circle cx="80" cy="48" r="26" fill="#047857" />
                <circle cx="62" cy="55" r="18" fill="#10B981" />
                <circle cx="98" cy="55" r="18" fill="#10B981" />
                <circle cx="80" cy="32" r="16" fill="#6EE7B7" />
                {/* Star Gems */}
                <polygon points="80,14 82,20 88,21 83,25 85,31 80,28 75,31 77,25 72,21 78,20" fill="#FDE047" />
              </g>
            )}
          </svg>
        </motion.div>

        <span className="text-[11px] text-[#52796F] mt-1 flex items-center gap-1 font-medium">
          <RefreshCw className="w-3 h-3 text-[#2D6A4F]" />
          터치하여 교감하기
        </span>
      </div>

      {/* Progress & Stats Bars */}
      <div className="space-y-3 pt-3 border-t border-[#E2E8F0] relative z-10">
        {/* EXP Bar */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-[#52796F] font-medium">다음 단계까지 성장 경험치</span>
            <span className="text-[#2D6A4F] font-bold">
              {character.exp} / {character.maxExp} EXP ({expPercentage}%)
            </span>
          </div>
          <div className="h-2.5 bg-[#EDF2F4] rounded-full overflow-hidden p-0.5 border border-[#E2E8F0]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${expPercentage}%` }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-[#2D6A4F] via-[#40916C] to-[#52B788] rounded-full shadow-xs"
            />
          </div>
        </div>

        {/* Vitality & Carbon Reduction stat chips */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-2.5 flex items-center gap-2.5">
            <div className="p-1.5 bg-rose-50 text-rose-600 rounded-xl">
              <Heart className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-[#52796F] font-medium">지구 활력 지수</div>
              <div className="text-xs font-bold text-[#2C3E50]">{character.vitality}% 정상</div>
            </div>
          </div>

          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-2.5 flex items-center gap-2.5">
            <div className="p-1.5 bg-[#D8F3DC] text-[#2D6A4F] rounded-xl">
              <Leaf className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[10px] text-[#52796F] font-medium">탄소 감축 기여</div>
              <div className="text-xs font-bold text-[#1B4332]">-{character.co2SavedKg.toFixed(1)} kg CO₂</div>
            </div>
          </div>
        </div>

        {/* Badges Earned */}
        <div className="pt-2">
          <div className="text-[11px] font-bold text-[#52796F] mb-2 flex items-center gap-1.5">
            <Trophy className="w-3.5 h-3.5 text-amber-500" />
            획득한 친환경 배지 ({character.badges.length})
          </div>
          <div className="flex flex-wrap gap-1.5">
            {character.badges.map((badge, idx) => (
              <span
                key={idx}
                className="text-[11px] font-semibold bg-[#F8FAFC] border border-[#E2E8F0] text-[#2C3E50] px-2.5 py-1 rounded-xl flex items-center gap-1 shadow-xs"
              >
                <Award className="w-3 h-3 text-[#2D6A4F]" />
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
