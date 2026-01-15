import React, { useState, useEffect, useRef } from 'react';
import { GameSettings, SceneData, SceneOption, HistoryItem } from './types';
import { generateNextScene, generateSceneImage, generateNarration } from './services/geminiService';
import SetupScreen from './components/SetupScreen';
import GameScreen from './components/GameScreen';

function App() {
  const [settings, setSettings] = useState<GameSettings | null>(null);
  const [currentScene, setCurrentScene] = useState<SceneData | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Cache for storing promises of future scenes
  // Key: Index of the option in the current scene
  const prefetchCache = useRef<Record<number, Promise<SceneData>>>({});

  const apiKey = process.env.API_KEY || '';

  // --- CORE GENERATION LOGIC ---
  const performSceneGeneration = async (
    gameSettings: GameSettings, 
    historyContext: HistoryItem[], 
    action?: string
  ): Promise<SceneData> => {
    // 1. Generate Text Structure
    const sceneData = await generateNextScene(apiKey, gameSettings, historyContext, action);

    // 2. Parallel Generate Assets (Image & Audio)
    // We catch errors individually so a failed image/audio doesn't crash the whole game flow
    const imagePromise = generateSceneImage(apiKey, sceneData.visualPrompt)
      .catch(e => { console.error(e); return undefined; });
      
    const audioPromise = generateNarration(apiKey, sceneData.narrative, sceneData.dialogue)
      .catch(e => { console.error(e); return undefined; });

    const [imageBase64, audioBase64] = await Promise.all([imagePromise, audioPromise]);

    return {
      ...sceneData,
      imageBase64,
      audioBase64
    };
  };

  // --- PRE-GENERATION EFFECT ---
  // Whenever the current scene updates, we start generating the NEXT possible scenes
  useEffect(() => {
    if (!currentScene || !settings) return;

    // Clear previous cache
    prefetchCache.current = {};

    // Construct the base history that includes the current scene we just landed on
    const baseHistoryForNextStep = [
      ...history,
      { role: 'model' as const, parts: [{ text: currentScene.narrative }] }
    ];

    // Speculatively generate the result for EACH option
    currentScene.options.forEach((option, index) => {
      const branchHistory = [
        ...baseHistoryForNextStep,
        { role: 'user' as const, parts: [{ text: `I choose to: ${option.text}` }] }
      ];

      // Store the running promise in the cache
      // We do not await here; we let it run in the background
      prefetchCache.current[index] = performSceneGeneration(settings, branchHistory, option.intent)
        .catch(err => {
          console.warn(`Prefetch failed for option ${index}`, err);
          throw err; // Re-throw to be handled when accessed
        });
    });
    
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScene?.id]); // Only run when we actually have a NEW scene ID


  // --- HANDLERS ---

  const handleStartGame = async (newSettings: GameSettings) => {
    setSettings(newSettings);
    setLoading(true);
    setError(null);
    try {
      const scene = await performSceneGeneration(newSettings, []);
      setCurrentScene(scene);
    } catch (err: any) {
      console.error(err);
      setError("Failed to start the story. Please try again.");
      setSettings(null);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = async (option: SceneOption) => {
    if (!settings || !currentScene) return;

    const optionIndex = currentScene.options.indexOf(option);
    setLoading(true);

    // Update History immediately
    const nextHistory: HistoryItem[] = [
      ...history,
      { role: 'model', parts: [{ text: currentScene.narrative }] },
      { role: 'user', parts: [{ text: `I choose to: ${option.text}` }] }
    ];
    setHistory(nextHistory);

    try {
      let nextSceneData: SceneData;

      // Check if we have a pre-calculated result for this option
      if (prefetchCache.current[optionIndex]) {
        console.log("Using prefetched scene data");
        nextSceneData = await prefetchCache.current[optionIndex];
      } else {
        console.log("Cache miss or invalid, generating fresh...");
        nextSceneData = await performSceneGeneration(settings, nextHistory, option.intent);
      }

      setCurrentScene(nextSceneData);
    } catch (err) {
      console.error("Transition failed", err);
      // Fallback: Try generating fresh if prefetch failed cleanly
      try {
        console.log("Retry generating fresh after error...");
        const retryScene = await performSceneGeneration(settings, nextHistory, option.intent);
        setCurrentScene(retryScene);
      } catch (retryErr) {
        setError("The story path crumbled. Please try selecting again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- RENDER ---

  if (!settings) {
    return <SetupScreen onStart={handleStartGame} />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white p-4 text-center">
        <div className="max-w-md">
           <h2 className="text-2xl text-red-400 mb-4 font-title">Connection Lost</h2>
           <p className="mb-6 text-slate-300">{error}</p>
           <button 
             onClick={() => window.location.reload()}
             className="px-6 py-2 bg-slate-700 rounded hover:bg-slate-600 transition-colors"
           >
             Return to Menu
           </button>
        </div>
      </div>
    );
  }

  if (currentScene) {
    return (
      <GameScreen 
        scene={currentScene} 
        isLoading={loading} 
        onOptionSelect={handleOptionSelect}
        language={settings.language}
      />
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
        <div className="text-indigo-400 animate-pulse font-title">Manifesting Reality...</div>
      </div>
    </div>
  );
}

export default App;