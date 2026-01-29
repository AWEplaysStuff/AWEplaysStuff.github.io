import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Bet, Result, User } from './types';
import BetForm from './components/BetForm';
import BetList from './components/BetList';
import ResultView from './components/ResultView';
import AICommentary from './components/AICommentary';
import UserProfile from './components/UserProfile';
import Leaderboard from './components/Leaderboard';
import { generateBettingCommentary, generateWinnerRoast } from './services/geminiService';
import { getCurrentUser, loginOrCreateUser, logout, updateUserStats, saveUser } from './services/storageService';
import { Timer, Skull, LayoutDashboard, UserCircle, Trophy as TrophyIcon, LogIn } from 'lucide-react';

const App: React.FC = () => {
  // Navigation State
  const [currentView, setCurrentView] = useState<'betting' | 'profile' | 'leaderboard'>('betting');
  
  // Data State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [bets, setBets] = useState<Bet[]>([]);
  const [actualTime, setActualTime] = useState<string>('');
  const [results, setResults] = useState<Result[]>([]);
  const [commentary, setCommentary] = useState<string>('');
  const [loadingCommentary, setLoadingCommentary] = useState<boolean>(false);
  const [gameState, setGameState] = useState<'betting' | 'calculating' | 'finished'>('betting');
  const [loginName, setLoginName] = useState('');

  // Load User on Mount
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
        setCurrentUser(user);
    }
  }, []);

  // Check notification permission on mount
  useEffect(() => {
    if (currentUser?.notificationsEnabled && 'Notification' in window) {
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }
    }
  }, [currentUser]);

  // Convert "HH:MM" to minutes from midnight
  const timeToMinutes = (timeStr: string): number => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return hours * 60 + minutes;
  };

  const sendNotification = (title: string, body: string) => {
    if ('Notification' in window && Notification.permission === 'granted') {
        new Notification(title, { body, icon: '/favicon.ico' });
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginName.trim()) {
        const user = loginOrCreateUser(loginName.trim());
        setCurrentUser(user);
        setLoginName('');
    }
  };

  const handleLogout = () => {
    logout();
    setCurrentUser(null);
    setCurrentView('betting');
  };

  const handleToggleNotifications = () => {
     if (!currentUser) return;
     
     if ('Notification' in window) {
         if (Notification.permission !== 'granted') {
             Notification.requestPermission().then(permission => {
                 if (permission === 'granted') {
                     const updated = { ...currentUser, notificationsEnabled: true };
                     saveUser(updated);
                     setCurrentUser(updated);
                     sendNotification("Benachrichtigungen aktiviert", "Du wirst informiert, wenn Kira ankommt!");
                 }
             });
         } else {
             const updated = { ...currentUser, notificationsEnabled: !currentUser.notificationsEnabled };
             saveUser(updated);
             setCurrentUser(updated);
         }
     }
  };

  const handlePlaceBet = async (time: string) => {
    if (!currentUser) return;

    // Remove existing bet for this user if they want to change it (optional logic, but keeps it 1 bet per user per round)
    const existingBetIndex = bets.findIndex(b => b.userId === currentUser.id);
    let newBetsList = [...bets];
    
    const newBet: Bet = {
      id: uuidv4(),
      userId: currentUser.id,
      name: currentUser.name,
      guessedTime: time,
      timestamp: Date.now(),
    };

    if (existingBetIndex >= 0) {
        newBetsList[existingBetIndex] = newBet;
    } else {
        newBetsList.push(newBet);
    }
    
    setBets(newBetsList);

    // AI Commentary logic
    if (newBetsList.length === 1 || newBetsList.length % 3 === 0) {
      setLoadingCommentary(true);
      const text = await generateBettingCommentary(newBetsList);
      setCommentary(text);
      setLoadingCommentary(false);
    }
  };

  const handleKiraArrival = async () => {
    if (!actualTime) return;
    
    setGameState('calculating');
    
    const actualMinutes = timeToMinutes(actualTime);
    
    const calculatedResults: Result[] = bets.map(bet => ({
      bet,
      diffMinutes: Math.abs(timeToMinutes(bet.guessedTime) - actualMinutes),
      rank: 0,
    }));
    
    // Sort by smallest difference
    calculatedResults.sort((a, b) => a.diffMinutes - b.diffMinutes);
    
    // Assign ranks and update stats
    calculatedResults.forEach((res, idx) => {
        res.rank = idx + 1;
        const isWinner = idx === 0; // First place is winner
        // We only persist stats if there's a user associated (which there should be)
        if (res.bet.userId) {
            const updatedUser = updateUserStats(res.bet.userId, res.bet, actualTime, res.diffMinutes, isWinner);
            // If the updated user is the current user, update state
            if (updatedUser && currentUser && updatedUser.id === currentUser.id) {
                setCurrentUser(updatedUser);
            }
        }
    });
    
    setResults(calculatedResults);

    // Notify users who enabled notifications
    if (currentUser?.notificationsEnabled) {
        sendNotification("Kira ist da!", `Angekommen um ${actualTime}. Sieh dir die Ergebnisse an!`);
    }

    // Generate Roast/Congrats
    if (calculatedResults.length > 0) {
      setLoadingCommentary(true);
      const roast = await generateWinnerRoast(
        calculatedResults[0].bet.name,
        actualTime,
        actualMinutes - (8 * 60) 
      );
      setCommentary(roast);
      setLoadingCommentary(false);
    }
    
    setGameState('finished');
  };

  if (!currentUser) {
    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
            <div className="max-w-md w-full bg-slate-800 p-8 rounded-3xl border border-slate-700 shadow-2xl">
                <div className="flex justify-center mb-6">
                    <div className="bg-orange-500 p-3 rounded-2xl">
                         <Timer className="w-10 h-10 text-white" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-white text-center mb-2">Kira Delay Tracker</h1>
                <p className="text-slate-400 text-center mb-8">Erstelle ein Profil, um deinen Platz in der Ruhmeshalle der Warter zu sichern.</p>
                
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-1">Dein Name / Spitzname</label>
                        <input 
                            type="text" 
                            className="w-full bg-slate-900 border border-slate-600 rounded-xl p-4 text-white focus:ring-2 focus:ring-orange-500 outline-none transition-all"
                            placeholder="z.B. Chronisch Pünktlich"
                            value={loginName}
                            onChange={(e) => setLoginName(e.target.value)}
                            required
                        />
                    </div>
                    <button 
                        type="submit"
                        disabled={!loginName.trim()}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2"
                    >
                        <LogIn className="w-5 h-5" />
                        Los geht's
                    </button>
                </form>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-slate-200 pb-24">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
                <div className="bg-orange-500 p-2 rounded-lg">
                    <Timer className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-xl font-bold text-white tracking-tight hidden sm:block">Kira Delay Tracker</h1>
                    <h1 className="text-xl font-bold text-white tracking-tight sm:hidden">KDT</h1>
                </div>
            </div>
            <div className="flex items-center gap-3">
                {gameState === 'betting' && (
                    <div className="px-3 py-1 bg-green-500/10 border border-green-500/50 text-green-400 text-xs font-bold rounded-full uppercase tracking-wider animate-pulse">
                        Live
                    </div>
                )}
                <div className="bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium text-slate-300">{currentUser.name}</span>
                </div>
            </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        
        {/* Navigation Content Switch */}
        {currentView === 'profile' ? (
            <UserProfile 
                user={currentUser} 
                onToggleNotifications={handleToggleNotifications}
                onLogout={handleLogout}
            />
        ) : currentView === 'leaderboard' ? (
            <Leaderboard />
        ) : (
            <>
                {/* Game Logic (Betting View) */}
                {gameState === 'betting' && (
                <section className="text-center space-y-2 mb-8 animate-fade-in">
                    <h2 className="text-3xl font-bold text-white">Wann kommt Kira heute?</h2>
                    <p className="text-slate-400 max-w-md mx-auto">
                    Die Uhr tickt. Gib deinen Tipp ab.
                    </p>
                </section>
                )}

                <AICommentary 
                    commentary={commentary} 
                    loading={loadingCommentary} 
                    type={gameState === 'finished' ? 'result' : 'live'} 
                />

                {gameState === 'betting' ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        <BetForm 
                            currentUser={currentUser} 
                            onPlaceBet={handlePlaceBet} 
                            disabled={bets.some(b => b.userId === currentUser.id)} 
                        />
                        
                        {/* Only show 'Change Bet' hint if user already bet */}
                        {bets.some(b => b.userId === currentUser.id) && (
                            <p className="text-xs text-center text-slate-500">
                                Du hast bereits gewettet. Ein neuer Tipp überschreibt den alten.
                            </p>
                        )}

                        {/* Admin Trigger */}
                        <div className="bg-slate-800 p-6 rounded-2xl border border-red-900/50 mt-8">
                            <h3 className="text-red-400 font-bold mb-3 flex items-center">
                                <Skull className="w-5 h-5 mr-2" />
                                Reality Check
                            </h3>
                            <div className="flex gap-2">
                                <input 
                                    type="time" 
                                    className="bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-2 w-full focus:ring-2 focus:ring-red-500 outline-none [color-scheme:dark]"
                                    value={actualTime}
                                    onChange={(e) => setActualTime(e.target.value)}
                                />
                                <button 
                                    onClick={handleKiraArrival}
                                    disabled={!actualTime || bets.length === 0}
                                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold disabled:opacity-50"
                                >
                                    Check
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <div className="h-full">
                        <BetList bets={bets} />
                    </div>
                </div>
                ) : (
                <div className="space-y-6">
                    <ResultView 
                        results={results} 
                        actualTime={actualTime} 
                        aiCommentary={commentary} 
                    />
                    <div className="text-center">
                        <button 
                            onClick={() => {
                                setBets([]);
                                setActualTime('');
                                setResults([]);
                                setCommentary('');
                                setGameState('betting');
                            }}
                            className="text-slate-400 hover:text-white underline underline-offset-4"
                        >
                            Neue Runde starten
                        </button>
                    </div>
                </div>
                )}
            </>
        )}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-slate-800 border-t border-slate-700 pb-safe z-40">
        <div className="max-w-3xl mx-auto flex justify-around p-2">
            <button 
                onClick={() => setCurrentView('betting')}
                className={`p-3 rounded-xl flex flex-col items-center gap-1 flex-1 transition-colors ${currentView === 'betting' ? 'text-orange-500 bg-slate-700/50' : 'text-slate-400 hover:bg-slate-700/30'}`}
            >
                <LayoutDashboard className="w-6 h-6" />
                <span className="text-xs font-medium">Wetten</span>
            </button>
            <button 
                onClick={() => setCurrentView('leaderboard')}
                className={`p-3 rounded-xl flex flex-col items-center gap-1 flex-1 transition-colors ${currentView === 'leaderboard' ? 'text-orange-500 bg-slate-700/50' : 'text-slate-400 hover:bg-slate-700/30'}`}
            >
                <TrophyIcon className="w-6 h-6" />
                <span className="text-xs font-medium">Topliste</span>
            </button>
            <button 
                onClick={() => setCurrentView('profile')}
                className={`p-3 rounded-xl flex flex-col items-center gap-1 flex-1 transition-colors ${currentView === 'profile' ? 'text-orange-500 bg-slate-700/50' : 'text-slate-400 hover:bg-slate-700/30'}`}
            >
                <UserCircle className="w-6 h-6" />
                <span className="text-xs font-medium">Profil</span>
            </button>
        </div>
      </nav>
    </div>
  );
};

export default App;