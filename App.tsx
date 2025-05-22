
import React, { useState, useCallback, useEffect, useContext } from 'react';
import { TopicInput } from './components/TopicInput';
import { StudyMaterialDisplay } from './components/StudyMaterialDisplay';
import { LoadingSpinner } from './components/LoadingSpinner';
import { generateStudyMaterials } from './services/geminiService';
import type { StudyMaterials }  from './types';
import { StudyTool } from './types';
import { ThemeContext, Theme } from './contexts/ThemeContext';
import { ThemeToggleButton } from './components/ThemeToggleButton';

const App: React.FC = () => {
  const [subject, setSubject] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterials | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentTool, setCurrentTool] = useState<StudyTool | null>(null);
  const [initialMessageVisible, setInitialMessageVisible] = useState<boolean>(true);

  const { theme } = useContext(ThemeContext);
  const apiKey = process.env.API_KEY;

   useEffect(() => {
    if (!apiKey) {
      setError("API_KEY environment variable is not set. Please configure it to use the AI features.");
    }
  }, [apiKey]);


  const handleTopicSubmit = useCallback(async (submittedSubject: string, submittedTopic: string) => {
    if (!apiKey) {
      setError("API_KEY is missing. Cannot fetch study materials.");
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setStudyMaterials(null);
    setInitialMessageVisible(false);
    setCurrentTool(null); 

    try {
      const materials = await generateStudyMaterials(submittedSubject, submittedTopic);
      setStudyMaterials(materials);
      setSubject(submittedSubject);
      setTopic(submittedTopic);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred.');
      }
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  const handleToolSelect = (tool: StudyTool) => {
    setCurrentTool(tool);
  };

  const resetApp = () => {
    setSubject('');
    setTopic('');
    setStudyMaterials(null);
    setError(null);
    setIsLoading(false);
    setInitialMessageVisible(true);
    setCurrentTool(null);
  };

  return (
    <div className={`min-h-screen flex flex-col items-center p-4 sm:p-6 md:p-8 font-sans transition-colors duration-300 ${
      theme === Theme.DARK 
        ? 'bg-gradient-to-br from-slate-900 to-slate-800 text-slate-100' 
        : 'bg-slate-100 text-slate-900'
    }`}>
      <header className="w-full max-w-4xl mb-8 text-center">
        <div className="flex justify-between items-center mb-4">
            <div className="w-12"> {/* Spacer for centering title */}
            {!initialMessageVisible && studyMaterials && (
                <button 
                    onClick={resetApp}
                    className={`px-3 py-2 sm:px-4 text-xs sm:text-sm font-semibold rounded-lg shadow-md transition-colors duration-150 whitespace-nowrap
                                ${theme === Theme.DARK ? 'bg-sky-600 hover:bg-sky-700 text-white' : 'bg-sky-500 hover:bg-sky-600 text-white'}`}
                >
                    New Topic
                </button>
            )}
            </div>
            <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-transparent bg-clip-text 
                            ${theme === Theme.DARK ? 'bg-gradient-to-r from-sky-400 via-cyan-300 to-teal-400' : 'bg-gradient-to-r from-sky-600 via-cyan-500 to-teal-600'}`}>
            AI Study Assistant
            </h1>
            <ThemeToggleButton />
        </div>

      </header>

      <main className="w-full max-w-4xl">
        {error && (
          <div className={`border px-4 py-3 rounded-lg relative mb-6 shadow-lg 
                          ${theme === Theme.DARK ? 'bg-red-700 border-red-900 text-red-100' : 'bg-red-100 border-red-400 text-red-700'}`} role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        {initialMessageVisible && !isLoading && !studyMaterials && (
          <div className={`text-center p-8 rounded-xl shadow-2xl 
                          ${theme === Theme.DARK ? 'bg-slate-800' : 'bg-white'}`}>
            <p className={`text-2xl font-semibold mb-6 ${theme === Theme.DARK ? 'text-slate-300' : 'text-slate-700'}`}>
              What subject and topic are you studying today?
            </p>
            <TopicInput onSubmit={handleTopicSubmit} isLoading={isLoading} />
          </div>
        )}
        
        {isLoading && <LoadingSpinner />}

        {!isLoading && !error && studyMaterials && (
          <StudyMaterialDisplay 
            subject={subject}
            topic={topic}
            materials={studyMaterials}
            currentTool={currentTool}
            onToolSelect={handleToolSelect}
          />
        )}
      </main>
      <footer className="w-full max-w-4xl mt-12 text-center text-sm text-slate-500 dark:text-slate-400">
        <p>© 2025 AI Study Assistant. <span className="block sm:inline mt-1 sm:mt-0">@bi9xz_2</span></p>
      </footer>
    </div>
  );
};

export default App;
