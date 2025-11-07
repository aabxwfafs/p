import React, { useState, useEffect } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { UserData } from './types';
import Dashboard from './components/Dashboard';
import Settings from './components/Settings';
import History from './components/History';
import About from './components/About';
import Tips from './components/Tips';
import ProgressLog from './components/ProgressLog';
import useDarkMode from './hooks/useDarkMode';
import PlanSettings from './components/PlanSettings';
import { allBadges } from './utils/badges';
import Badges from './components/Badges';

type View = 'dashboard' | 'settingsMenu' | 'planSettings' | 'history' | 'about' | 'tips' | 'progressLog' | 'badges';

function App() {
  const [userData, setUserData] = useLocalStorage<UserData | null>('quran-companion-data', null);
  useDarkMode(); // Initialize and apply dark mode
  
  const [currentView, setCurrentView] = useState<View>(() => {
    try {
      const item = window.localStorage.getItem('quran-companion-data');
      return item ? 'dashboard' : 'planSettings';
    } catch {
      return 'planSettings';
    }
  });
  
  // Data migration for existing users
  useEffect(() => {
    if (userData) {
      let needsUpdate = false;
      const updatedData: UserData = { ...userData };
      
      if (userData.revisionKhatmaCount === undefined) {
          updatedData.revisionKhatmaCount = 0;
          needsUpdate = true;
      }
      if (userData.pagesRevisedInCurrentKhatma === undefined) {
          updatedData.pagesRevisedInCurrentKhatma = 0;
          needsUpdate = true;
      }
      if (userData.earnedBadges === undefined) {
          updatedData.earnedBadges = [];
          needsUpdate = true;
      }

      if(needsUpdate) {
        setUserData(updatedData);
      }
    }
  }, []);

  // Badge calculation logic
  useEffect(() => {
    if (!userData) return;

    const newEarnedBadges = allBadges
      .filter(badge => badge.checkEarned(userData))
      .map(badge => badge.id);
    
    const currentEarnedIds = new Set(userData.earnedBadges || []);
    
    if (newEarnedBadges.length !== currentEarnedIds.size) {
       const sortedNewBadges = [...newEarnedBadges].sort();
       const sortedCurrentBadges = [...(userData.earnedBadges || [])].sort();
       if (JSON.stringify(sortedNewBadges) !== JSON.stringify(sortedCurrentBadges)) {
         setUserData({ ...userData, earnedBadges: newEarnedBadges });
       }
    }
  }, [userData]);


  const handleSaveSettings = (data: UserData) => {
    const isInitialSetup = !userData;
    const existingProgress = userData ? userData.progress : [];
    const updatedData = { 
      ...data, 
      progress: data.progress.length ? data.progress : existingProgress,
      revisionKhatmaCount: userData?.revisionKhatmaCount ?? 0,
      pagesRevisedInCurrentKhatma: userData?.pagesRevisedInCurrentKhatma ?? 0,
      earnedBadges: userData?.earnedBadges ?? [],
    };
    setUserData(updatedData);
    setCurrentView(isInitialSetup ? 'dashboard' : 'settingsMenu');
  };

  const renderContent = () => {
    if (!userData) {
      // Force initial setup if no data exists
      return <PlanSettings onSave={handleSaveSettings} initialData={null} setCurrentView={setCurrentView} />;
    }
    
    switch (currentView) {
      case 'settingsMenu':
        return <Settings setCurrentView={setCurrentView} />;
      case 'planSettings':
        return <PlanSettings onSave={handleSaveSettings} initialData={userData} setCurrentView={setCurrentView} />;
      case 'about':
        return <About setCurrentView={setCurrentView} />;
      case 'tips':
        return <Tips setCurrentView={setCurrentView} />;
      case 'history':
        return <History userData={userData} setCurrentView={setCurrentView} />;
      case 'badges':
        return <Badges userData={userData} setCurrentView={setCurrentView} />;
      case 'progressLog':
        return <ProgressLog userData={userData} setUserData={setUserData} setCurrentView={setCurrentView} />;
      case 'dashboard':
      default:
        return <Dashboard userData={userData} setUserData={setUserData} setCurrentView={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {renderContent()}
    </div>
  );
}

export default App;