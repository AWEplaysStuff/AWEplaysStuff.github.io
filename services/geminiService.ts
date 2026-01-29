import { GoogleGenAI } from "@google/genai";
import { Bet } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateBettingCommentary = async (bets: Bet[]): Promise<string> => {
  if (bets.length === 0) return "Noch keine Wetten. Der Markt ist ruhig...";

  const betsList = bets.map(b => `${b.name} tippt auf ${b.guessedTime}`).join(", ");

  const prompt = `
    Kontext: Eine Schülerin namens Kira Steller kommt jeden Tag zu spät. Ihre Klassenkameraden wetten darauf, wann sie heute ankommt.
    
    Hier sind die aktuellen Wetten:
    ${betsList}

    Aufgabe:
    Generiere einen kurzen, lustigen Kommentar (max 2 Sätze) im Stil eines Pferderennen-Kommentators oder Sportanalysten über diese Wetten. 
    Analysiere, ob die Leute optimistisch oder pessimistisch sind. Sei sarkastisch aber freundlich.
    Antworte auf Deutsch.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Kira lässt uns warten, und die KI ist sprachlos.";
  } catch (error) {
    console.error("Error generating commentary:", error);
    return "Die KI rechnet noch die Wahrscheinlichkeit einer pünktlichen Ankunft aus (Error: 0%).";
  }
};

export const generateWinnerRoast = async (winnerName: string, arrivalTime: string, delayMinutes: number): Promise<string> => {
  const prompt = `
    Kira Steller ist endlich da! Sie kam um ${arrivalTime}.
    Der Gewinner der Wette ist ${winnerName}.
    Die Verspätung betrug ca. ${delayMinutes} Minuten (basierend auf Schulbeginn 08:00, nur als Referenz).
    
    Gratuliere dem Gewinner kurz und mach einen Witz über Kiras Zeitmanagement. Antworte auf Deutsch.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Glückwunsch an den Gewinner!";
  } catch (error) {
    console.error("Error generating roast:", error);
    return "Glückwunsch!";
  }
};
