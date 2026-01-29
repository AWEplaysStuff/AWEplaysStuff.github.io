import React from 'react';
import { Bot, Sparkles } from 'lucide-react';

interface AICommentaryProps {
  commentary: string;
  loading: boolean;
  type: 'live' | 'result';
}

const AICommentary: React.FC<AICommentaryProps> = ({ commentary, loading, type }) => {
  if (!commentary && !loading) return null;

  return (
    <div className={`relative p-6 rounded-2xl border ${type === 'live' ? 'bg-indigo-900/30 border-indigo-500/30' : 'bg-emerald-900/30 border-emerald-500/30'} backdrop-blur-sm overflow-hidden`}>
      <div className="absolute top-0 right-0 -mt-2 -mr-2 w-16 h-16 bg-gradient-to-br from-white/10 to-transparent rounded-full blur-xl"></div>
      
      <div className="flex items-start space-x-4 relative z-10">
        <div className={`p-3 rounded-full ${type === 'live' ? 'bg-indigo-600' : 'bg-emerald-600'} shadow-lg`}>
          {loading ? <Sparkles className="w-6 h-6 animate-spin text-white" /> : <Bot className="w-6 h-6 text-white" />}
        </div>
        
        <div className="flex-1">
          <h3 className={`font-bold mb-1 uppercase text-xs tracking-wider ${type === 'live' ? 'text-indigo-400' : 'text-emerald-400'}`}>
            {type === 'live' ? 'Live Analyse' : 'Fazit der KI'}
          </h3>
          <div className="text-slate-200 text-lg leading-relaxed italic">
            {loading ? (
              <span className="animate-pulse">Analysiere Wettquoten...</span>
            ) : (
              `"${commentary}"`
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AICommentary;