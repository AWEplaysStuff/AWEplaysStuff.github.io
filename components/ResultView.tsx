import React from 'react';
import { Result } from '../types';
import { Trophy, Clock, AlertTriangle } from 'lucide-react';

interface ResultViewProps {
  results: Result[];
  actualTime: string;
  aiCommentary: string;
}

const ResultView: React.FC<ResultViewProps> = ({ results, actualTime, aiCommentary }) => {
  const winner = results[0];

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="bg-gradient-to-b from-yellow-500/20 to-slate-800 border border-yellow-500/50 p-8 rounded-3xl text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent"></div>
        
        <Trophy className="w-20 h-20 text-yellow-400 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)] animate-bounce" />
        
        <h2 className="text-3xl font-bold text-white mb-2">Gewinner: {winner.bet.name}</h2>
        <p className="text-slate-400 mb-6">Mit einem Tipp von <span className="text-yellow-400 font-bold">{winner.bet.guessedTime}</span></p>
        
        <div className="inline-block bg-slate-900/80 px-6 py-3 rounded-xl border border-slate-700">
          <div className="text-sm text-slate-500 uppercase tracking-widest mb-1">Kiras Ankunft</div>
          <div className="text-4xl font-mono font-bold text-red-500">{actualTime}</div>
        </div>
        
        <div className="mt-6 text-sm text-slate-400">
           Differenz: {winner.diffMinutes} Minuten
        </div>
      </div>

      <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700">
         <h3 className="text-lg font-bold mb-4 text-slate-300">Bestenliste</h3>
         <div className="space-y-2">
            {results.slice(0, 5).map((result, idx) => (
                <div key={result.bet.id} className={`flex items-center justify-between p-3 rounded-lg ${idx === 0 ? 'bg-yellow-500/10 border border-yellow-500/30' : 'bg-slate-900'}`}>
                    <div className="flex items-center gap-3">
                        <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${idx === 0 ? 'bg-yellow-500 text-black' : 'bg-slate-700 text-slate-300'}`}>
                            {idx + 1}
                        </span>
                        <span>{result.bet.name}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                        <span className="text-slate-400">Tipp: {result.bet.guessedTime}</span>
                        <span className={`font-mono font-bold ${result.diffMinutes === 0 ? 'text-green-400' : 'text-orange-400'}`}>
                            +{result.diffMinutes}m
                        </span>
                    </div>
                </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default ResultView;