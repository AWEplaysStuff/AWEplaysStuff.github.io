import { User, Bet } from '../types';
import { v4 as uuidv4 } from 'uuid';

const USERS_KEY = 'kira_tracker_users';
const CURRENT_USER_ID_KEY = 'kira_tracker_current_user_id';

export const getUsers = (): User[] => {
  const stored = localStorage.getItem(USERS_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  const index = users.findIndex(u => u.id === user.id);
  if (index >= 0) {
    users[index] = user;
  } else {
    users.push(user);
  }
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const loginOrCreateUser = (name: string): User => {
  const users = getUsers();
  let user = users.find(u => u.name.toLowerCase() === name.toLowerCase());
  
  if (!user) {
    user = {
      id: uuidv4(),
      name,
      joinedAt: Date.now(),
      stats: {
        totalBets: 0,
        totalWins: 0,
        totalDiffMinutes: 0,
        history: []
      },
      notificationsEnabled: false
    };
    saveUser(user);
  }
  
  localStorage.setItem(CURRENT_USER_ID_KEY, user.id);
  return user;
};

export const getCurrentUser = (): User | null => {
  const id = localStorage.getItem(CURRENT_USER_ID_KEY);
  if (!id) return null;
  const users = getUsers();
  return users.find(u => u.id === id) || null;
};

export const logout = () => {
  localStorage.removeItem(CURRENT_USER_ID_KEY);
};

export const updateUserStats = (userId: string, bet: Bet, actualTime: string, diffMinutes: number, won: boolean) => {
  const users = getUsers();
  const userIndex = users.findIndex(u => u.id === userId);
  
  if (userIndex >= 0) {
    const user = users[userIndex];
    user.stats.totalBets += 1;
    if (won) user.stats.totalWins += 1;
    user.stats.totalDiffMinutes += diffMinutes;
    
    user.stats.history.unshift({
      date: new Date().toISOString(),
      guessedTime: bet.guessedTime,
      actualTime,
      diff: diffMinutes,
      won
    });
    
    // Keep history manageable
    if (user.stats.history.length > 50) user.stats.history.pop();
    
    users[userIndex] = user;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    return user;
  }
  return null;
};
