import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  Image as ImageIcon,
  Heart,
  Share2,
  Download,
  Filter,
  Layers,
  Palette,
  Eye,
  CheckCircle2,
  Plus,
  Send
} from 'lucide-react';
import { PosterItem } from '../types';
import { PosterGraphics } from './PosterGraphics';
import {
  getLocalPosters,
  saveLocalPosters,
  generateClientPosterSpec
} from '../services/ecoClientService';

interface PosterStudioProps {
  onEarnExp: (exp: number, points: number) => void;
}

export const PosterStudio: React.FC<PosterStudioProps> = ({ onEarnExp }) => {
  const [activeSubTab, setActiveSubTab] = useState<'create' | 'gallery'>('create');
  const [posters, setPosters] = useState<PosterItem[]>(() => getLocalPosters());
  const [isLoadingPosters, setIsLoadingPosters] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState<string>('all');
  const [selectedPosterForModal, setSelectedPosterForModal] = useState<PosterItem | null>(null);

  // Poster Creation Form State
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState<'climate' | 'plastic' | 'ocean' | 'forest' | 'energy'>('climate');
  const [targetAudience, setTargetAudience] = useState('전 국민');
  const [visualMood, setVisualMood] = useState('강렬하고 직관적인 경고');

  // Currently Drafted Poster
  const [currentDraft, setCurrentDraft] = useState<PosterItem>({
    id: 'draft-poster',
    title: '1.5°C 골든타임의 경고',
    slogan: '지구의 체온 1.5°C,\n우리의 마지막 마지노선',
    subtitle: '평균 기온 1.5도 상승 시 폭염 빈도 8.6배 증가. 침묵은 해결책이 아닙니다.',
    author: '환경 실천가',
    category: 'climate',
    createdAt: new Date().toISOString().split('T')[0],
    likes: 0,
    layout: 'bold-center',
    palette: {
      bg: '#0B192C',
      primary: '#EF4444',
      secondary: '#1E3E62',
      accent: '#F59E0B',
      text: '#FFFFFF'
    },
    graphicType: 'earth-melting',
    callToAction: '2030 온실가스 40% 감축 실천하기',
    factTag: 'IPCC 제6차 기후변화 평가보고서 기준'
  });

  const [authorName, setAuthorName] = useState('시민 에코 크리에이터');
  const [publishSuccess, setPublishSuccess] = useState(false);
  const posterCanvasRef = useRef<HTMLDivElement>(null);

  // Fetch Community Posters
  const fetchPosters = async () => {
    setIsLoadingPosters(true);
    try {
      const res = await fetch('/api/posters');
      if (res.ok) {
        const data = await res.json();
        if (data.posters && Array.isArray(data.posters)) {
          setPosters(data.posters);
          saveLocalPosters(data.posters);
          return;
        }
      }
    } catch (err) {
      console.warn('Backend posters not reachable, using local storage cache.');
    } finally {
      setIsLoadingPosters(false);
    }
    // Fallback to local storage
    const cached = getLocalPosters();
    setPosters(cached);
  };

  useEffect(() => {
    fetchPosters();
  }, []);

  // Quick Preset Topics
  const topicPresets = [
    { label: '1.5도 기후 마지노선', topic: '지구 기온 1.5도 방어선 사수와 폭염 위기', cat: 'climate' as const, mood: '강렬하고 위기감 있는 경고' },
    { label: '플라스틱 프리 바다', topic: '바다로 흘러가는 미세플라스틱과 해양생물 구하기', cat: 'ocean' as const, mood: '희망차면서도 심각한 호소' },
    { label: '순환 경제 분리배출', topic: '버리면 쓰레기 모으면 자원, 4단계 올바른 배출', cat: 'plastic' as const, mood: '명확하고 실천적인 안내' },
    { label: '도시 숲과 탄소흡수원', topic: '나무 심기와 아마존 열대우림 보호, 지구의 허파', cat: 'forest' as const, mood: '생명력 넘치고 평화로운 분위기' }
  ];

  // AI Generation Handler
  const handleGenerateAiPoster = async () => {
    setIsGenerating(true);
    setPublishSuccess(false);

    try {
      let spec: any = null;

      try {
        const res = await fetch('/api/gemini/poster-ai', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: topic || '기후위기 극복과 탄소중립',
            category,
            targetAudience,
            visualMood
          })
        });

        if (res.ok) {
          const data = await res.json();
          if (data.spec) {
            spec = data.spec;
          }
        }
      } catch {
        // Fallback below
      }

      if (!spec) {
        spec = generateClientPosterSpec(topic, category, visualMood);
      }

      setCurrentDraft({
        id: `draft-${Date.now()}`,
        title: spec.title || '기후 행동 포스터',
        slogan: spec.slogan || '지구를 위한 오늘의 실천',
        subtitle: spec.subtitle || '작은 변화가 지구의 내일을 바꿉니다.',
        author: authorName,
        category: category,
        createdAt: new Date().toISOString().split('T')[0],
        likes: 0,
        layout: spec.layout || 'bold-center',
        palette: spec.palette || {
          bg: '#0F172A',
          primary: '#10B981',
          secondary: '#1E293B',
          accent: '#38BDF8',
          text: '#FFFFFF'
        },
        graphicType: spec.graphicType || 'earth-melting',
        callToAction: spec.callToAction || '함께 행동해요',
        factTag: spec.factTag || '탄소중립 실천 가이드'
      });

      onEarnExp(30, 80);
    } catch (err) {
      console.error('AI Poster generation error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Publish Draft to Community Exhibition
  const handlePublishPoster = async () => {
    if (!currentDraft.title || !currentDraft.slogan) return;

    const newPoster: PosterItem = {
      ...currentDraft,
      id: `poster-${Date.now()}`,
      author: authorName || '시민 에코 크리에이터',
      createdAt: new Date().toISOString().split('T')[0],
      likes: 1
    };

    try {
      try {
        await fetch('/api/posters', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newPoster)
        });
      } catch {
        // Static hosting graceful continuation
      }

      setPosters(prev => {
        const updated = [newPoster, ...prev];
        saveLocalPosters(updated);
        return updated;
      });

      setPublishSuccess(true);
      onEarnExp(50, 150);
      setTimeout(() => {
        setActiveSubTab('gallery');
        setPublishSuccess(false);
      }, 1200);
    } catch (err) {
      console.error('Publish error:', err);
    }
  };

  // Like Poster
  const handleLikePoster = async (posterId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    try {
      try {
        await fetch(`/api/posters/${posterId}/like`, { method: 'POST' });
      } catch {
        // Static hosting graceful continuation
      }

      setPosters(prev => {
        const updated = prev.map(p =>
          p.id === posterId ? { ...p, likes: p.likes + 1 } : p
        );
        saveLocalPosters(updated);
        return updated;
      });

      if (selectedPosterForModal && selectedPosterForModal.id === posterId) {
        setSelectedPosterForModal(prev =>
          prev ? { ...prev, likes: prev.likes + 1 } : null
        );
      }
      onEarnExp(5, 10);
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  // Filter Posters
  const filteredPosters = posters.filter(p => {
    if (selectedCategoryFilter === 'all') return true;
    return p.category === selectedCategoryFilter;
  });

  return (
    <div className="space-y-6">
      {/* Top Navigation Mode Tabs */}
      <div className="flex items-center justify-between bg-white border border-[#E2E8F0] p-1.5 rounded-2xl shadow-xs">
        <div className="flex gap-2">
          <button
            id="tab-poster-create"
            onClick={() => setActiveSubTab('create')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'create'
                ? 'bg-[#2D6A4F] text-white shadow-xs'
                : 'text-[#52796F] hover:text-[#1B4332] hover:bg-[#F4F7F5]'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            AI 환경 포스터 제작 스튜디오
          </button>
          <button
            id="tab-poster-gallery"
            onClick={() => setActiveSubTab('gallery')}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              activeSubTab === 'gallery'
                ? 'bg-[#2D6A4F] text-white shadow-xs'
                : 'text-[#52796F] hover:text-[#1B4332] hover:bg-[#F4F7F5]'
            }`}
          >
            <ImageIcon className="w-4 h-4" />
            시민 환경 포스터 전시관 ({posters.length})
          </button>
        </div>

        <span className="hidden sm:inline-block text-xs text-[#52796F] font-medium px-3">
          {activeSubTab === 'create' ? '원하는 테마를 입력하면 AI가 슬로건과 비주얼을 기획합니다.' : '다른 사람들이 제작한 환경 포스터를 감상하고 공감하세요.'}
        </span>
      </div>

      {activeSubTab === 'create' ? (
        /* CREATE POSTER VIEW */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Controls & Prompt Form (Left) */}
          <div className="lg:col-span-6 space-y-5 bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm">
            <div>
              <h3 className="text-lg font-black text-[#1B4332] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-[#2D6A4F]" />
                AI 포스터 콘셉트 기획
              </h3>
              <p className="text-xs text-[#52796F] mt-1 font-medium">
                주제와 대상, 분위기를 설정하면 AI가 설득력 있는 문구와 그래픽 구성을 제안합니다.
              </p>
            </div>

            {/* Quick Topic Chips */}
            <div>
              <label className="block text-xs font-bold text-[#1B4332] mb-2">
                추천 공익 캠페인 프리셋
              </label>
              <div className="flex flex-wrap gap-2">
                {topicPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setTopic(preset.topic);
                      setCategory(preset.cat);
                      setVisualMood(preset.mood);
                    }}
                    className="text-xs px-3 py-1.5 rounded-xl bg-[#F8FAFC] hover:bg-[#EBF2EE] border border-[#E2E8F0] text-[#2C3E50] hover:text-[#1B4332] font-medium transition-all text-left"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Topic Input */}
            <div>
              <label className="block text-xs font-bold text-[#1B4332] mb-1.5">
                포스터 전달 메시지 / 핵심 주제
              </label>
              <input
                type="text"
                value={topic}
                onChange={e => setTopic(e.target.value)}
                placeholder="예: 북극 빙하 감소와 해수면 상승의 위험성 경고"
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2.5 text-xs text-[#2C3E50] placeholder-[#718096] focus:outline-none focus:border-[#2D6A4F] transition-all"
              />
            </div>

            {/* Category & Mood Selectors */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#1B4332] mb-1.5">
                  환경 분야 카테고리
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-xs text-[#2C3E50] focus:outline-none focus:border-[#2D6A4F]"
                >
                  <option value="climate">기후위기 / 온난화</option>
                  <option value="plastic">자원순환 / 플라스틱</option>
                  <option value="ocean">해양 생태계 보존</option>
                  <option value="forest">산림보호 / 생물다양성</option>
                  <option value="energy">신재생 에너지 전환</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#1B4332] mb-1.5">
                  타깃 대중
                </label>
                <select
                  value={targetAudience}
                  onChange={e => setTargetAudience(e.target.value)}
                  className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-3 py-2.5 text-xs text-[#2C3E50] focus:outline-none focus:border-[#2D6A4F]"
                >
                  <option value="전 국민">전 국민</option>
                  <option value="청소년 및 학생">청소년 및 학생</option>
                  <option value="직장인 및 기업">직장인 및 기업</option>
                  <option value="지역 주민">지역 주민</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1B4332] mb-1.5">
                제작자 이름 (발표자 또는 단체명)
              </label>
              <input
                type="text"
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                placeholder="예: 기후행동 발표팀"
                className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl px-4 py-2 text-xs text-[#2C3E50] focus:outline-none focus:border-[#2D6A4F]"
              />
            </div>

            {/* Generate Action Button */}
            <button
              id="btn-generate-ai-poster"
              onClick={handleGenerateAiPoster}
              disabled={isGenerating}
              className="w-full py-3 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-black text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              {isGenerating ? 'AI가 포스터를 기획하고 있습니다...' : 'AI 환경 포스터 자동 기획 & 생성'}
            </button>

            {/* Surgical Quick Customizers for Live Presentation */}
            <div className="pt-4 border-t border-[#E2E8F0] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#1B4332] flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#2D6A4F]" />
                  비주얼 그래픽 & 레이아웃 커스텀
                </span>
                <span className="text-[11px] text-[#52796F] font-medium">즉시 반영</span>
              </div>

              {/* Graphic Theme selector */}
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'earth-melting', label: '1.5°C 지구' },
                  { id: 'clean-ocean', label: '푸른 바다' },
                  { id: 'sprout-hands', label: '희망 새싹' },
                  { id: 'wind-solar', label: '청정 에너지' },
                  { id: 'recycling-loop', label: '순환 루프' },
                  { id: 'polar-bear', label: '북극곰 빙하' }
                ].map(g => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setCurrentDraft(prev => ({ ...prev, graphicType: g.id as any }))}
                    className={`text-[11px] font-bold py-1.5 px-2 rounded-xl border text-center transition-all ${
                      currentDraft.graphicType === g.id
                        ? 'bg-[#D8F3DC] text-[#1B4332] border-[#B7E4C7]'
                        : 'bg-[#F8FAFC] text-[#52796F] border-[#E2E8F0] hover:text-[#1B4332]'
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>

              {/* Layout Switcher */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {[
                  { id: 'bold-center', label: '볼드 임팩트' },
                  { id: 'split-dynamic', label: '다이내믹 분할' },
                  { id: 'minimal-editorial', label: '에디토리얼' },
                  { id: 'impact-badge', label: '배지 액션' }
                ].map(l => (
                  <button
                    key={l.id}
                    type="button"
                    onClick={() => setCurrentDraft(prev => ({ ...prev, layout: l.id as any }))}
                    className={`text-[11px] font-bold py-1.5 px-2 rounded-xl border text-center transition-all ${
                      currentDraft.layout === l.id
                        ? 'bg-[#D8F3DC] text-[#1B4332] border-[#B7E4C7]'
                        : 'bg-[#F8FAFC] text-[#52796F] border-[#E2E8F0] hover:text-[#1B4332]'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Real-time Live Poster Canvas Preview (Right) */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="w-full flex items-center justify-between mb-3 px-1">
              <span className="text-xs font-bold text-[#1B4332] flex items-center gap-1.5">
                <Eye className="w-4 h-4 text-[#2D6A4F]" />
                실시간 포스터 완성본 미리보기
              </span>
              <span className="text-[11px] text-[#52796F] font-mono">
                규격: A3 비율 (공익 포스터 표준)
              </span>
            </div>

            {/* Poster Render Frame */}
            <div
              ref={posterCanvasRef}
              id="live-poster-artboard"
              style={{
                backgroundColor: currentDraft.palette.bg,
                color: currentDraft.palette.text
              }}
              className="w-full max-w-[420px] aspect-[1/1.414] rounded-3xl border-4 border-[#2C3E50]/20 shadow-xl p-7 flex flex-col justify-between relative overflow-hidden transition-all"
            >
              {/* Top Header & Category Tag */}
              <div className="relative z-10">
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <div className="flex items-center gap-1.5">
                    <div
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: currentDraft.palette.accent }}
                    />
                    <span className="text-[10px] font-black tracking-widest uppercase opacity-80">
                      ECOSPHERE GLOBAL CAMPAIGN
                    </span>
                  </div>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md"
                    style={{
                      backgroundColor: `${currentDraft.palette.primary}33`,
                      color: currentDraft.palette.accent,
                      border: `1px solid ${currentDraft.palette.primary}66`
                    }}
                  >
                    {currentDraft.category.toUpperCase()}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="text-[11px] font-bold opacity-75 mb-1">{currentDraft.title}</div>
                  <h2
                    className="text-xl sm:text-2xl font-black leading-tight tracking-tight whitespace-pre-line"
                    style={{ color: currentDraft.palette.text }}
                  >
                    {currentDraft.slogan}
                  </h2>
                </div>
              </div>

              {/* Center Vector Graphics Canvas */}
              <div className="my-auto py-2 flex items-center justify-center relative z-10 max-h-[190px]">
                <PosterGraphics
                  type={currentDraft.graphicType}
                  primaryColor={currentDraft.palette.primary}
                  secondaryColor={currentDraft.palette.secondary}
                  accentColor={currentDraft.palette.accent}
                  className="w-48 h-48 drop-shadow-xl"
                />
              </div>

              {/* Bottom Body Text & Call to Action */}
              <div className="relative z-10 space-y-3 pt-3 border-t border-white/10">
                <p className="text-[11px] leading-relaxed opacity-90">
                  {currentDraft.subtitle}
                </p>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <div
                    className="text-[10px] font-bold px-3 py-1.5 rounded-lg flex-1 truncate"
                    style={{
                      backgroundColor: currentDraft.palette.primary,
                      color: '#0F172A'
                    }}
                  >
                    {currentDraft.callToAction}
                  </div>
                  <div className="text-[9px] opacity-70 font-mono text-right shrink-0">
                    {currentDraft.author}
                  </div>
                </div>

                <div className="text-[9px] text-center opacity-50 tracking-wider">
                  {currentDraft.factTag}
                </div>
              </div>
            </div>

            {/* Poster Publication and Download Bar */}
            <div className="w-full max-w-[420px] flex gap-3 mt-4">
              <button
                id="btn-publish-poster"
                onClick={handlePublishPoster}
                className="flex-1 py-3 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                시민 전시관에 등록하기
              </button>
            </div>

            {publishSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-3 text-xs font-bold text-[#1B4332] bg-[#D8F3DC] border border-[#B7E4C7] px-4 py-2 rounded-xl flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-[#2D6A4F]" />
                성공적으로 전시관에 등록되었습니다! 갤러리로 이동합니다.
              </motion.div>
            )}
          </div>
        </div>
      ) : (
        /* EXHIBITION GALLERY VIEW */
        <div className="space-y-5">
          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-[#E2E8F0] p-4 rounded-3xl shadow-sm">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#2D6A4F]" />
              <span className="text-xs font-bold text-[#1B4332]">분야별 전시 필터:</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', label: '전체 보기' },
                  { id: 'climate', label: '기후위기 1.5°C' },
                  { id: 'ocean', label: '해양보호' },
                  { id: 'plastic', label: '자원순환' },
                  { id: 'forest', label: '산림·생태' }
                ].map(filter => (
                  <button
                    key={filter.id}
                    onClick={() => setSelectedCategoryFilter(filter.id)}
                    className={`text-xs px-3 py-1.5 rounded-xl font-bold transition-all ${
                      selectedCategoryFilter === filter.id
                        ? 'bg-[#2D6A4F] text-white shadow-xs'
                        : 'bg-[#F8FAFC] text-[#52796F] hover:bg-[#EBF2EE] border border-[#E2E8F0]'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={() => setActiveSubTab('create')}
              className="flex items-center gap-1.5 text-xs font-bold bg-[#2D6A4F] hover:bg-[#1B4332] text-white px-4 py-2 rounded-xl transition-all shadow-xs cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              나도 포스터 만들기
            </button>
          </div>

          {/* Exhibition Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredPosters.map(poster => (
              <motion.div
                key={poster.id}
                layout
                whileHover={{ y: -4 }}
                onClick={() => setSelectedPosterForModal(poster)}
                className="bg-white border border-[#E2E8F0] rounded-3xl overflow-hidden shadow-sm hover:shadow-md cursor-pointer flex flex-col justify-between group transition-all"
              >
                {/* Visual Thumbnail Artboard */}
                <div
                  style={{ backgroundColor: poster.palette.bg }}
                  className="aspect-[1/1.2] p-4 flex flex-col justify-between relative overflow-hidden"
                >
                  <div className="flex items-center justify-between text-[9px] font-bold text-white/80">
                    <span className="uppercase tracking-wider px-1.5 py-0.5 rounded bg-black/40">
                      {poster.category}
                    </span>
                    <span className="opacity-70">{poster.createdAt}</span>
                  </div>

                  <div className="flex items-center justify-center my-auto">
                    <PosterGraphics
                      type={poster.graphicType}
                      primaryColor={poster.palette.primary}
                      secondaryColor={poster.palette.secondary}
                      accentColor={poster.palette.accent}
                      className="w-28 h-28 drop-shadow-md"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="text-[10px] font-bold opacity-80 truncate text-white">
                      {poster.title}
                    </div>
                    <div className="text-xs font-black line-clamp-2 leading-tight text-white whitespace-pre-line">
                      {poster.slogan}
                    </div>
                  </div>
                </div>

                {/* Card Footer Bar */}
                <div className="p-3.5 bg-white border-t border-[#E2E8F0] flex items-center justify-between text-xs">
                  <div className="truncate text-[#52796F] font-medium">
                    작성자: <span className="text-[#1B4332] font-bold">{poster.author}</span>
                  </div>

                  <button
                    onClick={e => handleLikePoster(poster.id, e)}
                    className="flex items-center gap-1 text-[#52796F] hover:text-rose-600 transition-colors p-1"
                  >
                    <Heart className="w-4 h-4 fill-rose-500/20 text-rose-500 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-xs">{poster.likes}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Poster Inspection Detail Modal */}
      {selectedPosterForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border border-[#E2E8F0] rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl p-6 relative">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#E2E8F0]">
              <h3 className="font-black text-[#1B4332] text-base flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-[#2D6A4F]" />
                환경 포스터 상세 전시
              </h3>
              <button
                onClick={() => setSelectedPosterForModal(null)}
                className="text-[#52796F] hover:text-[#1B4332] text-sm font-bold px-2 py-1 cursor-pointer"
              >
                닫기
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Full Art Preview */}
              <div className="md:col-span-6 flex justify-center">
                <div
                  style={{
                    backgroundColor: selectedPosterForModal.palette.bg,
                    color: selectedPosterForModal.palette.text
                  }}
                  className="w-full max-w-[340px] aspect-[1/1.414] rounded-3xl border-4 border-[#2C3E50]/20 shadow-xl p-6 flex flex-col justify-between"
                >
                  <div className="text-[10px] font-bold tracking-widest opacity-80 uppercase border-b border-white/10 pb-2">
                    {selectedPosterForModal.category} CAMPAIGN
                  </div>

                  <div className="my-2">
                    <h2 className="text-xl font-black leading-tight whitespace-pre-line">
                      {selectedPosterForModal.slogan}
                    </h2>
                  </div>

                  <div className="my-auto py-2 flex items-center justify-center">
                    <PosterGraphics
                      type={selectedPosterForModal.graphicType}
                      primaryColor={selectedPosterForModal.palette.primary}
                      secondaryColor={selectedPosterForModal.palette.secondary}
                      accentColor={selectedPosterForModal.palette.accent}
                      className="w-36 h-36"
                    />
                  </div>

                  <div className="space-y-2 pt-2 border-t border-white/10">
                    <p className="text-[10px] opacity-90 leading-relaxed">
                      {selectedPosterForModal.subtitle}
                    </p>
                    <div
                      className="text-[10px] font-bold px-2.5 py-1 rounded text-center"
                      style={{
                        backgroundColor: selectedPosterForModal.palette.primary,
                        color: '#0F172A'
                      }}
                    >
                      {selectedPosterForModal.callToAction}
                    </div>
                  </div>
                </div>
              </div>

              {/* Meta information and details */}
              <div className="md:col-span-6 space-y-4 text-xs">
                <div>
                  <span className="text-[11px] font-bold text-[#2D6A4F]">캠페인 타이틀</span>
                  <h4 className="text-lg font-black text-[#1B4332] mt-0.5">{selectedPosterForModal.title}</h4>
                </div>

                <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0] space-y-1.5">
                  <div className="text-[#52796F] font-medium">슬로건 메시지</div>
                  <div className="text-sm font-bold text-[#1B4332] whitespace-pre-line">
                    "{selectedPosterForModal.slogan}"
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[#52796F] font-medium">환경 실천 행동 지침</div>
                  <p className="text-[#2C3E50] bg-[#F8FAFC] p-3 rounded-2xl border border-[#E2E8F0] leading-relaxed font-medium">
                    {selectedPosterForModal.subtitle}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E2E8F0]">
                    <div className="text-[#52796F] font-medium">기획 제작자</div>
                    <div className="font-bold text-[#1B4332]">{selectedPosterForModal.author}</div>
                  </div>
                  <div className="bg-[#F8FAFC] p-2.5 rounded-xl border border-[#E2E8F0]">
                    <div className="text-[#52796F] font-medium">전시 등록일</div>
                    <div className="font-bold text-[#1B4332]">{selectedPosterForModal.createdAt}</div>
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <button
                    onClick={() => handleLikePoster(selectedPosterForModal.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-xl border border-rose-200 transition-all cursor-pointer"
                  >
                    <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                    이 포스터 공감하기 ({selectedPosterForModal.likes})
                  </button>

                  <button
                    onClick={() => setSelectedPosterForModal(null)}
                    className="px-4 py-2 bg-[#F8FAFC] hover:bg-[#EBF2EE] text-[#2C3E50] border border-[#E2E8F0] font-bold rounded-xl cursor-pointer"
                  >
                    전시관으로 돌아가기
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
