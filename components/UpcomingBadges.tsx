import React from 'react';
import { UserData } from '../types';
import { allBadges } from '../utils/badges';
import Card from './Card';
import { SparklesIcon } from './Icons';

interface UpcomingBadgesProps {
    userData: UserData;
}

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mt-2">
        <div 
            className="bg-gradient-to-r from-amber-400 to-amber-600 h-2 rounded-full transition-all duration-500" 
            style={{ width: `${progress}%` }}
        ></div>
    </div>
);

const UpcomingBadges: React.FC<UpcomingBadgesProps> = ({ userData }) => {
    const earnedBadgesSet = new Set(userData.earnedBadges || []);
    
    const upcoming = [];

    // 1. Get next memorization badge
    const nextMemorizationBadge = allBadges
        .filter(b => b.category === 'memorization' && !earnedBadgesSet.has(b.id) && b.getProgress)
        .sort((a, b) => a.getProgress!(userData)!.goal - b.getProgress!(userData)!.goal)[0];

    if (nextMemorizationBadge) {
        const progress = nextMemorizationBadge.getProgress!(userData);
        if (progress && progress.current < progress.goal) {
            upcoming.push({
                ...nextMemorizationBadge,
                progress,
                percentage: (progress.current / progress.goal) * 100
            });
        }
    }

    // 2. Get next revision badge
    const nextRevisionBadge = allBadges
        .filter(b => b.category === 'revision' && !earnedBadgesSet.has(b.id) && b.getProgress)
        .sort((a, b) => a.getProgress!(userData)!.goal - b.getProgress!(userData)!.goal)[0];
    
    if (nextRevisionBadge) {
        const progress = nextRevisionBadge.getProgress!(userData);
        if (progress && progress.current < progress.goal) {
            upcoming.push({
                ...nextRevisionBadge,
                progress,
                percentage: (progress.current / progress.goal) * 100
            });
        }
    }

    // 3. Get next consistency badge
    const nextConsistencyBadge = allBadges
        .filter(b => b.category === 'consistency' && !earnedBadgesSet.has(b.id) && b.getProgress)
        .sort((a, b) => a.getProgress!(userData)!.goal - b.getProgress!(userData)!.goal)[0];

    if (nextConsistencyBadge) {
        const progress = nextConsistencyBadge.getProgress!(userData);
        if (progress && progress.current < progress.goal) {
            upcoming.push({
                ...nextConsistencyBadge,
                progress,
                percentage: (progress.current / progress.goal) * 100
            });
        }
    }


    if (upcoming.length === 0) {
        return null;
    }

    return (
        <Card>
            <h2 className="text-xl font-bold text-amber-700 dark:text-amber-400 mb-4 flex items-center">
                <SparklesIcon className="w-6 h-6 ml-2" />
                شارات قريبة التحقيق
            </h2>
            <div className="space-y-4">
                {upcoming.map(badge => (
                    badge && <div key={badge.id}>
                        <div className="flex justify-between items-center text-sm">
                            <span className="font-bold text-gray-800 dark:text-gray-200">{badge.name}</span>
                            <span className="text-gray-500 dark:text-gray-400">
                                {Math.floor(badge.progress.current).toLocaleString('ar-EG')} / {badge.progress.goal.toLocaleString('ar-EG')}
                            </span>
                        </div>
                        <ProgressBar progress={badge.percentage} />
                    </div>
                ))}
            </div>
        </Card>
    );
};

export default UpcomingBadges;