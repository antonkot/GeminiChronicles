import { GoogleGenAI, Type, Modality } from "@google/genai";
import { SceneData, GameSettings, HistoryItem } from "../types";

// 1. Generate the Story Scene (Text Logic)
export const generateNextScene = async (
  apiKey: string,
  settings: GameSettings,
  history: HistoryItem[],
  action?: string
): Promise<SceneData> => {
  const ai = new GoogleGenAI({ apiKey });

  // Prompt Construction
  const systemInstruction = `
    You are an advanced Visual Novel engine. 
    Settings: Genre=${settings.genre}, Hero=${settings.protagonistName}, Role=${settings.role}, Trait=${settings.trait}.
    Target Language: ${settings.language}.
    
    Your task is to generate the next scene in the story.
    
    CRITICAL INSTRUCTION:
    The "narrative", "dialogue", and "options[].text" fields MUST be written in ${settings.language}.
    The "visualPrompt" and "musicConfig" must remain in English/Technical format.
    
    Output JSON format:
    {
      "narrative": "Descriptive text of what is happening, setting the scene (in ${settings.language}).",
      "dialogue": "Optional spoken text by characters (in ${settings.language}).",
      "visualPrompt": "A highly detailed, artistic description of the current scene for an image generator. Include style keywords matching the genre (e.g. 'cinematic lighting', 'oil painting style' for fantasy, 'digital art' for sci-fi). Do not include text in the image. (Write this in English).",
      "musicConfig": {
        "mood": "epic|mysterious|ominous|melancholic|cybernetic|peaceful|action",
        "tempo": "slow|medium|fast"
      },
      "options": [
        { "text": "Action choice 1 (in ${settings.language})", "intent": "Description of intent (in English)" },
        { "text": "Action choice 2 (in ${settings.language})", "intent": "Description of intent (in English)" },
        { "text": "Action choice 3 (in ${settings.language})", "intent": "Description of intent (in English)" }
      ]
    }
    
    Music Mood Guide:
    - epic: Major scales, heroic, broad.
    - mysterious: Dorian/Minor, inquisitive, light tension.
    - ominous: Phrygian/Locrian, dark, dangerous, horror.
    - melancholic: Minor, slow, sad, emotional.
    - cybernetic: Techy, repetitive, synthetic, futuristic.
    - peaceful: Lydian/Major, calm, nature.
    - action: Fast, rhythmic, intense.
    
    Keep the narrative engaging but concise (under 150 words). Provide 2-4 distinct choices.
  `;

  let prompt = action ? `Player chose: ${action}. Generate the next scene consequences and situation.` : `Start the story.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview", 
    contents: [
      ...history,
      { role: 'user', parts: [{ text: prompt }] }
    ],
    config: {
      systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          narrative: { type: Type.STRING },
          dialogue: { type: Type.STRING },
          visualPrompt: { type: Type.STRING },
          musicConfig: {
             type: Type.OBJECT,
             properties: {
               mood: { type: Type.STRING, enum: ["epic", "mysterious", "ominous", "melancholic", "cybernetic", "peaceful", "action"] },
               tempo: { type: Type.STRING, enum: ["slow", "medium", "fast"] }
             },
             required: ["mood", "tempo"]
          },
          options: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                intent: { type: Type.STRING }
              },
              required: ["text", "intent"]
            }
          }
        },
        required: ["narrative", "visualPrompt", "options", "musicConfig"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from Gemini");

  const data = JSON.parse(text) as Omit<SceneData, 'id'>;
  
  return {
    ...data,
    id: Date.now(),
  };
};

// 2. Generate the Visuals
export const generateSceneImage = async (apiKey: string, visualPrompt: string): Promise<string | undefined> => {
  const ai = new GoogleGenAI({ apiKey });
  
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: [
        { text: visualPrompt }
      ],
      config: {
        // We use generateContent for nano banana series as per instructions
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return part.inlineData.data; // Base64 string
      }
    }
  } catch (e) {
    console.error("Image generation failed", e);
    return undefined;
  }
  return undefined;
};

// 3. Generate the Narration (Multi-speaker TTS)
export const generateNarration = async (apiKey: string, narrative: string, dialogue?: string): Promise<string | undefined> => {
  const ai = new GoogleGenAI({ apiKey });

  let script = `Narrator: ${narrative}`;
  if (dialogue) {
    script += `\nProtagonist: ${dialogue}`;
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: script }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          multiSpeakerVoiceConfig: {
            speakerVoiceConfigs: [
              {
                speaker: 'Narrator',
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Fenrir' } } 
              },
              {
                speaker: 'Protagonist',
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } }
              }
            ]
          }
        },
      },
    });

    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
  } catch (e) {
    console.error("TTS failed", e);
    return undefined;
  }
};