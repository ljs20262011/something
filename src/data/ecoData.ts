import { BinCategory, TrashItem, QuizQuestion, LearningVideo } from '../types';

export const BIN_CATEGORIES: BinCategory[] = [
  {
    id: 'plastic',
    name: '플라스틱류',
    shortName: '플라스틱',
    color: 'text-blue-700',
    borderColor: 'border-blue-200 hover:border-blue-500',
    bgColor: 'bg-blue-50/70 hover:bg-blue-100/80',
    description: '내용물을 물로 깨끗이 헹구고 상표 라벨을 제거한 페트병 및 플라스틱 용기',
    disposalRules: ['내용물 비우기', '부착 상표 라벨 제거', '압착 후 뚜껑 닫기']
  },
  {
    id: 'paper',
    name: '종이 / 종이팩',
    shortName: '종이류',
    color: 'text-amber-800',
    borderColor: 'border-amber-200 hover:border-amber-500',
    bgColor: 'bg-amber-50/70 hover:bg-amber-100/80',
    description: '물에 젖지 않고 이물질이 묻지 않은 신문, 박스, 책자류. 우유팩은 헹궈서 별도 배출',
    disposalRules: ['박스 테이프·송장 스티커 제거', '스프링 및 철심 분리', '종이팩은 물로 헹궈 펼치기']
  },
  {
    id: 'vinyl',
    name: '비닐류 (필름)',
    shortName: '비닐류',
    color: 'text-purple-800',
    borderColor: 'border-purple-200 hover:border-purple-500',
    bgColor: 'bg-purple-50/70 hover:bg-purple-100/80',
    description: '과자 봉지, 빵 봉지, 완충재(뽁뽁이) 등 깨끗하고 투명하거나 인쇄된 필름류',
    disposalRules: ['이물질이 묻지 않아야 함', '음식물이 물든 비닐은 일반쓰레기', '흩날리지 않게 모아 배출']
  },
  {
    id: 'cans',
    name: '캔 / 고철류',
    shortName: '캔·고철',
    color: 'text-emerald-800',
    borderColor: 'border-emerald-200 hover:border-emerald-500',
    bgColor: 'bg-emerald-50/70 hover:bg-emerald-100/80',
    description: '철캔, 알루미늄 캔, 프라이팬, 전선, 못 등 금속 성분 제품',
    disposalRules: ['내용물 세척 후 압축', '부탄가스 용기는 통풍 좋은 곳에서 구멍 뚫기', '플라스틱 뚜껑 분리']
  },
  {
    id: 'glass',
    name: '유리병류',
    shortName: '유리병',
    color: 'text-teal-800',
    borderColor: 'border-teal-200 hover:border-teal-500',
    bgColor: 'bg-teal-50/70 hover:bg-teal-100/80',
    description: '음료수병, 와인병, 조미료병 등. 거울·도자기·깨진 유리는 해당되지 않음',
    disposalRules: ['뚜껑 분리 배출', '담배꽁초 등 이물질 넣지 않기', '빈용기 보증금 대상 병은 마트 반환']
  },
  {
    id: 'food',
    name: '음식물 쓰레기',
    shortName: '음식물',
    color: 'text-orange-800',
    borderColor: 'border-orange-200 hover:border-orange-500',
    bgColor: 'bg-orange-50/70 hover:bg-orange-100/80',
    description: '가축의 사료나 퇴비로 재가공 가능한 유기성 폐기물. 수분을 최대한 짜내어 배출',
    disposalRules: ['물기 최대한 제거', '비닐 등 이물질 혼입 엄금', '동물 뼈·조개껍질·양파껍질은 일반쓰레기']
  },
  {
    id: 'general',
    name: '일반 종량제 봉투',
    shortName: '일반쓰레기',
    color: 'text-slate-800',
    borderColor: 'border-slate-200 hover:border-slate-400',
    bgColor: 'bg-slate-100/80 hover:bg-slate-200/80',
    description: '재활용이 불가능한 오염된 물질, 복합 재질, 소각 또는 매립 대상 폐기물',
    disposalRules: ['규격 종량제 봉투 사용', '음식물이 배어 물로 안 씻기는 포장재', '깨진 유리·도자기는 특수규격 마대']
  },
  {
    id: 'battery',
    name: '폐건전지 / 특수수거함',
    shortName: '폐건전지',
    color: 'text-rose-800',
    borderColor: 'border-rose-200 hover:border-rose-500',
    bgColor: 'bg-rose-50/70 hover:bg-rose-100/80',
    description: '중금속 및 화재 위험이 있는 건전지, 보조배터리, 형광등 전용 수거함 배출',
    disposalRules: ['동주민센터 또는 아파트 전용 수거함', '일반 종량제 봉투에 절대 혼입 금지', '리튬이온 배터리 단자 테이핑']
  }
];

export const TRASH_ITEMS: TrashItem[] = [
  {
    id: 'item-1',
    name: '기름때 묻은 피자 박스',
    category: 'general',
    tip: '치즈와 기름이 배어든 박스는 펄프 재생 과정에서 섬유질을 훼손하여 재활용할 수 없습니다.',
    explanation: '오염된 종이는 일반 종량제 봉투에 버려야 합니다. 단, 기름이 전혀 묻지 않은 뚜껑 윗부분은 오려서 종이류로 배출할 수 있습니다.',
    difficulty: 'easy',
    commonMistakeNote: '종이 박스라고 해서 무조건 종이류로 버리면 전체 재활용 펄프를 오염시킵니다.',
    iconName: 'Package'
  },
  {
    id: 'item-2',
    name: '깨끗이 헹군 투명 생수병',
    category: 'plastic',
    tip: '내용물을 비우고 비닐 라벨을 제거한 뒤 압착하여 투명 페트병 전용 수거함에 배출합니다.',
    explanation: '고품질 리사이클 원사(의류, 가방 원단)로 재탄생할 수 있는 최고급 재활용 자원입니다.',
    difficulty: 'easy',
    commonMistakeNote: '비닐 라벨을 떼지 않고 버리면 기계 선별 시 일반 플라스틱으로 격하됩니다.',
    iconName: 'Cylinder'
  },
  {
    id: 'item-3',
    name: '택배 완충재 (에어캡/뽁뽁이)',
    category: 'vinyl',
    tip: '테이프나 운송장 스티커를 제거하고 깨끗한 상태로 비닐류에 배출합니다.',
    explanation: '투명하고 깨끗한 폴리에틸렌(PE) 필름 소재로 압축 열분해유 및 재생 플라스틱 펠릿으로 재활용됩니다.',
    difficulty: 'medium',
    commonMistakeNote: '일반쓰레기나 스티로폼으로 오인하기 쉽지만 비닐류 수거 품목입니다.',
    iconName: 'Layers'
  },
  {
    id: 'item-4',
    name: '다 쓴 휴대용 부탄가스통',
    category: 'cans',
    tip: '반드시 환기가 잘 되는 야외에서 구멍을 뚫어 잔여 가스를 완전히 배출한 후 캔류로 배출합니다.',
    explanation: '잔여 가스가 남아있으면 쓰레기 수거 차량이나 선별장 파쇄기에서 화재와 폭발을 일으킵니다.',
    difficulty: 'medium',
    commonMistakeNote: '구멍을 뚫지 않고 버려 매년 수많은 안전사고가 발생합니다.',
    iconName: 'Flame'
  },
  {
    id: 'item-5',
    name: '스프링이 달린 노트',
    category: 'general',
    tip: '스프링을 분리하지 않았다면 복합 재질이므로 일반쓰레기입니다. 스프링을 빼내면 내지는 종이류입니다.',
    explanation: '철제 또는 플라스틱 스프링과 코팅 표지를 완전히 떼어낸 순수 종이 내지만 종이류로 재활용됩니다.',
    difficulty: 'hard',
    commonMistakeNote: '스프링 채로 종이함에 넣으면 제지 공장의 칼날 손상 및 불량품 발생 원인이 됩니다.',
    iconName: 'Book'
  },
  {
    id: 'item-6',
    name: '소뼈, 닭뼈, 조개껍데기',
    category: 'general',
    tip: '가축의 사료나 비료로 분쇄 가공할 수 없는 딱딱한 동물 뼈와 패각류는 일반 종량제 봉투입니다.',
    explanation: '음식물 처리 기계의 칼날을 파손시키고 가축의 소화기관을 손상시키므로 음식물이 아닌 일반쓰레기입니다.',
    difficulty: 'easy',
    commonMistakeNote: '음식에서 나온 부산물이라 음식물 쓰레기로 오해하기 가장 쉬운 대표 품목입니다.',
    iconName: 'Bone'
  },
  {
    id: 'item-7',
    name: '깨끗이 씻은 컵라면 용기',
    category: 'general',
    tip: '국물 색소와 유분이 스티로폼 내벽에 스며들어 착색된 컵라면 용기는 재활용이 불가합니다.',
    explanation: '햇볕에 말려 붉은 기운이 완전히 사라지면 스티로폼 배출이 가능하지만, 기름때가 남았다면 일반쓰레기입니다.',
    difficulty: 'medium',
    commonMistakeNote: '물로 대충 헹궜다고 스티로폼으로 버리면 선별장에서 폐기 처분됩니다.',
    iconName: 'Coffee'
  },
  {
    id: 'item-8',
    name: '고흡수성 수지 젤 아이스팩',
    category: 'general',
    tip: '물이 아닌 화학 젤(SAP)이 든 아이스팩은 뜯지 말고 봉투 통째로 일반 종량제 봉투에 버립니다.',
    explanation: '젤 성분은 미세플라스틱의 일종으로 하수구에 버리면 수생태계를 심각하게 오염시키고 하수관을 막습니다.',
    difficulty: 'hard',
    commonMistakeNote: '싱크대에 내용물을 쏟아버리면 절대 안 되며, 최근 전용 수거함이 있는 지자체에 반납 가능합니다.',
    iconName: 'ShieldAlert'
  },
  {
    id: 'item-9',
    name: '다 쓴 AA 알칼라인 건전지',
    category: 'battery',
    tip: '수은, 납, 카드뮴 등 유해 중금속이 포함되어 있어 동주민센터나 아파트 전용 수거함에 배출합니다.',
    explanation: '일반 쓰레기로 매립 시 토양과 지하수를 오염시키고, 소각 시 유독가스를 유발하며 화재 위험이 큽니다.',
    difficulty: 'easy',
    commonMistakeNote: '크기가 작다고 일반 종량제 봉투에 무심코 버리는 경우가 많습니다.',
    iconName: 'BatteryCharging'
  },
  {
    id: 'item-10',
    name: '깨진 맥주 유리병',
    category: 'general',
    tip: '깨진 유리는 재활용 유리병 수거함에 넣지 않고 신문지에 안전하게 싸서 종량제 봉투에 배출합니다.',
    explanation: '깨진 파편은 선별장 작업자의 심각한 베임 사고를 유발하며 자동 선별 장비에서 분리가 어렵습니다.',
    difficulty: 'medium',
    commonMistakeNote: '유리 재질이지만 깨진 상태는 재활용 대상이 아닙니다.',
    iconName: 'AlertTriangle'
  },
  {
    id: 'item-11',
    name: '씻어서 펼쳐 말린 우유팩',
    category: 'paper',
    tip: '일반 폐지와 섞지 않고 종이팩 전용 수거함이나 주민센터 포인트 교환 창구에 배출합니다.',
    explanation: '100% 천연 고급 펄프로 방수 코팅되어 있어 고급 화장지나 냅킨으로 100% 재생산됩니다.',
    difficulty: 'medium',
    commonMistakeNote: '일반 신문지나 박스와 함께 버리면 코팅막 때문에 제지 공정에서 펄프화가 안 되어 버려집니다.',
    iconName: 'Milk'
  },
  {
    id: 'item-12',
    name: '양파 껍질 및 마늘 껍질',
    category: 'general',
    tip: '섬유질이 질기고 수분이 없으며 가축의 사료로서 영양적 가치가 없어 일반쓰레기로 분류됩니다.',
    explanation: '옥수수 대, 파뿌리, 밤 껍질, 호두 껍질 등도 모두 가축 사료화가 불가능해 일반 쓰레기입니다.',
    difficulty: 'hard',
    commonMistakeNote: '채소류 찌꺼기라서 음식물 쓰레기로 혼동하기 매우 쉬운 항목입니다.',
    iconName: 'Trash2'
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    question: '지구온난화의 주범으로 꼽히는 온실가스 중 배출 비중이 가장 크고 화석연료 연소로 주로 발생하는 가스는 무엇일까요?',
    options: ['이산화탄소 (CO2)', '메탄 (CH4)', '아산화질소 (N2O)', '수소불화탄소 (HFCs)'],
    correctIndex: 0,
    explanation: '인간 활동으로 배출되는 온실가스의 약 75% 이상이 이산화탄소이며, 주로 석탄·석유·천연가스 등 화석연료 연소와 산림 벌채에서 발생합니다.',
    scientificFact: '대기 중 이산화탄소 농도는 산업화 이전 약 280ppm에서 현재 420ppm을 초과하여 300만 년 만에 최고 수준을 기록했습니다.',
    category: '온실가스'
  },
  {
    id: 2,
    question: '파리 기후협정(Paris Agreement)에서 전 세계가 인류 생존을 위해 설정한 지구 평균 기온 상승 억제 마지노선은 얼마일까요?',
    options: ['산업화 이전 대비 0.5°C', '산업화 이전 대비 1.5°C', '산업화 이전 대비 3.0°C', '산업화 이전 대비 5.0°C'],
    correctIndex: 1,
    explanation: 'IPCC 보고서에 따르면 지구 기온 상승을 1.5°C 이하로 제한해야 돌이킬 수 없는 기후 티핑 포인트(빙하 대규모 붕괴, 산호초 전멸 등)를 막을 수 있습니다.',
    scientificFact: '1.5°C 상승과 2.0°C 상승의 차이로 인해 극심한 폭염에 노출되는 인구가 약 4억 2천만 명 이상 차이가 납니다.',
    category: '탄소중립 정책'
  },
  {
    id: 3,
    question: '극지방의 빙하가 녹으면 지구 온난화가 가속화되는 현상의 과학적 원리는 무엇일까요?',
    options: [
      '알베도(태양광 반사율) 감소로 바다가 열을 더 많이 흡수하기 때문',
      '얼음 속에 갇혀 있던 산소가 대기로 일시에 방출되기 때문',
      '해저 화산 폭발 빈도가 기하급수적으로 증가하기 때문',
      '지구의 자전 속도가 빨라져 마찰열이 발생하기 때문'
    ],
    correctIndex: 0,
    explanation: '하얀 얼음은 태양열의 약 80~90%를 우주로 반사(높은 알베도)하지만, 얼음이 녹아 짙은 바다가 드러나면 태양열의 90%를 바다가 흡수하여 온난화가 더욱 가속되는 양의 되먹임(positive feedback)이 발생합니다.',
    scientificFact: '북극 해빙 면적은 지난 40년간 매 10년마다 약 13%씩 감소하고 있습니다.',
    category: '해양·빙하'
  },
  {
    id: 4,
    question: '대기 중 이산화탄소가 바다에 다량 용해되어 해양 생태계의 조개, 소라, 산호의 석회질 껍데기 형성을 방해하는 현상은?',
    options: ['해양 산성화', '적조 현상', '엘니뇨 현상', '해수면 담수화'],
    correctIndex: 0,
    explanation: '해양 산성화는 CO2가 바닷물과 반응해 탄산을 형성하고 수소이온 농도를 높여 해양 탄산염 이온을 감소시키는 현상입니다. 이로 인해 산호초와 패류의 껍데기가 녹아 생태계가 붕괴합니다.',
    scientificFact: '바다는 인류가 배출한 이산화탄소의 약 30%를 흡수하며 지구 온난화를 완화해 왔지만, 이로 인해 해양 pH가 급격히 떨어지고 있습니다.',
    category: '해양·빙하'
  },
  {
    id: 5,
    question: '일상에서 실천하는 디지털 탄소발자국(Digital Carbon Footprint) 줄이기 방법으로 올바르지 않은 것은?',
    options: [
      '불필요하게 쌓인 읽지 않은 이메일과 스팸 메일함 비우기',
      '동영상 스트리밍 시 필요치 않을 때도 무조건 4K 초고화질로 연속 재생해두기',
      '사용하지 않는 모바일 앱의 백그라운드 데이터 및 푸시 알림 차단하기',
      '자주 찾는 웹사이트는 즐겨찾기를 등록하여 검색 횟수 줄이기'
    ],
    correctIndex: 1,
    explanation: '데이터센터와 통신망은 막대한 전력을 소모합니다. 불필요한 고화질 스트리밍은 전력 소비와 냉각 전력을 급증시키므로, 필요에 맞는 화질 설정이 탄소를 절감합니다.',
    scientificFact: '스팸 메일 1통을 보관하는 데 약 0.3g, 대용량 이메일 전송 시 약 50g의 이산화탄소가 데이터센터에서 발생합니다.',
    category: '온난화 메커니즘'
  },
  {
    id: 6,
    question: '기후변화로 인해 북극 툰드라 지대의 영구동토층이 녹을 때 대량 방출되어 지구 온난화를 급가속시키는 강력한 온실가스는?',
    options: ['메탄 (Methane, CH4)', '아르곤 (Argon)', '헬륨 (Helium)', '네온 (Neon)'],
    correctIndex: 0,
    explanation: '영구동토층 속에는 수만 년간 얼어 있던 유기물이 들어있는데, 녹으면서 미생물에 의해 분해되어 메탄가스가 방출됩니다. 메탄은 20년 기준 온실효과가 이산화탄소의 80배가 넘습니다.',
    scientificFact: '영구동토층에는 현재 대기 중에 존재하는 탄소량의 약 2배에 달하는 탄소가 갇혀 있습니다.',
    category: '온실가스'
  },
  {
    id: 7,
    question: '지구 온난화로 바다 온도가 상승하여 산호가 영양분을 공급하는 공생 조류를 방출하고 하얗게 말라 죽는 현상의 명칭은?',
    options: ['산호 백화 현상 (Coral Bleaching)', '녹조 라떼 현상', '해무 현상', '심해 용승 현상'],
    correctIndex: 0,
    explanation: '수온이 1~2도만 장기간 상승해도 산호는 극심한 스트레스를 받아 공생하는 조류를 뱉어내고 투명한 석회질 골격만 남아 하얗게 변하며 굶어 죽게 됩니다.',
    scientificFact: '호주 그레이트 배리어 리프의 산호초는 최근 연이은 해양 열파로 인해 절반 이상이 백화 피해를 입었습니다.',
    category: '생태계 위기'
  },
  {
    id: 8,
    question: '올바른 투명 페트병 분리배출 3단계 공식으로 가장 정확한 것은?',
    options: [
      '비우고 헹군다 -> 라벨을 뗀다 -> 압축 후 뚜껑을 닫는다',
      '물로 씻지 않고 뚜껑을 열어 납작하게 만든다',
      '색깔 있는 음료수병과 투명 페트병을 같은 비닐봉지에 묶는다',
      '라벨이 붙은 채로 가위로 잘게 썰어서 버린다'
    ],
    correctIndex: 0,
    explanation: '비우고 헹구기, 비닐 라벨 완벽 제거, 부피를 줄이기 위한 압축 및 이물질 차단을 위한 뚜껑 닫기가 올바른 투명 페트병 분리배출의 정석입니다.',
    scientificFact: '투명 페트병 500ml 15개를 모으면 기능성 티셔츠 1벌을 만들 수 있는 고급 장섬유가 생산됩니다.',
    category: '탄소중립 정책'
  }
];

export const LEARNING_VIDEOS: LearningVideo[] = [
  {
    id: 'vid-1',
    title: '지구온난화 1.5°C 특별보고서의 핵심: 왜 0.5도가 인류의 운명을 가를까?',
    channel: 'IPCC & 대한민국 기후환경 포럼',
    category: '지구온난화',
    duration: '11:45',
    youtubeId: 'bYrYQ3A98aU',
    summary: '지구 평균기온이 1.5°C 상승했을 때와 2.0°C 상승했을 때 발생하는 폭염, 해수면 상승, 생물종 멸종의 치명적 차이를 과학적 통계로 분석합니다.',
    keyPoints: [
      '평균 1.5도 상승 시 해수면 40cm 상승 vs 2도 상승 시 46cm 상승 (수천만 명 침수 위협)',
      '1.5도 방어 실패 시 산호초 99% 이상 절멸하여 해양 생태계 사슬 붕괴',
      '2030년까지 전 세계 탄소 배출량을 2010년 대비 최소 45% 감축해야 하는 과학적 당위성'
    ],
    presenterTakeaway: '0.5도는 단순한 숫자가 아니라 수억 명의 기후 난민과 지구 생태계 존망을 결정하는 절대선입니다.'
  },
  {
    id: 'vid-2',
    title: '북극과 남극 빙하의 붕괴: 해수면 상승과 기후 재난의 연결고리',
    channel: 'NASA Climate & 환경스페셜',
    category: '해수면상승',
    duration: '14:20',
    youtubeId: '3Ugtf5Z5vWw',
    summary: '인공위성 관측 데이터로 확인된 그린란드 및 서남극 빙상의 해빙 가속화 현상과 알베도(반사율) 피드백 메커니즘을 시각화하여 전달합니다.',
    keyPoints: [
      '얼음이 녹아 어두운 바다가 드러나며 태양열 흡수가 급증하는 양의 되먹임 가속',
      '서남극 스웨이츠(스웨이츠) 빙하 붕괴 시 글로벌 해수면 최대 65cm 상승 위험',
      '해양 순환 벨트(골프스트림 등 열염순환) 약화로 인한 전 지구적 기상이변 유발'
    ],
    presenterTakeaway: '극지의 얼음은 지구의 에어컨입니다. 극지 빙하의 손실은 지구 전체 기후 시스템의 고장을 의미합니다.'
  },
  {
    id: 'vid-3',
    title: '플라스틱의 일생과 미세플라스틱: 우리가 매주 신용카드 1장씩 먹고 있다?',
    channel: '세계자연기금(WWF) 교육채널',
    category: '재활용과학',
    duration: '09:50',
    youtubeId: 'IA9O9YUbQew',
    summary: '석유 추출부터 생산, 소비, 해양 유출까지 플라스틱의 탄소 배출과 미세플라스틱이 먹이사슬을 타고 식탁으로 되돌아오는 생태 순환을 고발합니다.',
    keyPoints: [
      '인간은 매주 약 5g(신용카드 1장 무게)의 미세플라스틱을 음용수와 음식을 통해 섭취',
      '플라스틱 생산 및 소각 과정에서 발생하는 탄소 배출량이 전 세계 항공 산업을 상회',
      '단순 분리수거를 넘어선 "거절하기(Refuse)"와 재사용(Reuse) 중심의 순환경제 전환 필요'
    ],
    presenterTakeaway: '재활용은 최선의 수단이 아닌 차선책입니다. 1회용 플라스틱 생산과 소비 자체를 줄여야 합니다.'
  },
  {
    id: 'vid-4',
    title: '탄소중립 2050 실현 로드맵: 신재생 에너지와 시민의 1일 1실천',
    channel: '한국에너지공단 & 탄소중립위원회',
    category: '탄소중립',
    duration: '12:15',
    youtubeId: 'V933tS8eK74',
    summary: '태양광, 풍력, 친환경 모빌리티 기술의 현주소와 시민들이 일상생활 속에서 실질적으로 탄소를 줄일 수 있는 고효율 액션 플랜을 안내합니다.',
    keyPoints: [
      '전력 생산 부문 탈석탄화 및 스마트 그리드 기반 신재생 에너지 전환 가속',
      '건물 단열 효율화 및 수송 부문 대중교통·전기차 전환의 이산화탄소 저감량 수치화',
      '음식물 쓰레기 20% 줄이기만으로 승용차 수백만 대 분량의 온실가스 감축 효과'
    ],
    presenterTakeaway: '탄소중립은 정부나 기업만의 과제가 아니며, 개인의 매일 소비 선택이 모여 시장과 정책을 바꿉니다.'
  }
];

export const CHARACTER_STAGES = [
  {
    level: 1,
    title: '생명의 씨앗',
    badge: '새싹의 시작',
    maxExp: 100,
    dialogues: [
      '안녕하세요! 지구를 아끼는 마음으로 저를 틔워주세요.',
      '분리배출 퀴즈와 게임을 하면 제가 무럭무럭 자라나요!',
      '오늘 텀블러를 챙기셨나요? 지구 온도를 1도 낮출 수 있어요.'
    ]
  },
  {
    level: 2,
    title: '푸른 어린잎',
    badge: '초록 수호자',
    maxExp: 250,
    dialogues: [
      '잎사귀가 돋아났어요! 탄소를 쏙쏙 흡수하고 있답니다.',
      'AI 포스터를 전시관에 올리면 더 많은 사람들에게 지구의 목소리를 전할 수 있어요.',
      '올바른 분리배출 4대 원칙, 절대 잊지 마세요!'
    ]
  },
  {
    level: 3,
    title: '성장한 묘목',
    badge: '숲의 벗',
    maxExp: 500,
    dialogues: [
      '줄기가 단단해졌어요! 시원한 그늘과 맑은 산소를 선물할게요.',
      '기후 퀴즈 100점에 도전해보세요! 지구 지식이 쑥쑥 늘어납니다.',
      '대중교통을 이용하는 것만으로도 소나무 몇 그루를 심는 효과가 있어요.'
    ]
  },
  {
    level: 4,
    title: '지구 수호목',
    badge: '행성 지킴이',
    maxExp: 1000,
    dialogues: [
      '당신의 꾸준한 실천 덕분에 거대한 녹색 숲의 수호목이 되었습니다!',
      '우리가 함께 지켜낸 지구의 푸른 하늘, 정말 눈부시지 않나요?',
      '이제 당신은 진정한 에코 앰버서더입니다. 주변에도 널리 알려주세요!'
    ]
  }
];
