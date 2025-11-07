import React from 'react';
import { UserData, ProgressEntry } from '../types';
import Card from './Card';
import { BookOpenIcon, RefreshIcon, ListBulletIcon } from './Icons';
import { toHijri } from '../utils/date';

interface TodaysProgressProps {
  userData: UserData;
  setUserData: (value: UserData) => void;
  setCurrentView: (view: 'dashboard' | 'settingsMenu' | 'history' | 'about' | 'tips' | 'progressLog' | 'badges') => void;
}

const TOTAL_QURAN_PAGES = 604;

const TodaysProgress: React.FC<TodaysProgressProps> = ({ userData, setUserData, setCurrentView }) => {
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const progressEntry = userData.progress.find(p => p.date === todayStr) || { memorizedPages: 0, revisedPages: 0 };

  const handleProgressChange = (dateStr: string, field: 'memorizedPages' | 'revisedPages', value: number) => {
    let updatedValue = Math.max(0, value);

    const oldProgressEntry = userData.progress.find(p => p.date === dateStr) || { memorizedPages: 0, revisedPages: 0 };
    const oldRevisedValue = oldProgressEntry.revisedPages;

    const existingEntryIndex = userData.progress.findIndex(p => p.date === dateStr);
    let newProgress: ProgressEntry[];

    if (existingEntryIndex > -1) {
      newProgress = [...userData.progress];
      newProgress[existingEntryIndex] = { ...newProgress[existingEntryIndex], [field]: updatedValue };
    } else {
      const newEntry: ProgressEntry = { date: dateStr, memorizedPages: 0, revisedPages: 0, [field]: updatedValue };
      newProgress = [...userData.progress, newEntry].sort((a, b) => a.date.localeCompare(b.date));
    }
    
    const newTotalMemorized = userData.initialMemorizedPages + newProgress.reduce((sum, p) => sum + p.memorizedPages, 0);

    if (field === 'memorizedPages') {
        const totalWithoutThisEntry = newTotalMemorized - updatedValue;
        if (totalWithoutThisEntry + updatedValue > TOTAL_QURAN_PAGES) {
          updatedValue = TOTAL_QURAN_PAGES - totalWithoutThisEntry;
          newProgress.find(p => p.date === dateStr)!.memorizedPages = updatedValue;
        }
    }
    if (field === 'revisedPages' && updatedValue > newTotalMemorized) {
        updatedValue = newTotalMemorized;
        newProgress.find(p => p.date === dateStr)!.revisedPages = updatedValue;
    }

    const revisionDelta = (field === 'revisedPages') ? updatedValue - oldRevisedValue : 0;
    
    if (revisionDelta !== 0) {
      const totalMemorizedForKhatma = userData.initialMemorizedPages + userData.progress.reduce((sum, p) => sum + p.memorizedPages, 0);
      let newPagesRevisedInCurrent = userData.pagesRevisedInCurrentKhatma + revisionDelta;
      let newKhatmaCount = userData.revisionKhatmaCount;

      if (totalMemorizedForKhatma > 0) {
        while (newPagesRevisedInCurrent >= totalMemorizedForKhatma) {
          newKhatmaCount++;
          newPagesRevisedInCurrent -= totalMemorizedForKhatma;
        }
      }
      newPagesRevisedInCurrent = Math.max(0, newPagesRevisedInCurrent);
      
      setUserData({ ...userData, progress: newProgress, revisionKhatmaCount: newKhatmaCount, pagesRevisedInCurrentKhatma: newPagesRevisedInCurrent });
    } else {
      setUserData({ ...userData, progress: newProgress });
    }
  };


  return (
    <Card>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-teal-700 dark:text-teal-400">إنجاز اليوم</h2>
        <button 
            onClick={() => setCurrentView('progressLog')}
            className="flex items-center text-sm text-teal-600 hover:text-teal-800 dark:text-teal-400 dark:hover:text-teal-300 font-medium transition"
        >
            <ListBulletIcon className="w-5 h-5 ml-1" />
            عرض السجل الكامل
        </button>
      </div>
      <div className="p-4 rounded-lg bg-teal-50 dark:bg-teal-900/40 border-2 border-teal-200 dark:border-teal-800">
        <p className="font-bold text-teal-800 dark:text-teal-300">
          {toHijri(today)}
        </p>
        <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex items-center">
            <BookOpenIcon className="w-6 h-6 ml-3 text-teal-600 dark:text-teal-400" />
            <label htmlFor={`memorized-${todayStr}`} className="text-sm font-medium text-gray-600 dark:text-gray-300 ml-2 whitespace-nowrap">حفظ:</label>
            <input
              type="number"
              id={`memorized-${todayStr}`}
              value={progressEntry.memorizedPages}
              onChange={(e) => handleProgressChange(todayStr, 'memorizedPages', parseFloat(e.target.value) || 0)}
              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              min="0"
              step="0.5"
            />
            <span className="mr-2 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">وجه</span>
          </div>
          <div className="flex items-center">
            <RefreshIcon className="w-6 h-6 ml-3 text-blue-600 dark:text-blue-400" />
            <label htmlFor={`revised-${todayStr}`} className="text-sm font-medium text-gray-600 dark:text-gray-300 ml-2 whitespace-nowrap">مراجعة:</label>
            <input
              type="number"
              id={`revised-${todayStr}`}
              value={progressEntry.revisedPages}
              onChange={(e) => handleProgressChange(todayStr, 'revisedPages', parseInt(e.target.value, 10) || 0)}
              className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-teal-500 focus:border-teal-500 text-center bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              min="0"
            />
            <span className="mr-2 text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">وجه</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TodaysProgress;