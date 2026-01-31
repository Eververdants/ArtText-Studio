
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult, MoodType } from "../types/index";

const getApiKey = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('gemini_api_key') || null;
};

let ai: GoogleGenAI | null = null;

const initializeAI = () => {
  const apiKey = getApiKey();
  if (apiKey) {
    try {
      ai = new GoogleGenAI({ apiKey });
    } catch (error) {
      console.warn("Failed to initialize GoogleGenAI:", error);
    }
  }
};

if (typeof window !== 'undefined') {
  initializeAI();
  window.addEventListener('storage', () => {
    initializeAI();
  });
}

export const analyzeTextForStyle = async (text: string, mood?: MoodType): Promise<AIAnalysisResult> => {
  if (!ai) {
    return {
      recommendedVibe: "Modern",
      suggestedStyleId: "minimal-zen",
      explanation: "AI analysis not available. Please set GEMINI_API_KEY to enable AI features.",
      bgPrompt: "abstract soft gradient background"
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze this text: "${text}". Mood preference: ${mood || 'Any'}. 
      Recommend a visual style and provide a prompt for an abstract background image.
      Return JSON: { "recommendedVibe": string, "suggestedStyleId": string, "explanation": string, "bgPrompt": string }.
      Style IDs: minimal-zen, cyber-dark, traditional-ink, modern-bold, romantic-script.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            recommendedVibe: { type: Type.STRING },
            suggestedStyleId: { type: Type.STRING },
            explanation: { type: Type.STRING },
            bgPrompt: { type: Type.STRING }
          },
          required: ["recommendedVibe", "suggestedStyleId", "explanation", "bgPrompt"],
          propertyOrdering: ["recommendedVibe", "suggestedStyleId", "explanation", "bgPrompt"]
        }
      }
    });

    const jsonStr = response.text?.trim() || '{}';
    return JSON.parse(jsonStr) as AIAnalysisResult;
  } catch (error) {
    console.error("Analysis Error:", error);
    return {
      recommendedVibe: "Modern",
      suggestedStyleId: "minimal-zen",
      explanation: "Analysis failed. Using fallback style.",
      bgPrompt: "abstract soft gradient background"
    };
  }
};

export const generateBackground = async (prompt: string): Promise<string | null> => {
  if (!ai) {
    return null;
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `High quality artistic abstract background, ${prompt}. Minimalistic, no text, soft lighting, depth of field.` }]
      }
    });

    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString: string = part.inlineData.data;
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Image Generation Error:", error);
    return null;
  }
};
