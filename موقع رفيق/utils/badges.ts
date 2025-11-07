import { UserData, Badge } from '../types';
import { BookOpenIcon, RefreshIcon, TrophyIcon, ShieldCheckIcon, SparklesIcon } from '../components/Icons';

// --- Helper Functions ---

const getTotalMemorized = (userData: UserData): number => {
    const progressPages = userData.progress.reduce((sum, p) => sum + p.memorizedPages, 0);
    return userData.initialMemorizedPages + progressPages;
};

const getMemorizationStreak = (userData: UserData): number => {
    if (userData.progress.length === 0) return 0;

    const sortedProgress = [...userData.progress]
        .filter(p => p.memorizedPages > 0)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    if (sortedProgress.length === 0) return 0;
    
    const today = new Date();
    today.setHours(0,0,0,0);
    const lastProgressDate = new Date(sortedProgress[0].date);
    lastProgressDate.setHours(0,0,0,0);

    const oneDay = 24 * 60 * 60 * 1000;
    const diffDays = Math.round(Math.abs((today.getTime() - lastProgressDate.getTime()) / oneDay));

    if (diffDays > 1) {
        return 0; // Streak is broken
    }
    
    let streak = 1;
    for (let i = 0; i < sortedProgress.length - 1; i++) {
        const currentDate = new Date(sortedProgress[i].date);
        const prevDate = new Date(sortedProgress[i+1].date);
        const dayDiff = Math.round((currentDate.getTime() - prevDate.getTime()) / oneDay);
        if (dayDiff === 1) {
            streak++;
        } else {
            break;
        }
    }
    return streak;
}


// --- Badge Definitions ---

export const allBadges: Badge[] = [
    // Memorization Badges (Ordered by goal)
    {
        id: 'memo_juz_1',
        name: 'حافظ جزء',
        description: 'إتمام حفظ جزء كامل من القرآن (23 صفحة)',
        category: 'memorization',
        icon: BookOpenIcon,
        checkEarned: (data) => getTotalMemorized(data) >= 23,
        getProgress: (data) => ({ current: Math.min(23, getTotalMemorized(data)), goal: 23 }),
    },
    {
        id: 'memo_juz_5',
        name: 'حافظ 5 أجزاء',
        description: 'إتمام حفظ 5 أجزاء من القرآن (103 صفحات)',
        category: 'memorization',
        icon: BookOpenIcon,
        checkEarned: (data) => getTotalMemorized(data) >= 103,
        getProgress: (data) => ({ current: Math.min(103, getTotalMemorized(data)), goal: 103 }),
    },
    {
        id: 'memo_juz_15',
        name: 'حافظ نصف القرآن',
        description: 'إتمام حفظ 15 جزءًا من القرآن (303 صفحات)',
        category: 'memorization',
        icon: TrophyIcon,
        checkEarned: (data) => getTotalMemorized(data) >= 303,
        getProgress: (data) => ({ current: Math.min(303, getTotalMemorized(data)), goal: 303 }),
    },
    {
        id: 'memo_quran',
        name: 'حافظ القرآن الكريم',
        description: 'إتمام حفظ القرآن الكريم كاملاً (604 صفحات)',
        category: 'memorization',
        icon: TrophyIcon,
        checkEarned: (data) => getTotalMemorized(data) >= 604,
        getProgress: (data) => ({ current: Math.min(604, getTotalMemorized(data)), goal: 604 }),
    },

    // Revision Badges (Ordered by goal)
    {
        id: 'rev_khatma_1',
        name: 'الختمة الأولى',
        description: 'إتمام أول ختمة مراجعة للمحفوظ',
        category: 'revision',
        icon: RefreshIcon,
        checkEarned: (data) => data.revisionKhatmaCount >= 1,
        getProgress: (data) => ({ current: Math.min(1, data.revisionKhatmaCount), goal: 1 }),
    },
    {
        id: 'rev_khatma_2',
        name: 'ختمتان',
        description: 'إتمام ختمتي مراجعة',
        category: 'revision',
        icon: RefreshIcon,
        checkEarned: (data) => data.revisionKhatmaCount >= 2,
        getProgress: (data) => ({ current: Math.min(2, data.revisionKhatmaCount), goal: 2 }),
    },
    {
        id: 'rev_khatma_5',
        name: 'خمس ختمات',
        description: 'إتمام 5 ختمات مراجعة',
        category: 'revision',
        icon: RefreshIcon,
        checkEarned: (data) => data.revisionKhatmaCount >= 5,
        getProgress: (data) => ({ current: Math.min(5, data.revisionKhatmaCount), goal: 5 }),
    },
     {
        id: 'rev_khatma_10',
        name: 'عشر ختمات',
        description: 'إتمام 10 ختمات مراجعة',
        category: 'revision',
        icon: SparklesIcon,
        checkEarned: (data) => data.revisionKhatmaCount >= 10,
        getProgress: (data) => ({ current: Math.min(10, data.revisionKhatmaCount), goal: 10 }),
    },
    {
        id: 'rev_khatma_20',
        name: 'عشرون ختمة',
        description: 'إتمام 20 ختمة مراجعة',
        category: 'revision',
        icon: SparklesIcon,
        checkEarned: (data) => data.revisionKhatmaCount >= 20,
        getProgress: (data) => ({ current: Math.min(20, data.revisionKhatmaCount), goal: 20 }),
    },
    {
        id: 'rev_khatma_50',
        name: 'خمسون ختمة',
        description: 'إتمام 50 ختمة مراجعة',
        category: 'revision',
        icon: SparklesIcon,
        checkEarned: (data) => data.revisionKhatmaCount >= 50,
        getProgress: (data) => ({ current: Math.min(50, data.revisionKhatmaCount), goal: 50 }),
    },
    {
        id: 'rev_khatma_100',
        name: 'مائة ختمة',
        description: 'إتمام 100 ختمة مراجعة',
        category: 'revision',
        icon: TrophyIcon,
        checkEarned: (data) => data.revisionKhatmaCount >= 100,
        getProgress: (data) => ({ current: Math.min(100, data.revisionKhatmaCount), goal: 100 }),
    },
    {
        id: 'rev_khatma_250',
        name: 'رفيق القرآن',
        description: 'إتمام 250 ختمة مراجعة',
        category: 'revision',
        icon: TrophyIcon,
        checkEarned: (data) => data.revisionKhatmaCount >= 250,
        getProgress: (data) => ({ current: Math.min(250, data.revisionKhatmaCount), goal: 250 }),
    },
    {
        id: 'rev_khatma_500',
        name: 'صاحب القرآن',
        description: 'إتمام 500 ختمة مراجعة',
        category: 'revision',
        icon: TrophyIcon,
        checkEarned: (data) => data.revisionKhatmaCount >= 500,
        getProgress: (data) => ({ current: Math.min(500, data.revisionKhatmaCount), goal: 500 }),
    },
    {
        id: 'rev_khatma_1000',
        name: 'أهل القرآن',
        description: 'إتمام 1000 ختمة مراجعة',
        category: 'revision',
        icon: TrophyIcon,
        checkEarned: (data) => data.revisionKhatmaCount >= 1000,
        getProgress: (data) => ({ current: Math.min(1000, data.revisionKhatmaCount), goal: 1000 }),
    },

    // Consistency Badges (Ordered by goal)
    {
        id: 'con_streak_7',
        name: 'همة أسبوع',
        description: 'المواظبة على الحفظ لمدة 7 أيام متتالية',
        category: 'consistency',
        icon: ShieldCheckIcon,
        checkEarned: (data) => getMemorizationStreak(data) >= 7,
        getProgress: (data) => ({ current: Math.min(7, getMemorizationStreak(data)), goal: 7 }),
    },
    {
        id: 'con_streak_30',
        name: 'نفس طويل',
        description: 'المواظبة على الحفظ لمدة 30 يومًا متتاليًا',
        category: 'consistency',
        icon: ShieldCheckIcon,
        checkEarned: (data) => getMemorizationStreak(data) >= 30,
        getProgress: (data) => ({ current: Math.min(30, getMemorizationStreak(data)), goal: 30 }),
    },
    {
        id: 'con_streak_90',
        name: 'همة 3 أشهر',
        description: 'المواظبة على الحفظ لمدة 90 يومًا متتاليًا',
        category: 'consistency',
        icon: ShieldCheckIcon,
        checkEarned: (data) => getMemorizationStreak(data) >= 90,
        getProgress: (data) => ({ current: Math.min(90, getMemorizationStreak(data)), goal: 90 }),
    },
    {
        id: 'con_streak_180',
        name: 'مثابرة نصف عام',
        description: 'المواظبة على الحفظ لمدة 180 يومًا متتاليًا',
        category: 'consistency',
        icon: ShieldCheckIcon,
        checkEarned: (data) => getMemorizationStreak(data) >= 180,
        getProgress: (data) => ({ current: Math.min(180, getMemorizationStreak(data)), goal: 180 }),
    },
    {
        id: 'con_streak_365',
        name: 'رفقة عام',
        description: 'المواظبة على الحفظ لمدة 365 يومًا متتاليًا',
        category: 'consistency',
        icon: SparklesIcon,
        checkEarned: (data) => getMemorizationStreak(data) >= 365,
        getProgress: (data) => ({ current: Math.min(365, getMemorizationStreak(data)), goal: 365 }),
    },
    {
        id: 'con_streak_547',
        name: 'عام ونصف من العطاء',
        description: 'المواظبة على الحفظ لمدة 547 يومًا متتاليًا',
        category: 'consistency',
        icon: SparklesIcon,
        checkEarned: (data) => getMemorizationStreak(data) >= 547,
        getProgress: (data) => ({ current: Math.min(547, getMemorizationStreak(data)), goal: 547 }),
    },
    {
        id: 'con_streak_730',
        name: 'رفقة عامين',
        description: 'المواظبة على الحفظ لمدة عامين كاملين',
        category: 'consistency',
        icon: TrophyIcon,
        checkEarned: (data) => getMemorizationStreak(data) >= 730,
        getProgress: (data) => ({ current: Math.min(730, getMemorizationStreak(data)), goal: 730 }),
    },
];