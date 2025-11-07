import React from 'react';
import { UserData, ProgressEntry } from '../types';
import Card from './Card';
import { BookOpenIcon, RefreshIcon, ArrowRightIcon, CalendarDaysIcon } from './Icons';
import { toHijri } from '../utils/date';

interface ProgressLogProps {
  userData: UserData;
  setUserData: (value: UserData) => void;
  setCurrentView: (view: 'dashboard' | 'settingsMenu' | 'history' | 'about' | 'tips' | 'progressLog' | 'badges') => void;
}

const TOTAL_QURAN_PAGES = 604;

const getWeekSaturday = (d: Date): Date => {
    const date = new Date(d);
    date.setHours(0, 0, 0, 0);
    const day = date.getDay(); // Sunday = 0, ... , Saturday = 6
    const diff = (day + 1) % 7;
    date.setDate(date.getDate() - diff);
    return date;
};

const ProgressLog: React.FC<ProgressLogProps> = ({ userData, setUserData, setCurrentView }) => {
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

  const renderWeeks = () => {
    const { progress } = userData;
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    
    const firstEntryDate = progress.length > 0
        ? new Date(progress.sort((a, b) => a.date.localeCompare(b.date))[0].date)
        : new Date();

    let weeks = [];
    let currentSaturday = getWeekSaturday(today);

    while (currentSaturday >= getWeekSaturday(firstEntryDate)) {
        const weekDays: Date[] = [];
        for (let i = 0; i < 7; i++) {
            const day = new Date(currentSaturday);
            day.setDate(day.getDate() + i);
            if (day <= today) {
                weekDays.push(day);
            }
        }

        weekDays.sort((a, b) => {
            let dayA = a.getDay();
            let dayB = b.getDay();
            if (dayA === 6) dayA = -1; // Move Saturday to the beginning
            if (dayB === 6) dayB = -1;
            return dayA - dayB;
        });

        weeks.push({
            id: currentSaturday.toISOString().split('T')[0],
            days: weekDays.reverse() // Most recent day first
        });
        currentSaturday.setDate(currentSaturday.getDate() - 7);
    }

    return weeks.map(week => (
        <Card key={week.id} className="mb-4">
            <h3 className="text-lg font-bold text-teal-700 dark:text-teal-400 mb-3 border-b-2 border-teal-100 dark:border-teal-900 pb-2">
                الأسبوع الذي يبدأ في {toHijri(new Date(week.id))}
            </h3>
            <div className="space-y-4">
                {week.days.map(date => {
                    const dateStr = date.toISOString().split('T')[0];
                    const progressEntry = progress.find(p => p.date === dateStr) || { memorizedPages: 0, revisedPages: 0 };
                    const isToday = new Date().toDateString() === date.toDateString();

                    return (
                        <div key={dateStr} className={`p-3 rounded-lg border ${isToday ? 'bg-teal-50 dark:bg-teal-900/40 border-teal-200 dark:border-teal-800' : 'bg-gray-50 dark:bg-gray-700/40 border-gray-200 dark:border-gray-700'}`}>
                            <p className={`font-semibold text-sm ${isToday ? 'text-teal-800 dark:text-teal-300' : 'text-gray-700 dark:text-gray-300'}`}>
                                {toHijri(date)}
                            </p>
                            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="flex items-center">
                                    <BookOpenIcon className="w-5 h-5 ml-2 text-teal-600 dark:text-teal-400" />
                                    <label htmlFor={`memorized-${dateStr}`} className="text-xs font-medium text-gray-600 dark:text-gray-300 ml-1 whitespace-nowrap">حفظ:</label>
                                    <input type="number" id={`memorized-${dateStr}`} value={progressEntry.memorizedPages} onChange={(e) => handleProgressChange(dateStr, 'memorizedPages', parseFloat(e.target.value) || 0)} className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-center bg-white dark:bg-gray-800 dark:text-gray-100" min="0" step="0.5" />
                                </div>
                                <div className="flex items-center">
                                    <RefreshIcon className="w-5 h-5 ml-2 text-blue-600 dark:text-blue-400" />
                                    <label htmlFor={`revised-${dateStr}`} className="text-xs font-medium text-gray-600 dark:text-gray-300 ml-1 whitespace-nowrap">مراجعة:</label>
                                    <input type="number" id={`revised-${dateStr}`} value={progressEntry.revisedPages} onChange={(e) => handleProgressChange(dateStr, 'revisedPages', parseInt(e.target.value, 10) || 0)} className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-center bg-white dark:bg-gray-800 dark:text-gray-100" min="0"/>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    ));
  };
  
  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
        <header className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-teal-800 dark:text-teal-300 flex items-center">
                <CalendarDaysIcon className="w-8 h-8 ml-3" />
                سجل التقدم اليومي
            </h1>
            <button onClick={() => setCurrentView('dashboard')} className="text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition" aria-label="الرجوع إلى لوحة التحكم">
                <ArrowRightIcon className="w-8 h-8" />
            </button>
        </header>
        <div>
            {renderWeeks()}
        </div>
    </div>
  );
};

export default ProgressLog;