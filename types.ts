export interface Bet {
  id: string;
  userId: string; // Link to user
  name: string; // Keep name for display purposes
  guessedTime: string; // Format "HH:MM"
  timestamp: number;
}

export interface Result {
  bet: Bet;
  diffMinutes: number;
  rank: number;
}

export interface User {
  id: string;
  name: string;
  joinedAt: number;
  stats: {
    totalBets: number;
    totalWins: number;
    totalDiffMinutes: number; // For calculating average accuracy
    history: {
      date: string; // ISO date string
      guessedTime: string;
      actualTime: string;
      diff: number;
      won: boolean;
    }[];
  };
  notificationsEnabled: boolean;
}

export interface AIAnalysisResponse {
  commentary: string;
  prediction: string;
}
