export type TabType = 'game' | 'poster' | 'chat' | 'quiz' | 'character' | 'presentation';

export type BinCategoryId =
  | 'general'
  | 'plastic'
  | 'cans'
  | 'paper'
  | 'vinyl'
  | 'glass'
  | 'food'
  | 'battery';

export interface BinCategory {
  id: BinCategoryId;
  name: string;
  shortName: string;
  color: string;
  borderColor: string;
  bgColor: string;
  description: string;
  disposalRules: string[];
}

export interface TrashItem {
  id: string;
  name: string;
  category: BinCategoryId;
  tip: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  commonMistakeNote?: string;
  iconName: string;
}

export interface PosterItem {
  id: string;
  title: string;
  slogan: string;
  subtitle: string;
  author: string;
  category: 'climate' | 'plastic' | 'ocean' | 'forest' | 'energy';
  createdAt: string;
  likes: number;
  layout: 'bold-center' | 'split-dynamic' | 'minimal-editorial' | 'impact-badge';
  palette: {
    bg: string;
    primary: string;
    secondary: string;
    accent: string;
    text: string;
  };
  graphicType: 'earth-melting' | 'clean-ocean' | 'sprout-hands' | 'wind-solar' | 'recycling-loop' | 'polar-bear';
  callToAction: string;
  factTag: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  source?: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  scientificFact: string;
  category: '온난화 메커니즘' | '온실가스' | '해양·빙하' | '탄소중립 정책' | '생태계 위기';
}

export interface LearningVideo {
  id: string;
  title: string;
  channel: string;
  category: '지구온난화' | '해수면상승' | '탄소중립' | '재활용과학';
  duration: string;
  youtubeId: string;
  summary: string;
  keyPoints: string[];
  presenterTakeaway: string;
}

export interface CharacterState {
  name: string;
  level: number;
  exp: number;
  maxExp: number;
  vitality: number; // 0 to 100
  stageTitle: string;
  stageDescription: string;
  mood: 'happy' | 'encouraging' | 'focused' | 'proud';
  activeQuote: string;
  totalEcoPoints: number;
  co2SavedKg: number;
  badges: string[];
  stats: {
    gameScore: number;
    quizzesSolved: number;
    postersMade: number;
    chatsSent: number;
  };
}
