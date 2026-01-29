import React from 'react';
import { Bet } from '../types';
import { User, Clock } from 'lucide-react';

interface BetListProps {
  bets: Bet[];
}

const BetList: React.FC<BetListProps> = ({ bets }) => {
  // Sort bets by time
  const sortedBets = [...bets].sort((a, b) => a.guessedTime.localeCompare(b.guessedTime));

  if (bets.length === 0) {
    return (
      <div className="text-center py-10 bg-slate-800/50 rounded-2xl border border-dashed border-slate-700">
        <p className="text-slate-400">Noch keine Tipps abgegeben. Sei der Erste!</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700">
      <h2 className="text-xl font-bold mb-4 flex items-center text-blue-400">
        <User className="w-5 h-5 mr-2" />
        Aktuelle Wetten ({bets.length})
      </h2>
      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        {sortedBets.map((bet) => (
          <div key={bet.id} className="flex justify-between items-center bg-slate-900 p-4 rounded-xl border border-slate-700/50 hover:border-slate-600 transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold">
                {bet.name.charAt(0).toUpperCase()}
              </div>
              <span className="font-medium text-slate-200">{bet.name}</span>
            </div>
            <div className="flex items-center text-orange-400 font-mono text-lg font-bold bg-orange-400/10 px-3 py-1 rounded-md">
              <Clock className="w-4 h-4 mr-2" />
              {bet.guessedTime}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BetList;