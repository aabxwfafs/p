import React from 'react';
import Card from './Card';
import { CogIcon, ArrowRightIcon, LightBulbIcon, InformationCircleIcon, UserCircleIcon, ChevronLeftIcon, CalendarDaysIcon, TrophyIcon } from './Icons';
import ThemeToggle from './ThemeToggle';

type View = 'dashboard' | 'planSettings' | 'history' | 'about' | 'tips' | 'progressLog' | 'settingsMenu' | 'badges';

interface SettingsProps {
    setCurrentView: (view: View) => void;
}

const Settings: React.FC<SettingsProps> = ({ setCurrentView }) => {
    
    const menuItems = [
        { view: 'planSettings', label: 'تعديل الخطة', icon: CogIcon, color: 'text-teal-600 dark:text-teal-400' },
        { view: 'history', label: 'سجل التقدم الأسبوعي', icon: CalendarDaysIcon, color: 'text-sky-600 dark:text-sky-400' },
        { view: 'badges', label: 'الشارات والأوسمة', icon: TrophyIcon, color: 'text-amber-600 dark:text-amber-400' },
        { view: 'tips', label: 'نصائح للحفظ والمراجعة', icon: LightBulbIcon, color: 'text-yellow-600 dark:text-yellow-400' },
        { view: 'about', label: 'نبذة عن التطبيق', icon: InformationCircleIcon, color: 'text-indigo-600 dark:text-indigo-400' },
    ];

    return (
        <div className="p-4 md:p-8 max-w-lg mx-auto">
             <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-teal-800 dark:text-teal-300 flex items-center">
                    <CogIcon className="w-8 h-8 ml-3" />
                    الإعدادات
                </h1>
                <button 
                    onClick={() => setCurrentView('dashboard')} 
                    className="text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition"
                    aria-label="الرجوع إلى لوحة التحكم"
                >
                    <ArrowRightIcon className="w-8 h-8" />
                </button>
            </header>

            <Card className="divide-y divide-gray-200 dark:divide-gray-700 !p-0">
                {menuItems.map(item => (
                    <button 
                        key={item.view}
                        onClick={() => setCurrentView(item.view as View)}
                        className="w-full text-right flex justify-between items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700/50 transition-colors"
                    >
                        <div className="flex items-center">
                           <item.icon className={`w-6 h-6 ml-4 ${item.color}`} />
                           <span className="font-medium text-gray-800 dark:text-gray-200">{item.label}</span>
                        </div>
                        <ChevronLeftIcon className="w-5 h-5 text-gray-400 dark:text-gray-500" />
                    </button>
                ))}
            </Card>

            <Card className="mt-4">
                 <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <UserCircleIcon className="w-6 h-6 ml-4 text-gray-500" />
                        <span className="font-medium text-gray-800 dark:text-gray-200">تسجيل الدخول</span>
                    </div>
                    <button
                        disabled
                        className="relative bg-blue-600 text-white font-bold py-2 px-4 rounded-lg opacity-50 cursor-not-allowed"
                    >
                        قريباً
                    </button>
                </div>
            </Card>

            <Card className="mt-4">
                 <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-800 dark:text-gray-200">الوضع الداكن</span>
                    <ThemeToggle />
                 </div>
            </Card>

        </div>
    );
};

export default Settings;