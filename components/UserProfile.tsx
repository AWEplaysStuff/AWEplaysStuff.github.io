import React from 'react';
import { User } from '../types';
import { Trophy, Target, History, Bell, BellOff } from 'lucide-react';

interface UserProfileProps {
  user: User;
  onToggleNotifications: () => void;
  onLogout: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ user, onToggleNotifications, onLogout }) => {
  const avgDiff = user.stats.totalBets > 0 
    ? Math.round(user.stats.totalDiffMinutes / user.stats.totalBets) 
    : 0;

  const winRate = user.stats.totalBets > 0
    ? Math.round((user.stats.totalWins / user.stats.totalBets) * 100)
    : 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header Card */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
        
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-6">
             <div>
                <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                <p className="text-slate-400 text-sm">Dabei seit {new Date(user.joinedAt).toLocaleDateString()}</p>
             </div>
             <button 
                onClick={onLogout}
                className="text-xs text-red-400 hover:text-red-300 underline"
             >
                Abmelden
             </button>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700 text-center">
               <Trophy className="w-5 h-5 text-yellow-500 mx-auto mb-1" />
               <div className="text-xl font-bold text-white">{user.stats.totalWins}</div>
               <div className="text-xs text-slate-400">Siege</div>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700 text-center">
               <Target className="w-5 h-5 text-blue-500 mx-auto mb-1" />
               <div className="text-xl font-bold text-white">{winRate}%</div>
               <div className="text-xs text-slate-400">Win Rate</div>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-700 text-center">
               <History className="w-5 h-5 text-purple-500 mx-auto mb-1" />
               <div className="text-xl font-bold text-white">±{avgDiff}m</div>
               <div className="text-xs text-slate-400">Ø Abweichung</div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-700/30 p-4 rounded-xl">
             <div className="flex items-center gap-3">
                {user.notificationsEnabled ? <Bell className="text-green-400 w-5 h-5" /> : <BellOff className="text-slate-500 w-5 h-5" />}
                <div className="text-sm">
                   <div className="font-bold text-slate-200">Benachrichtigungen</div>
                   <div className="text-xs text-slate-400">Erinnere mich täglich zu wetten</div>
                </div>
             </div>
             <button 
               onClick={onToggleNotifications}
               className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${user.notificationsEnabled ? 'bg-green-500/20 text-green-400' : 'bg-slate-600 text-slate-300'}`}
             >
               {user.notificationsEnabled ? 'An' : 'Aus'}
             </button>
          </div>
        </div>
      </div>

      {/* History */}
      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
         <h3 className="text-lg font-bold mb-4 text-slate-300 flex items-center">
            <History className="w-5 h-5 mr-2" />
            Wett-Historie
         </h3>
         
         <div className="space-y-3">
            {user.stats.history.length === 0 ? (
                <p className="text-slate-500 text-center py-4">Noch keine vergangenen Wetten.</p>
            ) : (
                user.stats.history.map((entry, idx) => (
                    <div key={idx} className="bg-slate-900 p-3 rounded-lg border border-slate-700 flex justify-between items-center text-sm">
                        <div className="text-slate-400">
                            {new Date(entry.date).toLocaleDateString()}
                        </div>
                        <div className="flex gap-4">
                            <span>Tipp: <span className="text-slate-200">{entry.guessedTime}</span></span>
                            <span>Kira: <span className="text-slate-200">{entry.actualTime}</span></span>
                        </div>
                        <div className={`font-mono font-bold ${entry.won ? 'text-yellow-500' : 'text-slate-500'}`}>
                            {entry.won ? 'WIN' : `+${entry.diff}m`}
                        </div>
                    </div>
                ))
            )}
         </div>
      </div>
    </div>
  );
};

export default UserProfile;