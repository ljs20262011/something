import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  Video,
  CheckCircle2,
  XCircle,
  Award,
  RotateCcw,
  BookOpen,
  Play,
  Share2,
  Sparkles,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { QuizQuestion, LearningVideo } from '../types';
import { QUIZ_QUESTIONS, LEARNING_VIDEOS } from '../data/ecoData';

interface ClimateEducationProps {
  onEarnExp: (exp: number, points: number) => void;
}

export const ClimateEducation: React.FC<ClimateEducationProps> = ({ onEarnExp }) => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'video'>('quiz');

  // Quiz State
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [quizFinished, setQuizFinished] = useState(false);
  const [answeredHistory, setAnsweredHistory] = useState<{
    questionId: number;
    userIndex: number;
    isCorrect: boolean;
  }[]>([]);

  // Video State
  const [selectedVideo, setSelectedVideo] = useState<LearningVideo>(LEARNING_VIDEOS[0]);

  // Quiz Option Click
  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedOption(idx);
  };

  // Submit Answer
  const handleSubmitAnswer = () => {
    if (selectedOption === null || isAnswerSubmitted) return;

    const currentQ = QUIZ_QUESTIONS[currentQuizIndex];
    const isCorrect = selectedOption === currentQ.correctIndex;

    if (isCorrect) {
      setScore(prev => prev + 100);
      onEarnExp(25, 50);
    }

    setAnsweredHistory(prev => [
      ...prev,
      {
        questionId: currentQ.id,
        userIndex: selectedOption,
        isCorrect
      }
    ]);

    setIsAnswerSubmitted(true);
  };

  // Next Question
  const handleNextQuestion = () => {
    if (currentQuizIndex + 1 >= QUIZ_QUESTIONS.length) {
      setQuizFinished(true);
      if (score >= 500) {
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.6 }
        });
      }
    } else {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsAnswerSubmitted(false);
    }
  };

  // Restart Quiz
  const handleRestartQuiz = () => {
    setCurrentQuizIndex(0);
    setSelectedOption(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setQuizFinished(false);
    setAnsweredHistory([]);
  };

  const currentQ = QUIZ_QUESTIONS[currentQuizIndex];

  return (
    <div className="space-y-6">
      {/* Top Section Navigation */}
      <div className="flex items-center justify-between bg-white border border-[#E2E8F0] p-1.5 rounded-2xl shadow-xs">
        <div className="flex gap-2">
          <motion.button
            id="tab-edu-quiz"
            onClick={() => setActiveTab('quiz')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'quiz'
                ? 'bg-[#2D6A4F] text-white shadow-xs'
                : 'text-[#52796F] hover:text-[#1B4332] hover:bg-[#F4F7F5]'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            지구 온난화 과학 퀴즈
          </motion.button>
          <motion.button
            id="tab-edu-video"
            onClick={() => setActiveTab('video')}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-colors ${
              activeTab === 'video'
                ? 'bg-[#2D6A4F] text-white shadow-xs'
                : 'text-[#52796F] hover:text-[#1B4332] hover:bg-[#F4F7F5]'
            }`}
          >
            <Video className="w-4 h-4" />
            기후변화 핵심 학습 영상관
          </motion.button>
        </div>

        <span className="hidden sm:inline-block text-xs text-[#52796F] font-medium px-3">
          {activeTab === 'quiz'
            ? '기후변화 메커니즘과 과학적 상식을 검증하세요.'
            : '엄선된 공익 다큐멘터리와 강의 영상을 시청하세요.'}
        </span>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'quiz' ? (
          /* QUIZ TAB */
          !quizFinished ? (
            <motion.div
              key="quiz-active"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 shadow-sm space-y-6"
            >
              {/* Quiz Progress & Stats */}
              <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
                <div className="flex items-center gap-2">
                  <motion.span
                    key={currentQ.category}
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#D8F3DC] text-[#1B4332] border border-[#B7E4C7]"
                  >
                    {currentQ.category}
                  </motion.span>
                  <span className="text-xs text-[#52796F] font-medium">
                    문항 {currentQuizIndex + 1} / {QUIZ_QUESTIONS.length}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <motion.div
                    key={score}
                    initial={{ scale: 1.2, color: '#1B4332' }}
                    animate={{ scale: 1, color: '#2D6A4F' }}
                    className="text-xs font-black"
                  >
                    점수: {score} P
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleRestartQuiz}
                    className="text-xs text-[#52796F] hover:text-[#1B4332] flex items-center gap-1 cursor-pointer font-medium"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    다시풀기
                  </motion.button>
                </div>
              </div>

              {/* Animated Question Text */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQuizIndex}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
                >
                  <h3 className="text-lg sm:text-xl font-black text-[#1B4332] leading-snug">
                    Q{currentQuizIndex + 1}. {currentQ.question}
                  </h3>
                </motion.div>
              </AnimatePresence>

              {/* Options List with Spring Hover & Tap */}
              <div className="space-y-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuizIndex}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.25 }}
                    className="space-y-3"
                  >
                    {currentQ.options.map((option, idx) => {
                      const isSelected = selectedOption === idx;
                      const isCorrectOption = idx === currentQ.correctIndex;

                      let optionStyle =
                        'bg-[#F8FAFC] border-[#E2E8F0] text-[#2C3E50] hover:border-[#2D6A4F] hover:bg-[#F4FBF7]';

                      if (isAnswerSubmitted) {
                        if (isCorrectOption) {
                          optionStyle = 'bg-[#D8F3DC] border-[#2D6A4F] text-[#1B4332] font-bold';
                        } else if (isSelected && !isCorrectOption) {
                          optionStyle = 'bg-rose-50 border-rose-300 text-rose-800 font-bold';
                        } else {
                          optionStyle = 'bg-[#F8FAFC]/60 border-[#E2E8F0] text-[#718096]';
                        }
                      } else if (isSelected) {
                        optionStyle = 'bg-[#D8F3DC] border-[#2D6A4F] text-[#1B4332] font-bold shadow-xs';
                      }

                      return (
                        <motion.button
                          key={idx}
                          id={`quiz-option-${idx}`}
                          onClick={() => handleSelectOption(idx)}
                          disabled={isAnswerSubmitted}
                          whileHover={
                            !isAnswerSubmitted
                              ? {
                                  scale: 1.015,
                                  x: 4,
                                  transition: { type: 'spring', stiffness: 450, damping: 20 }
                                }
                              : {}
                          }
                          whileTap={!isAnswerSubmitted ? { scale: 0.985 } : {}}
                          className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm flex items-center justify-between transition-colors cursor-pointer ${optionStyle}`}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-6 h-6 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-xs font-bold shrink-0 text-[#1B4332]">
                              {idx + 1}
                            </span>
                            <span>{option}</span>
                          </div>

                          {isAnswerSubmitted && isCorrectOption && (
                            <motion.div
                              initial={{ scale: 0.5, rotate: -20 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', stiffness: 500 }}
                            >
                              <CheckCircle2 className="w-5 h-5 text-[#2D6A4F] shrink-0" />
                            </motion.div>
                          )}
                          {isAnswerSubmitted && isSelected && !isCorrectOption && (
                            <motion.div
                              initial={{ scale: 0.5, rotate: 20 }}
                              animate={{ scale: 1, rotate: 0 }}
                              transition={{ type: 'spring', stiffness: 500 }}
                            >
                              <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                            </motion.div>
                          )}
                        </motion.button>
                      );
                    })}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Explanation Section once submitted */}
              <AnimatePresence>
                {isAnswerSubmitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 12, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ type: 'spring', stiffness: 350, damping: 22 }}
                    className={`p-4 rounded-2xl border space-y-2 text-xs shadow-xs ${
                      selectedOption === currentQ.correctIndex
                        ? 'bg-[#D8F3DC] border-[#B7E4C7] text-[#1B4332]'
                        : 'bg-rose-50 border-rose-200 text-rose-900'
                    }`}
                  >
                    <div className="font-black flex items-center gap-2">
                      {selectedOption === currentQ.correctIndex ? (
                        <span className="text-[#1B4332] flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4 text-[#2D6A4F]" />
                          정답입니다! (+100 P)
                        </span>
                      ) : (
                        <span className="text-rose-700 flex items-center gap-1">
                          <XCircle className="w-4 h-4 text-rose-500" />
                          오답입니다. (정답: {currentQ.correctIndex + 1}번{' '}
                          {currentQ.options[currentQ.correctIndex]})
                        </span>
                      )}
                    </div>
                    <p className="text-[#2C3E50] leading-relaxed font-medium">{currentQ.explanation}</p>
                    <div className="pt-1 text-[11px] text-[#2D6A4F] font-bold">
                      과학적 사실: {currentQ.scientificFact}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Action Buttons */}
              <div className="pt-2 flex justify-end">
                {!isAnswerSubmitted ? (
                  <motion.button
                    id="btn-submit-quiz-answer"
                    onClick={handleSubmitAnswer}
                    disabled={selectedOption === null}
                    whileHover={selectedOption !== null ? { scale: 1.03, y: -1 } : {}}
                    whileTap={selectedOption !== null ? { scale: 0.97 } : {}}
                    className="px-7 py-3 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs rounded-xl shadow-md disabled:opacity-40 cursor-pointer"
                  >
                    정답 확인하기
                  </motion.button>
                ) : (
                  <motion.button
                    id="btn-next-quiz"
                    onClick={handleNextQuestion}
                    whileHover={{ scale: 1.03, y: -1 }}
                    whileTap={{ scale: 0.97 }}
                    className="px-7 py-3 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>{currentQuizIndex + 1 >= QUIZ_QUESTIONS.length ? '결과 확인하기' : '다음 문제 풀기'}</span>
                    <ChevronRight className="w-4 h-4" />
                  </motion.button>
                )}
              </div>
            </motion.div>
          ) : (
            /* QUIZ FINISHED RESULTS SCREEN */
            <motion.div
              key="quiz-finished"
              initial={{ opacity: 0, scale: 0.94, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 20 }}
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
                <h3 className="text-2xl font-black text-[#1B4332]">지구 온난화 퀴즈 완주!</h3>
                <p className="text-xs text-[#52796F] font-medium mt-1">
                  지구 환경과 기후 변화에 대한 깊은 과학적 이해를 증명하셨습니다.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 my-6">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]"
                >
                  <div className="text-xs text-[#52796F] font-medium">총 획득 점수</div>
                  <div className="text-2xl font-black text-[#2D6A4F] mt-1">{score} P</div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]"
                >
                  <div className="text-xs text-[#52796F] font-medium">정답 수</div>
                  <div className="text-2xl font-black text-[#1B4332] mt-1">
                    {answeredHistory.filter(h => h.isCorrect).length} / {QUIZ_QUESTIONS.length}
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]"
                >
                  <div className="text-xs text-[#52796F] font-medium">이해도 등급</div>
                  <div className="text-2xl font-black text-[#2D6A4F] mt-1">
                    {score >= 700 ? '기후 전문가' : score >= 500 ? '에코 리더' : '환경 새싹'}
                  </div>
                </motion.div>
              </div>

              <div className="flex justify-center gap-3">
                <motion.button
                  onClick={handleRestartQuiz}
                  whileHover={{ scale: 1.04, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                  className="px-6 py-3 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs rounded-xl shadow-md cursor-pointer"
                >
                  퀴즈 다시 도전하기
                </motion.button>
                <motion.button
                  onClick={() => setActiveTab('video')}
                  whileHover={{ scale: 1.02, y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-6 py-3 bg-[#F8FAFC] hover:bg-[#EBF2EE] text-[#2C3E50] font-bold text-xs rounded-xl border border-[#E2E8F0] cursor-pointer shadow-xs"
                >
                  학습 영상 시청하기
                </motion.button>
              </div>
            </motion.div>
          )
        ) : (
          /* VIDEO HUB TAB */
          <motion.div
            key="video-hub"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6"
          >
            {/* Main Video Player & Summary (Left) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Embedded YouTube Iframe Container with spring frame */}
              <div className="aspect-video w-full rounded-3xl overflow-hidden bg-black border border-[#E2E8F0] shadow-md relative group">
                <iframe
                  key={selectedVideo.youtubeId}
                  src={`https://www.youtube.com/embed/${selectedVideo.youtubeId}?rel=0`}
                  title={selectedVideo.title}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              {/* Direct Open in YouTube Notice & Action */}
              <div className="flex flex-wrap items-center justify-between gap-2 px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-xs text-[#52796F]">
                <div className="flex items-center gap-1.5 font-medium">
                  <Play className="w-3.5 h-3.5 text-[#2D6A4F]" />
                  <span>공익 교육 영상은 위 플레이어에서 즉시 시청하실 수 있습니다.</span>
                </div>
                <motion.a
                  href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-1 font-bold text-[#2D6A4F] hover:text-[#1B4332] hover:underline"
                >
                  <span>YouTube에서 고화질로 시청</span>
                  <ExternalLink className="w-3 h-3" />
                </motion.a>
              </div>

              {/* Video Meta & Summary Details with Smooth Content Animation */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedVideo.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                  className="bg-white border border-[#E2E8F0] rounded-3xl p-6 space-y-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#D8F3DC] text-[#1B4332] border border-[#B7E4C7]">
                      {selectedVideo.category}
                    </span>
                    <span className="text-xs text-[#52796F] font-mono">
                      재생시간: {selectedVideo.duration}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-lg font-black text-[#1B4332]">{selectedVideo.title}</h3>
                    <p className="text-xs text-[#52796F] font-medium mt-0.5">
                      출처 / 제작: {selectedVideo.channel}
                    </p>
                  </div>

                  <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0] space-y-2">
                    <h4 className="text-xs font-black text-[#2D6A4F] flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      핵심 영상 요약 & 분석
                    </h4>
                    <p className="text-xs text-[#2C3E50] leading-relaxed font-medium">
                      {selectedVideo.summary}
                    </p>
                  </div>

                  {/* Key Points Checklist */}
                  <div>
                    <h4 className="text-xs font-bold text-[#1B4332] mb-2">학습 체크포인트:</h4>
                    <ul className="space-y-1.5">
                      {selectedVideo.keyPoints.map((point, idx) => (
                        <li key={idx} className="text-xs text-[#2C3E50] flex items-start gap-2 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2D6A4F] shrink-0 mt-0.5" />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Presenter takeaway note */}
                  <div className="p-3.5 bg-[#D8F3DC] border border-[#B7E4C7] rounded-2xl text-xs">
                    <span className="font-bold text-[#1B4332]">발표용 핵심 전달 포인트:</span>
                    <p className="text-[#1B4332] mt-1 font-medium">{selectedVideo.presenterTakeaway}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Video Playlist Sidebar (Right) */}
            <div className="lg:col-span-4 space-y-3">
              <h3 className="text-xs font-bold text-[#52796F] uppercase tracking-wider px-1">
                추천 기후환경 강의 영상 ({LEARNING_VIDEOS.length})
              </h3>

              <div className="space-y-2.5">
                {LEARNING_VIDEOS.map(video => (
                  <motion.button
                    key={video.id}
                    onClick={() => setSelectedVideo(video)}
                    whileHover={{
                      scale: 1.02,
                      y: -2,
                      transition: { type: 'spring', stiffness: 400, damping: 18 }
                    }}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left p-3.5 rounded-2xl border transition-colors flex items-start gap-3 cursor-pointer ${
                      selectedVideo.id === video.id
                        ? 'bg-white border-2 border-[#2D6A4F] text-[#1B4332] shadow-sm'
                        : 'bg-white border border-[#E2E8F0] text-[#52796F] hover:text-[#1B4332] hover:bg-[#F8FAFC]'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-[#D8F3DC] border border-[#B7E4C7] flex items-center justify-center text-[#2D6A4F] shrink-0">
                      <Play className="w-4 h-4 fill-[#2D6A4F]/40" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold line-clamp-2 leading-snug">
                        {video.title}
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-[#718096] mt-1.5">
                        <span className="truncate font-medium">{video.channel}</span>
                        <span className="font-mono text-[#2D6A4F] font-bold shrink-0 ml-2">
                          {video.duration}
                        </span>
                      </div>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
