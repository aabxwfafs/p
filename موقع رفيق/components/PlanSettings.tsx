import React, { useState } from 'react';
import { Plan, UserData } from '../types';
import Card from './Card';
import { ArrowRightIcon } from './Icons';

interface PlanSettingsProps {
  onSave: (data: UserData) => void;
  initialData?: UserData | null;
  setCurrentView: (view: 'dashboard' | 'settingsMenu' | 'planSettings' | 'badges') => void;
}

const PlanSettings: React.FC<PlanSettingsProps> = ({ onSave, initialData, setCurrentView }) => {
  const defaultPlan: Plan = {
    dailyGoal: 1,
    memorizationDays: [true, true, true, true, true, false, false],
  };
  
  const [dailyGoal, setDailyGoal] = useState(initialData?.plan.dailyGoal ?? defaultPlan.dailyGoal);
  const [memorizationDays, setMemorizationDays] = useState(initialData?.plan.memorizationDays ?? defaultPlan.memorizationDays);
  const [initialPages, setInitialPages] = useState(initialData?.initialMemorizedPages ?? 0);

  const daysOfWeek = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

  const handleDayToggle = (index: number) => {
    const newDays = [...memorizationDays];
    newDays[index] = !newDays[index];
    setMemorizationDays(newDays);
  };

  const handleDailyGoalChange = (value: string) => {
    const numValue = parseFloat(value);
    if(isNaN(numValue)) {
        setDailyGoal(0);
        return;
    }
    if (numValue > 20) {
        setDailyGoal(20);
    } else if (numValue < 0) {
        setDailyGoal(0);
    } else {
        setDailyGoal(numValue);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      plan: { dailyGoal, memorizationDays },
      initialMemorizedPages: initialPages,
      progress: initialData?.progress ?? [],
      revisionKhatmaCount: initialData?.revisionKhatmaCount ?? 0,
      pagesRevisedInCurrentKhatma: initialData?.pagesRevisedInCurrentKhatma ?? 0,
      earnedBadges: initialData?.earnedBadges ?? [],
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-lg w-full space-y-4">
        {initialData && (
          <header className="flex justify-between items-center mb-0 -mt-4">
               <h1 className="text-3xl font-bold text-teal-800 dark:text-teal-300">تعديل الخطة</h1>
              <button 
                  onClick={() => setCurrentView('settingsMenu')} 
                  className="text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition p-2"
                  aria-label="الرجوع إلى الإعدادات"
              >
                  <ArrowRightIcon className="w-8 h-8" />
              </button>
          </header>
        )}
        <Card>
          {!initialData && (
            <>
              <h1 className="text-3xl font-bold text-center text-teal-700 dark:text-teal-400 mb-2">
                رفيق الحفظ القرآني
              </h1>
              <p className="text-center text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                ابدأ رحلتك المباركة مع القرآن الكريم بوضع خطة تناسبك.
              </p>
            </>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {!initialData && (
                 <div>
                    <label htmlFor="initial-pages" className="block text-md font-medium text-gray-700 dark:text-gray-200 mb-2">
                        كم عدد الأوجه التي حفظتها حتى الآن؟
                    </label>
                    <input 
                        type="number" 
                        id="initial-pages"
                        value={initialPages}
                        onChange={(e) => setInitialPages(Math.max(0, Math.min(604, parseInt(e.target.value, 10))) || 0)}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                        min="0"
                        max="604"
                    />
                </div>
            )}

            <div>
              <label htmlFor="daily-goal" className="block text-md font-medium text-gray-700 dark:text-gray-200 mb-2">
                هدف الحفظ اليومي (عدد الأوجه)
              </label>
              <input
                type="number"
                id="daily-goal"
                value={dailyGoal}
                onChange={(e) => handleDailyGoalChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-teal-500 focus:border-teal-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                placeholder="مثال: 1.5"
                min="0.5"
                max="20"
                step="0.5"
              />
            </div>

            <div>
              <label className="block text-md font-medium text-gray-700 dark:text-gray-200 mb-2">
                أيام الحفظ في الأسبوع
              </label>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {daysOfWeek.map((day, index) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => handleDayToggle(index)}
                    className={`px-4 py-2 rounded-lg border-2 transition-colors duration-200 ${
                      memorizationDays[index] 
                        ? 'bg-teal-500 text-white border-teal-500' 
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {day}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row-reverse gap-3 pt-4">
                <button
                  type="submit"
                  className="w-full bg-teal-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-transform transform hover:scale-105"
                >
                  {initialData ? 'حفظ التعديلات' : 'ابدأ رحلتك'}
                </button>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default PlanSettings;