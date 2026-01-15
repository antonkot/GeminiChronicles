import React, { useState, useEffect } from 'react';
import { GameGenre, GameSettings } from '../types';
import { TRANSLATIONS, SUPPORTED_LANGUAGES } from '../constants';
import Button from './Button';
import { BookOpen, User, Sparkles, Languages, ChevronRight, ChevronLeft, Map } from 'lucide-react';

interface SetupScreenProps {
  onStart: (settings: GameSettings) => void;
}

const SetupScreen: React.FC<SetupScreenProps> = ({ onStart }) => {
  const [step, setStep] = useState(0); 
  // Steps: 
  // 0: Language
  // 1: Name
  // 2: Genre
  // 3: Character (Role & Trait)
  
  const [language, setLanguage] = useState(SUPPORTED_LANGUAGES[0].code);
  const [name, setName] = useState('');
  const [genre, setGenre] = useState<GameGenre>(GameGenre.FANTASY);
  const [role, setRole] = useState('');
  const [trait, setTrait] = useState('');

  // Get current language content
  const t = TRANSLATIONS[language] || TRANSLATIONS['English'];

  // Update defaults when language changes so drop-downs aren't empty/wrong
  useEffect(() => {
    setRole(t.roles[0]);
    setTrait(t.traits[0]);
  }, [language, t]);

  const handleNext = async () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => Math.max(0, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onStart({ protagonistName: name, genre, role, trait, language });
    }
  };

  const stepData = [
    { title: t.steps.lang.title, icon: Languages, sub: t.steps.lang.sub },
    { title: t.steps.identity.title, icon: User, sub: t.steps.identity.sub },
    { title: t.steps.world.title, icon: Map, sub: t.steps.world.sub },
    { title: t.steps.character.title, icon: Sparkles, sub: t.steps.character.sub },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-950 text-slate-200">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 -z-10" />
      
      {/* Decorative blobs */}
      <div className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[100px]" />

      <div className="bg-slate-900/80 backdrop-blur-xl border border-slate-700 p-8 rounded-2xl shadow-2xl max-w-2xl w-full animate-fade-in flex flex-col min-h-[500px]">
        
        {/* Progress Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center items-center gap-2 mb-2">
             <span className="text-xs font-mono text-indigo-400 uppercase tracking-widest">
               {t.ui.step} {step + 1} {t.ui.of} {stepData.length}
             </span>
             <div className="flex gap-1">
                {stepData.map((_, i) => (
                  <div key={i} className={`h-1.5 w-6 rounded-full transition-colors ${i === step ? 'bg-indigo-400' : i < step ? 'bg-indigo-800' : 'bg-slate-700'}`} />
                ))}
             </div>
          </div>
          <h1 className="font-title text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
            {stepData[step].title}
          </h1>
          <p className="text-slate-400 mt-1">{stepData[step].sub}</p>
        </div>

        {/* Dynamic Content Area */}
        <div className="flex-1 flex flex-col">
          
          {/* STEP 0: LANGUAGE */}
          {step === 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fade-in">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code);
                    handleNext();
                  }}
                  className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-200 ${
                    language === lang.code
                      ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                      : 'bg-slate-800/40 border-slate-700 hover:bg-slate-800 hover:border-slate-500 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="text-3xl filter drop-shadow-lg">{lang.flag}</span>
                  <span className="font-medium">{lang.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* STEP 1: NAME */}
          {step === 1 && (
             <div className="flex flex-col gap-6 animate-fade-in justify-center h-full">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-300">{t.ui.nameLbl}</label>
                  <input
                    type="text"
                    required
                    autoFocus
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                    placeholder={t.ui.namePl}
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-6 py-4 text-xl text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all placeholder:text-slate-600"
                  />
                </div>
                <Button 
                  onClick={handleNext} 
                  disabled={!name.trim()}
                  className="w-full"
                >
                  {t.ui.confirmBtn} <ChevronRight size={18} />
                </Button>
             </div>
          )}

          {/* STEP 2: WORLD SETTING (Genre) */}
          {step === 2 && (
             <div className="flex flex-col gap-4 animate-fade-in h-full">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                  <BookOpen size={16} /> {t.ui.genreLbl}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-2 custom-scrollbar flex-1 max-h-[400px]">
                  {Object.values(GameGenre).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => {
                        setGenre(g);
                        setTimeout(handleNext, 200); // Small delay for visual feedback
                      }}
                      className={`p-4 rounded-lg text-left text-sm border transition-all ${
                        genre === g 
                          ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md' 
                          : 'bg-slate-800/30 border-slate-700 text-slate-400 hover:border-slate-500 hover:bg-slate-800/50'
                      }`}
                    >
                      <div className="font-semibold text-base mb-1">{g}</div>
                      <div className="text-xs opacity-70 leading-relaxed">{t.genres[g]}</div>
                    </button>
                  ))}
                </div>
             </div>
          )}

          {/* STEP 3: CHARACTER DETAILS */}
          {step === 3 && (
            <form onSubmit={handleSubmit} className="space-y-8 animate-fade-in flex flex-col justify-center h-full">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Role Selection */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                    <User size={16} /> {t.ui.roleLbl}
                  </label>
                  <select 
                    value={role} 
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {t.roles.map((r: string) => <option key={r} value={r}>{r}</option>)}
                  </select>
                </div>

                {/* Trait Selection */}
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-300">
                    <Sparkles size={16} /> {t.ui.traitLbl}
                  </label>
                  <select 
                    value={trait} 
                    onChange={(e) => setTrait(e.target.value)}
                    className="w-full bg-slate-800/50 border border-slate-600 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {t.traits.map((tr: string) => <option key={tr} value={tr}>{tr}</option>)}
                  </select>
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" className="w-full text-lg shadow-xl shadow-indigo-500/20 py-4">
                  {t.ui.startBtn} <Sparkles size={20} className="ml-2" />
                </Button>
              </div>
            </form>
          )}

        </div>

        {/* Navigation Footer (Back Button) */}
        {step > 0 && (
          <div className="mt-8 pt-4 border-t border-slate-800 flex justify-start">
             <button 
                onClick={handleBack}
                className="text-slate-400 hover:text-white flex items-center gap-2 text-sm transition-colors px-2 py-1 rounded hover:bg-slate-800"
             >
               <ChevronLeft size={16} /> {t.ui.backBtn}
             </button>
          </div>
        )}

      </div>
    </div>
  );
};

export default SetupScreen;