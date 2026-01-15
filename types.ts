export enum GameGenre {
  FANTASY = 'Fantasy',
  SCIFI = 'Sci-Fi',
  CYBERPUNK = 'Cyberpunk',
  NOIR = 'Noir Detective',
  PIRATE = 'Golden Age of Piracy',
  POST_APOCALYPTIC = 'Post-Apocalyptic',
  ELDRIITCH = 'Lovecraftian Horror'
}

export interface GameSettings {
  genre: GameGenre;
  protagonistName: string;
  role: string;
  trait: string;
  language: string;
}

export interface SceneOption {
  text: string;
  intent: string;
}

export interface MusicConfig {
  mood: 'epic' | 'mysterious' | 'ominous' | 'melancholic' | 'cybernetic' | 'peaceful' | 'action';
  tempo: 'slow' | 'medium' | 'fast';
}

export interface SceneData {
  id: number;
  narrative: string; // The main story text
  dialogue?: string; // Specific spoken lines if any
  visualPrompt: string; // The prompt used to generate the image
  options: SceneOption[];
  musicConfig: MusicConfig; // Generative music settings
  imageBase64?: string; // The generated image data
  audioBase64?: string; // The generated audio narration
}

export interface HistoryItem {
  role: 'user' | 'model';
  parts: Array<{ text: string }>;
}