import React from 'react';
import { User } from '../types';
import { Trophy, Medal, Star } from 'lucide-react';
import { getUsers } from '../services/storageService';

const Leaderboard: React.FC = () => {
  const users = getUsers();

  // Logic: 1. Most wins, 2. Lowest Avg Diff, 3. Most Bets
  const sortedUsers = [...users].sort((a, b) => {
    if (b.stats.totalWins !== a.stats.totalWins) {
      return b.stats.totalWins - a.stats.totalWins;
    }
    const avgA = a.stats.totalBets > 0 ? a.stats.totalDiffMinutes / a.stats.totalBets : 999;
    const avgB = b.stats.totalBets > 0 ? b.stats.totalDiffMinutes / b.stats.totalBets : 999;
    return avgA - avgB;
  });

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0: return <Trophy className="w-6 h-6 text-yellow-400" />;
      case 1: return <Medal className="w-6 h-6 text-gray-300" />;
      case 2: return <Medal className="w-6 h-6 text-amber-600" />;
      default: return <span className="text-slate-500 font-bold w-6 text-center">{index + 1}</span>;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">Rangliste</h2>
          <p className="text-slate-400">Die besten Zeitpropheten der Schule</p>
       </div>

       <div className="bg-slate-800 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
          <div className="grid grid-cols-1 divide-y divide-slate-700">
             {sortedUsers.map((user, idx) => {
                const avgDiff = user.stats.totalBets > 0 
                    ? Math.round(user.stats.totalDiffMinutes / user.stats.totalBets) 
                    : '-';
                
                return (
                  <div key={user.id} className={`p-4 flex items-center justify-between hover:bg-slate-700/50 transition-colors ${idx === 0 ? 'bg-yellow-500/5' : ''}`}>
                      <div className="flex items-center gap-4">
                          <div className="w-8 flex justify-center">
                             {getRankIcon(idx)}
                          </div>
                          <div>
                              <div className="font-bold text-white flex items-center gap-2">
                                  {user.name}
                                  {idx === 0 && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />}
                              </div>
                              <div className="text-xs text-slate-500">{user.stats.totalBets} Wetten</div>
                          </div>
                      </div>
                      
                      <div className="flex items-center gap-6 text-right">
                          <div>
                              <div className="text-sm text-slate-400 uppercase text-[10px] tracking-wider">Ø Abweichung</div>
                              <div className="font-mono text-slate-200">±{avgDiff}m</div>
                          </div>
                          <div className="min-w-[50px]">
                               <div className="text-sm text-slate-400 uppercase text-[10px] tracking-wider">Siege</div>
                               <div className="font-bold text-yellow-500 text-lg">{user.stats.totalWins}</div>
                          </div>
                      </div>
                  </div>
                );
             })}
             
             {sortedUsers.length === 0 && (
                <div className="p-8 text-center text-slate-500">
                    Noch keine Daten vorhanden. Fangt an zu wetten!
                </div>
             )}
          </div>
       </div>
    </div>
  );
};

export default Leaderboard;