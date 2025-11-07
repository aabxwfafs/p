import React, { useState, useMemo } from 'react';
import { ProgressEntry, UserData, Plan } from '../types';
import Card from './Card';
import { toHijri } from '../utils/date';
import { CalendarDaysIcon, BookOpenIcon, RefreshIcon, ArrowRightIcon } from './Icons';

interface HistoryProps {
  userData: UserData;
  setCurrentView: (view: 'dashboard' | 'settingsMenu' | 'history' | 'about' | 'tips' | 'progressLog' | 'badges') => void;
}

interface WeeklyProgress {
  weekNumber: number;
  startDate: string;
  endDate: string;
  totalMemorized: number;
  totalRevised: number;
  memorizationProgress: number;
  revisionProgress: number;
  days: ProgressEntry[];
}

const getWeekSaturday = (d: Date): Date => {
    const date = new Date(d);
    const day = date.getDay(); // Sunday = 0, ... , Saturday = 6
    const diff = (day + 1) % 7;
    date.setDate(date.getDate() - diff);
    date.setHours(0, 0, 0, 0);
    return date;
};

const groupProgressByWeek = (userData: UserData): WeeklyProgress[] => {
  const { progress, plan, initialMemorizedPages } = userData;
  if (!progress || progress.length === 0) return [];

  const sortedProgress = [...progress].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  const groups: { [key: string]: ProgressEntry[] } = {};
  sortedProgress.forEach(entry => {
    const weekSaturday = getWeekSaturday(new Date(entry.date));
    const weekId = weekSaturday.toISOString().split('T')[0];
    if (!groups[weekId]) {
      groups[weekId] = [];
    }
    groups[weekId].push(entry);
  });
  
  let accumulatedMemorizedPages = initialMemorizedPages;
  const weeklyData = Object.keys(groups).sort().map(weekId => {
    const weekDays = groups[weekId];
    const weekStartDate = new Date(weekId);
    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekStartDate.getDate() + 6);
    
    const totalMemorized = weekDays.reduce((sum, p) => sum + p.memorizedPages, 0);
    const totalRevised = weekDays.reduce((sum, p) => sum + p.revisedPages, 0);

    let memorizationGoal = 0;
    for(let i=0; i < 7; i++){
      const d = new Date(weekId);
      d.setDate(d.getDate() + i);
      if(plan.memorizationDays[d.getDay()]){
        memorizationGoal += plan.dailyGoal;
      }
    }
    
    const totalMemorizedAtWeekStart = accumulatedMemorizedPages;
    accumulatedMemorizedPages += totalMemorized;
    
    const suggestedDailyRevision = Math.ceil(totalMemorizedAtWeekStart * 0.1);
    const revisionGoal = Math.max(7, suggestedDailyRevision * 7);

    const memorizationProgress = memorizationGoal > 0 ? Math.min(100, Math.round((totalMemorized / memorizationGoal) * 100)) : 100;
    const revisionProgress = revisionGoal > 0 ? Math.min(100, Math.round((totalRevised / revisionGoal) * 100)) : 100;

    return {
      startDate: toHijri(weekStartDate),
      endDate: toHijri(weekEndDate),
      totalMemorized,
      totalRevised,
      memorizationProgress,
      revisionProgress,
      days: weekDays,
      weekNumber: 0 // Placeholder
    };
  }).reverse().map((week, index, arr) => ({ ...week, weekNumber: arr.length - index }));

  return weeklyData;
};

const ProgressBar: React.FC<{ progress: number; colorClass: string }> = ({ progress, colorClass }) => (
    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2.5">
        <div className={`${colorClass} h-2.5 rounded-full`} style={{ width: `${progress}%` }}></div>
    </div>
);

const History: React.FC<HistoryProps> = ({ userData, setCurrentView }) => {
    const weeklyProgress = useMemo(() => groupProgressByWeek(userData), [userData]);
    const [openWeek, setOpenWeek] = useState<number | null>(weeklyProgress.length > 0 ? weeklyProgress[0].weekNumber : null);

    const handleBackClick = () => {
        // Navigate to dashboard if coming from there, otherwise to settings menu
        setCurrentView(document.referrer.includes('dashboard') ? 'dashboard' : 'settingsMenu');
    };

    return (
        <div className="p-4 md:p-8 max-w-3xl mx-auto">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-teal-800 dark:text-teal-300 flex items-center">
                    <CalendarDaysIcon className="w-8 h-8 ml-3" />
                    سجل التقدم الأسبوعي
                </h1>
                <button 
                    onClick={handleBackClick} 
                    className="text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition"
                    aria-label="الرجوع"
                >
                    <ArrowRightIcon className="w-8 h-8" />
                </button>
            </header>
            <Card>
                {weeklyProgress.length === 0 ? (
                    <p className="text-center text-gray-500 dark:text-gray-400 py-8">لا يوجد سجل لعرضه بعد.</p>
                ) : (
                    <div className="space-y-2">
                        {weeklyProgress.map((week) => (
                            <div key={week.weekNumber}>
                                <button 
                                    onClick={() => setOpenWeek(openWeek === week.weekNumber ? null : week.weekNumber)}
                                    className="w-full text-right p-4 bg-gray-100 dark:bg-gray-700/60 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg flex justify-between items-center transition"
                                >
                                    <div>
                                        <p className="font-bold text-gray-800 dark:text-gray-200">الأسبوع {week.weekNumber}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{week.startDate} - {week.endDate}</p>
                                    </div>
                                    <div className="flex items-center space-x-4 space-x-reverse text-sm">
                                        <span className="flex items-center dark:text-gray-300"><BookOpenIcon className="w-4 h-4 ml-1 text-teal-600 dark:text-teal-400" /> {week.totalMemorized}</span>
                                        <span className="flex items-center dark:text-gray-300"><RefreshIcon className="w-4 h-4 ml-1 text-blue-600 dark:text-blue-400" /> {week.totalRevised}</span>
                                    </div>
                                </button>
                                {openWeek === week.weekNumber && (
                                    <div className="p-4 border border-t-0 border-gray-200 dark:border-gray-700 rounded-b-lg bg-white dark:bg-gray-800">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">إنجاز الحفظ</h4>
                                                    <span className="text-sm font-bold text-teal-600 dark:text-teal-400">{week.memorizationProgress}%</span>
                                                </div>
                                                <ProgressBar progress={week.memorizationProgress} colorClass="bg-teal-500" />
                                            </div>
                                            <div>
                                                <div className="flex justify-between items-baseline mb-1">
                                                    <h4 className="text-sm font-bold text-gray-700 dark:text-gray-300">إنجاز المراجعة</h4>
                                                    <span className="text-sm font-bold text-blue-600 dark:text-blue-400">{week.revisionProgress}%</span>
                                                </div>
                                                <ProgressBar progress={week.revisionProgress} colorClass="bg-blue-500" />
                                            </div>
                                        </div>
                                        <ul className="space-y-2">
                                            {week.days.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(day => (
                                                <li key={day.date} className="flex justify-between items-center text-sm p-2 rounded bg-gray-50 dark:bg-gray-700/50">
                                                    <span className="font-medium text-gray-600 dark:text-gray-300">{toHijri(new Date(day.date))}</span>
                                                    <div className="flex space-x-3 space-x-reverse">
                                                        <span className="text-teal-700 dark:text-teal-400">حفظ: {day.memorizedPages}</span>
                                                        <span className="text-blue-700 dark:text-blue-400">مراجعة: {day.revisedPages}</span>
                                                    </div>
                                                </li>

                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
};

export default History;