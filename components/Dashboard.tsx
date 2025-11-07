import React, { useMemo } from 'react';
import { UserData } from '../types';
import ProgressChart from './ProgressChart';
import Card from './Card';
import { BookOpenIcon, CheckCircleIcon, CogIcon, RefreshIcon, InformationCircleIcon, TrophyIcon, XCircleIcon } from './Icons';
import TodaysProgress from './DailyTask';
import UpcomingBadges from './UpcomingBadges';

interface DashboardProps {
  userData: UserData;
  setUserData: (value: UserData) => void;
  setCurrentView: (view: 'dashboard' | 'settingsMenu' | 'history' | 'about' | 'tips' | 'progressLog' | 'badges') => void;
}

const DailyCommitmentStatus: React.FC<{ userData: UserData }> = ({ userData }) => {
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const commitmentData = useMemo(() => {
        return Array.from({ length: 7 }).map((_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            const dayIndex = date.getDay();
            
            const isPlanned = userData.plan.memorizationDays[dayIndex];
            const progressEntry = userData.progress.find(p => p.date === dateStr);
            const didMemorize = progressEntry && progressEntry.memorizedPages > 0;

            return {
                day: days[dayIndex],
                isPlanned,
                isComplete: didMemorize,
            };
        }).reverse();
    }, [userData]);

    return (
        <div className="mt-3 flex justify-center flex-wrap gap-2">
            {commitmentData.map(({ day, isPlanned, isComplete }, index) => (
                <div key={index} className="flex flex-col items-center p-2 rounded-md bg-gray-100/80 dark:bg-gray-700/80 w-16 text-center">
                    <span className="text-xs font-bold text-gray-600 dark:text-gray-300">{day}</span>
                    {isPlanned ? 
                        (isComplete ? <CheckCircleIcon className="w-6 h-6 text-green-500 mt-1" /> : <XCircleIcon className="w-6 h-6 text-red-400 mt-1" />)
                        : <span className="text-2xl text-gray-400 dark:text-gray-500 mt-1">-</span>
                    }
                </div>
            ))}
        </div>
    );
};

const formatKhatmaCount = (count: number): string => {
  const arabicNumber = count.toLocaleString('ar-EG');
  if (count === 1) {
    return 'ختمة واحدة';
  }
  if (count === 2) {
    return 'ختمتان';
  }
  if (count >= 3 && count <= 10) {
    return `${arabicNumber} ختمات`;
  }
  return `${arabicNumber} ختمة`;
};


const Dashboard: React.FC<DashboardProps> = ({ userData, setUserData, setCurrentView }) => {
  const totalMemorized = useMemo(() => {
    const progressPages = userData.progress.reduce((sum, p) => sum + p.memorizedPages, 0);
    return userData.initialMemorizedPages + progressPages;
  }, [userData]);

  const totalRevisedThisWeek = useMemo(() => {
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(today.getDate() - 7);
    const oneWeekAgoStr = oneWeekAgo.toISOString().split('T')[0];

    return userData.progress
      .filter(p => p.date >= oneWeekAgoStr)
      .reduce((sum, p) => sum + p.revisedPages, 0);
  }, [userData]);

  const suggestedRevision = Math.max(1, Math.ceil(totalMemorized * 0.1));

  const commitmentRate = useMemo(() => {
    let goalPages = 0;
    let actualPages = 0;

    for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayIndex = date.getDay();
        const dateStr = date.toISOString().split('T')[0];

        if (userData.plan.memorizationDays[dayIndex]) {
            goalPages += userData.plan.dailyGoal;
        }

        const progressEntry = userData.progress.find(p => p.date === dateStr);
        if (progressEntry) {
            actualPages += progressEntry.memorizedPages;
        }
    }
    
    if (goalPages === 0) return 100;
    return Math.min(100, Math.round((actualPages / goalPages) * 100));
  }, [userData]);

  const { revisionKhatmaCount, pagesRevisedInCurrentKhatma } = userData;
  const pagesToNextRevisionKhatma = totalMemorized > 0 ? totalMemorized - pagesRevisedInCurrentKhatma : 0;
  const progressToNextRevisionKhatma = totalMemorized > 0 ? (pagesRevisedInCurrentKhatma / totalMemorized) * 100 : 0;


  return (
    <div className="p-4 md:p-8 space-y-6 max-w-5xl mx-auto">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-teal-800 dark:text-teal-300">لوحة التحكم</h1>
        <div className="flex items-center space-x-2 space-x-reverse">
          <button onClick={() => setCurrentView('settingsMenu')} className="text-gray-500 hover:text-teal-600 dark:text-gray-400 dark:hover:text-teal-400 transition p-2">
            <CogIcon className="w-7 h-7" />
          </button>
        </div>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="flex items-center space-x-4 space-x-reverse bg-gradient-to-br from-teal-50 to-emerald-50 dark:from-teal-900/50 dark:to-emerald-900/50">
          <BookOpenIcon className="w-12 h-12 text-teal-500" />
          <div>
            <p className="text-gray-500 dark:text-gray-400">إجمالي الحفظ</p>
            <p className="text-2xl font-bold text-teal-800 dark:text-teal-300">{totalMemorized.toLocaleString('ar-EG')} وجه</p>
          </div>
        </Card>
        <Card className="flex items-center space-x-4 space-x-reverse bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/50 dark:to-cyan-900/50">
          <RefreshIcon className="w-12 h-12 text-blue-500" />
          <div>
            <p className="text-gray-500 dark:text-gray-400">مراجعة آخر 7 أيام</p>
            <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">{totalRevisedThisWeek.toLocaleString('ar-EG')} وجه</p>
          </div>
        </Card>
        <Card className="flex flex-col justify-center text-center bg-gradient-to-br from-amber-50 to-yellow-50 dark:from-amber-900/50 dark:to-yellow-900/50">
            <p className="text-gray-500 dark:text-gray-400">معدل الالتزام بالحفظ</p>
            <p className="text-3xl font-bold text-amber-800 dark:text-amber-300 my-1">{commitmentRate.toLocaleString('ar-EG')}%</p>
            <DailyCommitmentStatus userData={userData} />
        </Card>
        <Card className="flex items-center space-x-4 space-x-reverse bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/50 dark:to-indigo-900/50">
          <TrophyIcon className="w-12 h-12 text-purple-500" />
          <div>
            <p className="text-gray-500 dark:text-gray-400">ختمات المراجعة</p>
            <p className="text-2xl font-bold text-purple-800 dark:text-purple-300">{formatKhatmaCount(revisionKhatmaCount)}</p>
            {(totalMemorized > 0) && (
              <p className="text-xs text-purple-600 dark:text-purple-400">
                أنجزت {Math.round(progressToNextRevisionKhatma)}% (متبقي {Math.round(pagesToNextRevisionKhatma).toLocaleString('ar-EG')} وجه)
              </p>
            )}
          </div>
        </Card>
      </div>
      
      <UpcomingBadges userData={userData} />

      <Card className="bg-blue-50 dark:bg-blue-900/40 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start sm:items-center">
            <InformationCircleIcon className="w-8 h-8 text-blue-500 dark:text-blue-400 ml-4 flex-shrink-0" />
            <div>
                <h3 className="font-bold text-blue-800 dark:text-blue-300">مقدار المراجعة اليومي المقترح</h3>
                <p className="text-blue-700 dark:text-blue-300/90">
                    بناءً على إجمالي حفظك ({totalMemorized.toLocaleString('ar-EG')} وجه)، نقترح عليك مراجعة <span className="font-bold">{suggestedRevision.toLocaleString('ar-EG')}</span> أوجه يوميًا على الأقل للحفاظ على إتقانك.
                </p>
            </div>
        </div>
      </Card>
      
      <TodaysProgress userData={userData} setUserData={setUserData} setCurrentView={setCurrentView}/>
      
      <ProgressChart progress={userData.progress} />
    </div>
  );
};

export default Dashboard;