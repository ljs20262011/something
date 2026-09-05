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
          <button
            id="tab-edu-quiz"
            onClick={() => setActiveTab('quiz')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'quiz'
                ? 'bg-[#2D6A4F] text-white shadow-xs'
                : 'text-[#52796F] hover:text-[#1B4332] hover:bg-[#F4F7F5]'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            지구 온난화 과학 퀴즈
          </button>
          <button
            id="tab-edu-video"
            onClick={() => setActiveTab('video')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'video'
                ? 'bg-[#2D6A4F] text-white shadow-xs'
                : 'text-[#52796F] hover:text-[#1B4332] hover:bg-[#F4F7F5]'
            }`}
          >
            <Video className="w-4 h-4" />
            기후변화 핵심 학습 영상관
          </button>
        </div>

        <span className="hidden sm:inline-block text-xs text-[#52796F] font-medium px-3">
          {activeTab === 'quiz' ? '기후변화 메커니즘과 과학적 상식을 검증하세요.' : '엄선된 공익 다큐멘터리와 강의 영상을 시청하세요.'}
        </span>
      </div>

      {activeTab === 'quiz' ? (
        /* QUIZ TAB */
        !quizFinished ? (
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm space-y-6">
            {/* Quiz Progress & Stats */}
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4">
              <div>
                <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-[#D8F3DC] text-[#1B4332] border border-[#B7E4C7]">
                  {currentQ.category}
                </span>
                <span className="text-xs text-[#52796F] font-medium ml-2">
                  문항 {currentQuizIndex + 1} / {QUIZ_QUESTIONS.length}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <div className="text-xs font-black text-[#2D6A4F]">
                  점수: {score} P
                </div>
                <button
                  onClick={handleRestartQuiz}
                  className="text-xs text-[#52796F] hover:text-[#1B4332] flex items-center gap-1 cursor-pointer font-medium"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  다시풀기
                </button>
              </div>
            </div>

            {/* Question Text */}
            <div>
              <h3 className="text-lg sm:text-xl font-black text-[#1B4332] leading-snug">
                Q{currentQuizIndex + 1}. {currentQ.question}
              </h3>
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrectOption = idx === currentQ.correctIndex;

                let optionStyle = 'bg-[#F8FAFC] border-[#E2E8F0] text-[#2C3E50] hover:border-[#2D6A4F]';

                if (isAnswerSubmitted) {
                  if (isCorrectOption) {
                    optionStyle = 'bg-[#D8F3DC] border-[#2D6A4F] text-[#1B4332] font-bold';
                  } else if (isSelected && !isCorrectOption) {
                    optionStyle = 'bg-rose-50 border-rose-300 text-rose-800 font-bold';
                  } else {
                    optionStyle = 'bg-[#F8FAFC]/60 border-[#E2E8F0] text-[#718096]';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-[#D8F3DC] border-[#2D6A4F] text-[#1B4332] font-bold';
                }

                return (
                  <button
                    key={idx}
                    id={`quiz-option-${idx}`}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswerSubmitted}
                    className={`w-full p-4 rounded-2xl border text-left text-xs sm:text-sm flex items-center justify-between transition-all cursor-pointer ${optionStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-white border border-[#E2E8F0] flex items-center justify-center text-xs font-bold shrink-0 text-[#1B4332]">
                        {idx + 1}
                      </span>
                      <span>{option}</span>
                    </div>

                    {isAnswerSubmitted && isCorrectOption && (
                      <CheckCircle2 className="w-5 h-5 text-[#2D6A4F] shrink-0" />
                    )}
                    {isAnswerSubmitted && isSelected && !isCorrectOption && (
                      <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation Section once submitted */}
            <AnimatePresence>
              {isAnswerSubmitted && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-2xl border space-y-2 text-xs ${
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
                        오답입니다. (정답: {currentQ.correctIndex + 1}번 {currentQ.options[currentQ.correctIndex]})
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
                <button
                  id="btn-submit-quiz-answer"
                  onClick={handleSubmitAnswer}
                  disabled={selectedOption === null}
                  className="px-6 py-2.5 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs rounded-xl transition-all shadow-sm disabled:opacity-40 cursor-pointer"
                >
                  정답 확인하기
                </button>
              ) : (
                <button
                  id="btn-next-quiz"
                  onClick={handleNextQuestion}
                  className="px-6 py-2.5 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                >
                  {currentQuizIndex + 1 >= QUIZ_QUESTIONS.length ? '결과 확인하기' : '다음 문제 풀기'}
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* QUIZ FINISHED RESULTS SCREEN */
          <div className="bg-white border border-[#E2E8F0] rounded-3xl p-8 text-center max-w-2xl mx-auto shadow-xl">
            <div className="w-16 h-16 bg-[#D8F3DC] border border-[#B7E4C7] text-[#2D6A4F] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Award className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-[#1B4332]">지구 온난화 퀴즈 완주!</h3>
            <p className="text-xs text-[#52796F] font-medium mt-1">
              지구 환경과 기후 변화에 대한 깊은 이해를 증명하셨습니다.
            </p>

            <div className="grid grid-cols-3 gap-3 my-6">
              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
                <div className="text-xs text-[#52796F] font-medium">총 획득 점수</div>
                <div className="text-2xl font-black text-[#2D6A4F] mt-1">{score} P</div>
              </div>
              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
                <div className="text-xs text-[#52796F] font-medium">정답 수</div>
                <div className="text-2xl font-black text-[#1B4332] mt-1">
                  {answeredHistory.filter(h => h.isCorrect).length} / {QUIZ_QUESTIONS.length}
                </div>
              </div>
              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0]">
                <div className="text-xs text-[#52796F] font-medium">이해도 등급</div>
                <div className="text-2xl font-black text-[#2D6A4F] mt-1">
                  {score >= 700 ? '기후 전문가' : score >= 500 ? '에코 리더' : '환경 새싹'}
                </div>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <button
                onClick={handleRestartQuiz}
                className="px-6 py-2.5 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs rounded-xl transition-all shadow-md cursor-pointer"
              >
                퀴즈 다시 도전하기
              </button>
              <button
                onClick={() => setActiveTab('video')}
                className="px-6 py-2.5 bg-[#F8FAFC] hover:bg-[#EBF2EE] text-[#2C3E50] font-bold text-xs rounded-xl transition-all border border-[#E2E8F0] cursor-pointer"
              >
                학습 영상 시청하기
              </button>
            </div>
          </div>
        )
      ) : (
        /* VIDEO HUB TAB */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Video Player & Summary (Left) */}
          <div className="lg:col-span-8 space-y-4">
            {/* Embedded YouTube Iframe Container */}
            <div className="aspect-video w-full rounded-3xl overflow-hidden bg-black border border-[#E2E8F0] shadow-xl relative group">
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
            <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-xs text-[#52796F]">
              <div className="flex items-center gap-1.5 font-medium">
                <Play className="w-3.5 h-3.5 text-[#2D6A4F]" />
                <span>공익 교육 영상은 위 플레이어에서 즉시 시청하실 수 있습니다.</span>
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${selectedVideo.youtubeId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 font-bold text-[#2D6A4F] hover:text-[#1B4332] hover:underline"
              >
                <span>YouTube에서 고화질로 시청</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Video Meta & Summary Details */}
            <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 space-y-4 shadow-sm">
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
                <p className="text-xs text-[#52796F] font-medium mt-0.5">출처 / 제작: {selectedVideo.channel}</p>
              </div>

              <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0] space-y-2">
                <h4 className="text-xs font-black text-[#2D6A4F] flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5" />
                  핵심 영상 요약 & 분석
                </h4>
                <p className="text-xs text-[#2C3E50] leading-relaxed font-medium">{selectedVideo.summary}</p>
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
            </div>
          </div>

          {/* Video Playlist Sidebar (Right) */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-xs font-bold text-[#52796F] uppercase tracking-wider px-1">
              추천 기후환경 강의 영상 ({LEARNING_VIDEOS.length})
            </h3>

            <div className="space-y-2.5">
              {LEARNING_VIDEOS.map(video => (
                <button
                  key={video.id}
                  onClick={() => setSelectedVideo(video)}
                  className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-start gap-3 cursor-pointer ${
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
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
