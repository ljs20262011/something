import React from 'react';
import {
  Sparkles,
  Presentation,
  CheckCircle2,
  Gamepad2,
  Image as ImageIcon,
  MessageSquare,
  BookOpen,
  Award,
  Zap,
  ArrowRight,
  ShieldCheck,
  Globe
} from 'lucide-react';
import { TabType } from '../types';

interface PresentationGuideProps {
  onNavigateTab: (tab: TabType) => void;
  onInstantLevelUp: () => void;
  currentLevel: number;
}

export const PresentationGuide: React.FC<PresentationGuideProps> = ({
  onNavigateTab,
  onInstantLevelUp,
  currentLevel
}) => {
  const presentationModules = [
    {
      tab: 'game' as TabType,
      icon: Gamepad2,
      title: '1. 분리배출 인터랙티브 게임',
      objective: '일상에서 혼동하기 쉬운 오염된 피자 박스, 젤 아이스팩, 컵라면 등의 분리배출 정답률 제고',
      demoPoints: [
        '8가지 규격 분리수거함(플라스틱, 캔, 종이, 비닐, 유리, 음식물, 일반, 폐건전지) 직관적 배치',
        '선택 즉시 Web Audio 음향 피드백과 함께 환경부 기준의 구체적 이유 및 오답 방지 팁 제공',
        '콤보 연속 정답 시스템 및 보너스 포인트가 에코 캐릭터의 성장 경험치로 직결'
      ]
    },
    {
      tab: 'poster' as TabType,
      icon: ImageIcon,
      title: '2. AI 환경 포스터 제작 & 시민 전시관',
      objective: 'AI를 활용한 강력한 공익 슬로건 생성 및 모두가 함께 관람·공감하는 아카이브 구축',
      demoPoints: [
        '주제(1.5도 방어선, 플라스틱 프리, 해양보호 등) 선택 시 Gemini AI가 슬로건과 색상 팔레트 자동 기획',
        'A3 비율 규격의 실시간 벡터 그래픽 렌더링 및 레이아웃 커스텀 지원',
        '서버 API(/api/posters)를 통해 등록되어 다른 모든 사용자에게 실시간 전시 및 공감(좋아요) 수집'
      ]
    },
    {
      tab: 'chat' as TabType,
      icon: MessageSquare,
      title: '3. AI 환경·기후변화 실시간 대화',
      objective: 'IPCC 보고서 및 탄소중립 실천 데이터를 기반으로 한 신뢰도 높은 질의응답',
      demoPoints: [
        '원클릭 추천 질문 칩(1.5도 상승 영향, 디지털 탄소발자국, 올바른 배출법)으로 빠른 시연',
        '한국어 중심의 정갈한 단락 구분 및 실천 액션 플랜 3가지 제공',
        '네트워크 환경에 무관하게 발표가 끊김 없이 진행되는 지능형 지식 엔진 내장'
      ]
    },
    {
      tab: 'quiz' as TabType,
      icon: BookOpen,
      title: '4. 지구 온난화 퀴즈 & 공익 학습 영상관',
      objective: '과학적 원리(알베도 효과, 해양 산성화, 영구동토층 메탄) 체득 및 고품질 영상 교육',
      demoPoints: [
        '엄선된 8대 기후 과학 퀴즈 풀이 및 실시간 정답 해설',
        'IPCC 및 NASA, 환경부의 검증된 학습 영상과 발표자용 요약 포인트 제공',
        '퀴즈 완주 시 축하 이펙트(Confetti)와 기후 리더 인증 획득'
      ]
    },
    {
      tab: 'character' as TabType,
      icon: Award,
      title: '5. 에코 캐릭터(에코링) 성장 시스템',
      objective: '사용자의 모든 친환경 앱 활동이 캐릭터의 4단계 진화로 연결되어 지속적 동기 부여',
      demoPoints: [
        '씨앗 -> 어린잎 -> 성장한 묘목 -> 지구 수호목으로 진화하는 비주얼 SVG 아바타',
        '터치 시 반응하는 인터랙티브 말풍선과 일상 친환경 실천 명언 전달',
        '탄소 감축 기여량(kg CO2) 및 활력 지수를 실시간 지표로 시각화'
      ]
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#D8F3DC] text-[#1B4332] border border-[#B7E4C7]">
                발표자 전용 모드
              </span>
              <h2 className="text-xl font-black text-[#1B4332] flex items-center gap-2">
                <Presentation className="w-5 h-5 text-[#2D6A4F]" />
                웹사이트 발표 및 실전 시연 가이드
              </h2>
            </div>
            <p className="text-xs text-[#52796F] font-medium mt-1 max-w-2xl leading-relaxed">
              본 앱은 발표 자리에서 참석자들에게 모든 기능을 직접 시연할 수 있도록 최적화되어 있습니다. 아래 시연 버튼을 클릭하여 각 모듈로 즉시 이동할 수 있습니다.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-demo-level-up"
              onClick={onInstantLevelUp}
              className="flex items-center gap-2 px-4 py-2.5 bg-[#2D6A4F] hover:bg-[#1B4332] text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <Zap className="w-4 h-4 text-amber-300" />
              캐릭터 즉시 성장 시연 (현재 Lv.{currentLevel})
            </button>
          </div>
        </div>
      </div>

      {/* Presentation Script & Module Shortcuts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {presentationModules.map((mod, idx) => {
          const IconComp = mod.icon;
          return (
            <div
              key={idx}
              className="bg-white border border-[#E2E8F0] rounded-3xl p-5 flex flex-col justify-between shadow-xs hover:shadow-md hover:border-[#2D6A4F]/40 transition-all"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2.5 rounded-2xl bg-[#D8F3DC] border border-[#B7E4C7] text-[#2D6A4F]">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-[#52796F]">STEP 0{idx + 1}</span>
                </div>

                <h3 className="text-base font-black text-[#1B4332] mb-1">{mod.title}</h3>
                <p className="text-xs text-[#2D6A4F] font-bold mb-3">{mod.objective}</p>

                <div className="space-y-2 border-t border-[#E2E8F0] pt-3">
                  <span className="text-[11px] font-bold text-[#1B4332]">시연 핵심 체크리스트:</span>
                  <ul className="space-y-1.5">
                    {mod.demoPoints.map((point, pIdx) => (
                      <li key={pIdx} className="text-xs text-[#2C3E50] font-medium flex items-start gap-1.5 leading-relaxed">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#2D6A4F] shrink-0 mt-0.5" />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-[#E2E8F0]">
                <button
                  onClick={() => onNavigateTab(mod.tab)}
                  className="w-full py-2.5 bg-[#F8FAFC] hover:bg-[#EBF2EE] text-[#1B4332] border border-[#E2E8F0] hover:border-[#2D6A4F] rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>이 기능 직접 시연하기</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Suggested 3-Minute Presentation Speech Flow */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 shadow-sm space-y-3">
        <h3 className="text-sm font-black text-[#1B4332] flex items-center gap-2">
          <Globe className="w-4 h-4 text-[#2D6A4F]" />
          발표용 3분 스피치 추천 대본 가이드
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0] space-y-1">
            <span className="text-[#2D6A4F] font-black">1단계: 도입 (30초)</span>
            <p className="leading-relaxed text-[#2C3E50] font-medium">
              "환경 문제는 지식으로 아는 것보다 매일의 행동으로 실천하는 것이 핵심입니다. 우리 EcoSphere는 게임, AI 창작, 상호작용 대화를 하나로 결합한 차세대 친환경 교육 플랫폼입니다."
            </p>
          </div>

          <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0] space-y-1">
            <span className="text-[#2D6A4F] font-black">2단계: 기능 시연 (90초)</span>
            <p className="leading-relaxed text-[#2C3E50] font-medium">
              "직접 분리배출 게임을 하며 오답 피드백을 받고, Gemini AI로 1.5도 방어선 포스터를 만들어 전시관에 게시합니다. 기후 챗봇에게 일상 속 탄소 줄이기 팁을 실시간으로 묻습니다."
            </p>
          </div>

          <div className="bg-[#F8FAFC] p-4 rounded-2xl border border-[#E2E8F0] space-y-1">
            <span className="text-[#2D6A4F] font-black">3단계: 결론 (30초)</span>
            <p className="leading-relaxed text-[#2C3E50] font-medium">
              "모든 실천 결과는 '에코링' 캐릭터의 진화와 탄소 감축량으로 시각화되어 사용자에게 지속 가능한 친환경 습관을 선물합니다. 감사합니다."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
