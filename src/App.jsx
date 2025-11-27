import React, { useState } from 'react';
import Background from './components/Background';
import SearchBar from './components/SearchBar';
import LinksSection from './components/LinksSection';
import Weather from './components/Weather';

export default function App() {
  const [isEditingLinksSection, setIsEditingLinksSection] = useState(false);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 22) return "Good evening";
    return "Good night";
  };

  return (
    <div className="font-sans text-neutral-900 dark:text-neutral-100 min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <Background />
      <div className={`container w-full max-w-2xl mx-auto text-center p-4 sm:p-8 rounded-3xl shadow-lg backdrop-blur-xl
        bg-white/70 dark:bg-neutral-900/30 
        border border-neutral-500 dark:border-white/10
        animate-spring-in overflow-x-hidden`}>
        <h1 className="mb-4 text-4xl font-bold tracking-wide">{getGreeting()}, Carlos</h1>
        <Weather />
        <SearchBar />
        <LinksSection isEditing={isEditingLinksSection} />
        <button 
          onClick={() => setIsEditingLinksSection(!isEditingLinksSection)}
          className={`mt-4 text-sm ${
            isEditingLinksSection 
              ? 'btn-primary' 
              : 'btn-secondary'
          }`}
        >
          {isEditingLinksSection ? 'Done' : 'Edit Links'}
        </button>
      </div>
    </div>
  );
}
