import React from 'react';
import { UserData } from '../types';
import { allBadges } from '../utils/badges';
import Card from './Card';
import { ArrowRightIcon, TrophyIcon } from './Icons';

interface BadgesProps {
    userData: UserData;
    setCurrentView: (view: 'settingsMenu' | 'badges') => void;
}

const Badges: React.FC<BadgesProps> = ({ userData, setCurrentView }) => {
    const earnedBadgesSet = new Set(userData.earnedBadges || []);

    const categories = {
        memorization: 'شارات الحفظ',
        revision: 'شارات المراجعة والختمات',
        consistency: 'شارات المواظبة والاستمرارية'
    };

    const groupedBadges = allBadges.reduce((acc, badge) => {
        const categoryKey = badge.category as keyof typeof categories;
        acc[categoryKey] = [...(acc[categoryKey] || []), badge];
        return acc;
    }, {} as Record<keyof typeof categories, typeof allBadges>);

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-teal-800 dark:text-teal-300 flex items-center">
                    <TrophyIcon className="w-8 h-8 ml-3" />
                    الشارات والأوسمة
                </h1>
                <button 
                    onClick={() => setCurrentView('settingsMenu')} 
                    className="text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition"
                    aria-label="الرجوع إلى الإعدادات"
                >
                    <ArrowRightIcon className="w-8 h-8" />
                </button>
            </header>
            
            <div className="space-y-8">
                {(Object.keys(categories) as Array<keyof typeof categories>).map((category) => (
                    <div key={category}>
                        <h2 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-4 border-b-2 border-gray-200 dark:border-gray-700 pb-2">
                            {categories[category]}
                        </h2>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {(groupedBadges[category] || []).map(badge => {
                                const isEarned = earnedBadgesSet.has(badge.id);
                                return (
                                    <div 
                                        key={badge.id}
                                        className={`flex flex-col items-center text-center p-4 rounded-xl border-2 transition-all duration-300 ${
                                            isEarned 
                                            ? 'bg-amber-50 dark:bg-amber-900/40 border-amber-300 dark:border-amber-700' 
                                            : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-60'
                                        }`}
                                    >
                                        <badge.icon className={`w-12 h-12 mb-2 ${isEarned ? 'text-amber-500' : 'text-gray-400'}`} />
                                        <h3 className={`font-bold ${isEarned ? 'text-amber-800 dark:text-amber-300' : 'text-gray-600 dark:text-gray-400'}`}>
                                            {badge.name}
                                        </h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                            {badge.description}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Badges;
