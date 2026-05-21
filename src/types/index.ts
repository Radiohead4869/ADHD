export type AnchorId = string;
export type PatternId = string;
export type SessionId = string;

export interface Anchor {
  id: AnchorId;
  name: string;
  description: string;
  consequence: string; // "如果我破坏了这个锚点的规则，我真正失去的是什么？"
  createdAt: number;
  chainLength: number;
  isActive: boolean;
  allowedExceptions: string[]; // List of permanently allowed exceptions
}

export interface FocusSession {
  id: SessionId;
  anchorId: AnchorId;
  startTime: number;
  endTime?: number;
  duration: number; // in seconds
  status: 'ongoing' | 'completed' | 'interrupted' | 'delayed';
  delayEndTime?: number; // For 15-min delay
}

export interface Pattern {
  id: PatternId;
  name: string;
  description: string;
  parentId: PatternId | null; // For Pattern Tree
  status: 'active' | 'failed' | 'rooted';
  createdAt: number;
}

export interface DailyRecord {
  date: string; // YYYY-MM-DD
  name: string; // 每日命名
  achievement: string;
}

export interface BingoTask {
  id: string;
  text: string;
  completed: boolean;
}

export interface AppState {
  anchors: Anchor[];
  sessions: FocusSession[];
  patterns: Pattern[];
  dailyRecords: Record<string, DailyRecord>;
  bingoTasks: BingoTask[];
  currentSessionId: SessionId | null;
  
  // Actions
  addAnchor: (anchor: Omit<Anchor, 'id' | 'createdAt' | 'chainLength' | 'isActive' | 'allowedExceptions'>) => void;
  startSession: (anchorId: AnchorId, withDelay?: boolean) => void;
  endSession: (sessionId: SessionId, status: FocusSession['status']) => void;
  addException: (anchorId: AnchorId, exception: string) => void;
  resetChain: (anchorId: AnchorId) => void;
  addPattern: (pattern: Omit<Pattern, 'id' | 'createdAt' | 'status'>) => void;
  updatePatternStatus: (patternId: PatternId, status: Pattern['status']) => void;
  reorderPatterns: (patterns: Pattern[]) => void;
  setDailyName: (date: string, name: string, achievement: string) => void;
  addBingoTask: (text: string) => void;
  toggleBingoTask: (id: string) => void;
  removeBingoTask: (id: string) => void;
  clearBingoBoard: () => void;
}
