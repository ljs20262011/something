import { PosterItem } from '../types';

const STORAGE_KEY = 'ecosphere_community_posters';

export const DEFAULT_COMMUNITY_POSTERS: PosterItem[] = [
  {
    id: 'poster-1',
    title: '1.5°C 골든타임의 경고',
    slogan: '지구의 체온 1.5°C,\n우리의 마지막 마지노선',
    subtitle: '평균 기온 1.5도 상승 시 폭염 빈도 8.6배 증가. 침묵은 해결책이 아닙니다.',
    author: '기후행동 청소년 네트워크',
    category: 'climate',
    createdAt: '2026-09-02',
    likes: 128,
    layout: 'bold-center',
    palette: {
      bg: '#0B192C',
      primary: '#FF6500',
      secondary: '#1E3E62',
      accent: '#00FF9C',
      text: '#FFFFFF'
    },
    graphicType: 'earth-melting',
    callToAction: '2030 온실가스 40% 감축 실천하기',
    factTag: 'IPCC 제6차 기후변화 평가보고서 기준'
  },
  {
    id: 'poster-2',
    title: '플라스틱 없는 바다를 꿈꾸며',
    slogan: '바다는 플라스틱\n쓰레기통이 아닙니다',
    subtitle: '매년 1,200만 톤의 플라스틱이 해양으로 유입됩니다. 당신의 텀블러 하나가 고래를 구합니다.',
    author: '푸른해양지킴이',
    category: 'ocean',
    createdAt: '2026-09-03',
    likes: 95,
    layout: 'split-dynamic',
    palette: {
      bg: '#04151F',
      primary: '#1488CC',
      secondary: '#2B32B2',
      accent: '#2AF598',
      text: '#E2F1AF'
    },
    graphicType: 'clean-ocean',
    callToAction: '일회용품 거절하고 다회용기 사용하기',
    factTag: '해양생물 700여 종 플라스틱 위협 직면'
  },
  {
    id: 'poster-3',
    title: '순환 경제의 시작, 분리배출',
    slogan: '버리면 쓰레기,\n모으면 내일의 자원',
    subtitle: '비우고, 헹구고, 분리하고, 섞지 않는다. 4단계 올바른 배출이 자원 순환율 80%를 만듭니다.',
    author: '에코에코 연구소',
    category: 'plastic',
    createdAt: '2026-09-04',
    likes: 154,
    layout: 'impact-badge',
    palette: {
      bg: '#0F2027',
      primary: '#10B981',
      secondary: '#059669',
      accent: '#FBBF24',
      text: '#F0FDF4'
    },
    graphicType: 'recycling-loop',
    callToAction: '투명 페트병 라벨 제거 후 별도 배출!',
    factTag: '페트병 1개 재활용 시 백열전구 6시간 에너지 절약'
  },
  {
    id: 'poster-4',
    title: '도심 속 녹색 숨결을 지켜요',
    slogan: '나무 한 그루가\n숨쉬는 미래를 만듭니다',
    subtitle: '도시 숲 1ha는 연간 168kg의 미세먼지를 흡수합니다. 숲과 공원을 우리 손으로 보호해요.',
    author: '그린시티 청년회',
    category: 'forest',
    createdAt: '2026-09-05',
    likes: 82,
    layout: 'minimal-editorial',
    palette: {
      bg: '#111827',
      primary: '#34D399',
      secondary: '#065F46',
      accent: '#6EE7B7',
      text: '#FFFFFF'
    },
    graphicType: 'sprout-hands',
    callToAction: '탄소중립 반려식물 & 나무 심기 캠페인',
    factTag: '도시 열섬 현상 완화 3~7°C 저감 효과'
  }
];

export function getLocalPosters(): PosterItem[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn('localStorage access failed:', e);
  }
  return DEFAULT_COMMUNITY_POSTERS;
}

export function saveLocalPosters(posters: PosterItem[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posters));
  } catch (e) {
    console.warn('localStorage save failed:', e);
  }
}

// Client-side AI Fallback Chat (IPCC & Korean Ministry of Environment Knowledge Base)
export function generateClientFallbackChat(query: string): string {
  const q = query.toLowerCase();

  if (q.includes('분리') || q.includes('쓰레기') || q.includes('재활용') || q.includes('페트병') || q.includes('스티로폼')) {
    return `분리배출 4대 핵심 원칙은 '비우고, 헹구고, 분리하고, 섞지 않는다'입니다.

1. 투명 페트병
- 내용물을 깨끗이 비우고 물로 헹굽니다.
- 부착된 비닐 라벨을 완전히 떼어내어 비닐류로 배출합니다.
- 발로 찌그러뜨린 후 뚜껑을 닫아 전용 수거함에 배출합니다.

2. 오염된 배달 용기 및 피자 상자
- 기름때나 양념이 물로 지워지지 않는 스티로폼 및 종이상자는 재활용이 불가능하므로 '일반 종량제 봉투'에 버려야 합니다.

3. 복합 재질 및 스프링 노트
- 스프링 노트를 버릴 때는 플라스틱/철제 스프링을 분리해 고철로, 비닐 코팅 표지는 일반쓰레기, 내지만 종이류로 배출합니다.`;
  }

  if (q.includes('1.5') || q.includes('온난화') || q.includes('온도') || q.includes('기후') || q.includes('빙하')) {
    return `지구 평균 기온 상승 1.5°C는 인류와 생태계가 돌이킬 수 없는 피해(티핑 포인트)를 피하기 위한 과학적 마지노선입니다.

- 현재 상황: 산업화 이전 대비 이미 약 1.15°C~1.2°C 상승한 상태입니다.
- 1.5°C vs 2.0°C 차이:
  * 폭염 노출 인구: 2°C 상승 시 1.5°C 대비 2배 이상 급증
  * 해양 산호초 절멸: 1.5°C에서 70~90% 소멸, 2°C에선 99% 이상 전멸
  * 북극 빙하 소멸 빈도: 1.5°C에서는 100년에 한 번, 2°C에서는 10년에 한 번

우리가 할 수 있는 즉각적인 실천:
- 대중교통 이용 및 에너지 소비 효율 1등급 가전 사용
- 불필요한 이메일 삭제 (디지털 탄소발자국 감축)
- 주 1~2회 채식 식단 실천`;
  }

  if (q.includes('탄소') || q.includes('발자국') || q.includes('줄이') || q.includes('습관')) {
    return `일상에서 실천할 수 있는 고효율 탄소발자국 저감 실천법입니다:

1. 수송 분야 (가장 큰 저감 효과)
- 주 1회 자가용 대신 대중교통을 이용하면 연간 약 469kg의 CO2를 절약할 수 있습니다.

2. 냉난방 및 전력 관리
- 여름철 실내 적정온도 26°C, 겨울철 20°C 유지
- 대기전력 차단 멀티탭을 활용하여 낭비되는 가구당 10% 전력 차단

3. 음식 및 자원 소비
- 잔반을 남기지 않는 것만으로도 온실가스 배출을 연간 수십 kg 감축
- 텀블러와 장바구니 상시 휴대로 일회용 플라스틱 및 포장재 절감`;
  }

  if (q.includes('에너지') || q.includes('신재생') || q.includes('태양광')) {
    return `신재생 에너지는 화석연료 연소에 의한 온실가스 배출을 근본적으로 차단하는 탄소중립의 핵심 수단입니다:

1. 태양광 & 풍력 발전: 발전 과정에서 탄소를 배출하지 않으며, 전력망의 탈탄소화를 주도합니다.
2. 친환경 에너지 소비: 대기전력 차단, LED 조명 전환, 스마트 플러그 사용으로 가정 내 소비 전력을 20% 이상 줄일 수 있습니다.`;
  }

  return `지구 환경 보존과 탄소중립 실천을 위해 함께해 주셔서 감사합니다.

지구 온난화와 기후위기는 미래의 문제가 아니라 현재 우리가 겪고 있는 극한 기후, 폭염, 해수면 상승으로 직결되는 긴급 과제입니다.

궁금하신 세부 주제가 있으신가요?
- "올바른 투명 페트병 및 배달용기 분리배출 요령"
- "지구 온난화와 1.5도 방어선의 과학적 근거"
- "탄소발자국을 줄이는 하루 실천 체크리스트"
- "신재생 에너지와 화석연료의 차이"

질문해 주시면 전문적이고 알기 쉬운 환경 지식을 안내해 드리겠습니다.`;
}

// Client-side AI Poster Spec Generator (Instant, Creative, Multi-category)
export function generateClientPosterSpec(topic?: string, category?: string, visualMood?: string): any {
  const cat = category || 'climate';

  if (cat === 'plastic') {
    return {
      title: topic ? `${topic} - 실천 선언` : '플라스틱 다이어트 선언',
      slogan: '오늘의 일회용,\n내일의 지구 오염',
      subtitle: '매 분마다 100만 개의 플라스틱 병이 버려집니다. 거절하는 당신이 지구의 영웅입니다.',
      callToAction: '일회용 컵 거절하고 다회용기 챙기기',
      factTag: '플라스틱 분해 소요 시간 500년',
      layout: 'impact-badge',
      graphicType: 'clean-ocean',
      palette: {
        bg: '#04151F',
        primary: '#0EA5E9',
        secondary: '#1E293B',
        accent: '#38BDF8',
        text: '#F8FAFC'
      }
    };
  }

  if (cat === 'ocean') {
    return {
      title: topic ? `${topic} - 바다의 소리` : '푸른 바다의 절규',
      slogan: '물고기보다 플라스틱이\n많아지는 바다를 막아주세요',
      subtitle: '2050년 바다는 물고기보다 플라스틱이 더 무거워집니다. 해양 생태계 보호는 지금 시작됩니다.',
      callToAction: '해변 정화 및 미세플라스틱 화장품 거부',
      factTag: '바다거북 52% 이상 플라스틱 섭취 피해',
      layout: 'split-dynamic',
      graphicType: 'clean-ocean',
      palette: {
        bg: '#031726',
        primary: '#0284C7',
        secondary: '#0F172A',
        accent: '#34D399',
        text: '#F0F9FF'
      }
    };
  }

  if (cat === 'forest') {
    return {
      title: topic ? `${topic} - 녹색 숨결` : '하나뿐인 지구의 허파',
      slogan: '한 그루의 묘목이\n미래의 맑은 공기입니다',
      subtitle: '아마존 열대우림은 전 세계 산소의 20%를 공급합니다. 숲 파괴를 멈추고 녹색 미래를 심으세요.',
      callToAction: '종이 영수증 거절 & 탄소흡수원 보호 참여',
      factTag: '30년생 소나무 한 그루 연간 CO2 6.6kg 흡수',
      layout: 'minimal-editorial',
      graphicType: 'sprout-hands',
      palette: {
        bg: '#064E3B',
        primary: '#10B981',
        secondary: '#022C22',
        accent: '#6EE7B7',
        text: '#ECFDF5'
      }
    };
  }

  if (cat === 'energy') {
    return {
      title: topic ? `${topic} - 그린 에너지` : '지속가능한 청정 에너지',
      slogan: '바람과 햇빛으로\n깨끗한 내일을 만듭니다',
      subtitle: '신재생 에너지로의 전환은 선택이 아닌 생존입니다. 불필요한 대기전력을 지금 차단하세요.',
      callToAction: '대기전력 차단 멀티탭 생활화',
      factTag: '가정 내 대기전력 낭비율 연간 약 10%',
      layout: 'bold-center',
      graphicType: 'wind-solar',
      palette: {
        bg: '#0A2540',
        primary: '#38BDF8',
        secondary: '#0F172A',
        accent: '#FACC15',
        text: '#F8FAFC'
      }
    };
  }

  return {
    title: topic ? `${topic} - 기후 행동` : '1.5도 방어선 사수',
    slogan: '지구의 경고를 멈출\n시간은 바로 지금입니다',
    subtitle: '2030년까지 온실가스 45% 감축을 달성하지 못하면 기후 재난은 일상이 됩니다.',
    callToAction: '생활 속 탄소중립 1인 1실천 동참하기',
    factTag: 'IPCC 지구온난화 1.5°C 특별보고서',
    layout: 'bold-center',
    graphicType: 'earth-melting',
    palette: {
      bg: '#0F172A',
      primary: '#EF4444',
      secondary: '#1E293B',
      accent: '#F59E0B',
      text: '#FFFFFF'
    }
  };
}
