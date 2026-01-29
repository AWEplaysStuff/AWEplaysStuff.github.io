import React, { useState } from 'react';
import { Plus, Clock } from 'lucide-react';
import { User } from '../types';

interface BetFormProps {
  currentUser: User;
  onPlaceBet: (time: string) => void;
  disabled: boolean;
}

const BetForm: React.FC<BetFormProps> = ({ currentUser, onPlaceBet, disabled }) => {
  const [time, setTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (time) {
      onPlaceBet(time);
      setTime('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-slate-800 p-6 rounded-2xl shadow-lg border border-slate-700">
      <h2 className="text-xl font-bold mb-4 flex items-center text-orange-400">
        <Plus className="w-5 h-5 mr-2" />
        Tipp abgeben
      </h2>
      
      <div className="space-y-4">
        <div className="p-3 bg-slate-900 rounded-lg border border-slate-700 flex justify-between items-center">
            <span className="text-slate-400 text-sm">Spieler:</span>
            <span className="font-bold text-white">{currentUser.name}</span>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-400 mb-1">Wann kommt Kira?</label>
          <div className="relative">
            <Clock className="absolute left-3 top-3.5 w-5 h-5 text-slate-500" />
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              disabled={disabled}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 pl-10 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all disabled:opacity-50 [color-scheme:dark]"
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={disabled || !time}
          className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
        >
          {disabled ? 'Wetten geschlossen' : 'Jetzt wetten'}
        </button>
      </div>
    </form>
  );
};

export default BetForm;