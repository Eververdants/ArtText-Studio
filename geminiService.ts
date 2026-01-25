
import { GoogleGenAI, Type } from "@google/genai";
import { AIAnalysisResult, MoodType } from "./types";

// Initialize with a single named parameter 'apiKey' exactly as per guidelines
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeTextForStyle = async (text: string, mood?: MoodType): Promise<AIAnalysisResult> => {
  try {
    // Using gemini-3-flash-preview for text analysis and recommendation tasks
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

    // Access the .text property directly (not a method)
    const jsonStr = response.text?.trim() || '{}';
    return JSON.parse(jsonStr) as AIAnalysisResult;
  } catch (error) {
    console.error("Analysis Error:", error);
    return {
      recommendedVibe: "Modern",
      suggestedStyleId: "minimal-zen",
      explanation: "Fallback style applied.",
      bgPrompt: "abstract soft gradient background"
    };
  }
};

export const generateBackground = async (prompt: string): Promise<string | null> => {
  try {
    // Using gemini-2.5-flash-image for nano banana series image generation
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: `High quality artistic abstract background, ${prompt}. Minimalistic, no text, soft lighting, depth of field.` }]
      }
    });

    // Iterate through candidates and parts to find the inline image data
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
