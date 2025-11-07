export interface Plan {
  dailyGoal: number;
  memorizationDays: boolean[]; // index 0 = Sunday, ... 6 = Saturday
}

export interface ProgressEntry {
  date: string; // YYYY-MM-DD
  memorizedPages: number;
  revisedPages: number;
}

export type BadgeCategory = 'memorization' | 'revision' | 'consistency';

export interface Badge {
  id: string;
  name: string;
  description: string;
  category: BadgeCategory;
  icon: React.FC<{ className?: string }>;
  checkEarned: (userData: UserData) => boolean;
  getProgress?: (userData: UserData) => { current: number, goal: number } | null;
}


export interface UserData {
  plan: Plan;
  initialMemorizedPages: number;
  progress: ProgressEntry[];
  revisionKhatmaCount: number;
  pagesRevisedInCurrentKhatma: number;
  earnedBadges: string[];
}