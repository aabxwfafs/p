import React from 'react';
import Card from './Card';
import { LightBulbIcon, ArrowRightIcon } from './Icons';

interface TipsProps {
    setCurrentView: (view: 'dashboard' | 'settingsMenu' | 'history' | 'about' | 'tips' | 'badges') => void;
}

const tips = [
    { title: 'الإخلاص لله', content: 'جدد نيتك دائمًا بأن يكون حفظك خالصًا لوجه الله تعالى، فهو أساس التوفيق والبركة.' },
    { title: 'اختر وقتًا ومكانًا مناسبين', content: 'أفضل الأوقات هي التي يكون فيها الذهن صافيًا، مثل بعد صلاة الفجر. واختر مكانًا هادئًا بعيدًا عن المشتتات.' },
    { title: 'التكرار هو مفتاح الإتقان', content: 'لا تستهن بقوة التكرار. كرر الآيات الجديدة عددًا كبيرًا من المرات حتى تثبت في ذهنك.' },
    { title: 'الربط بين الآيات', content: 'حاول فهم معنى الآيات واربط بينها وبين ما قبلها وما بعدها. هذا يساعد على ترسيخ الحفظ.' },
    { title: 'المراجعة الدائمة', content: 'المراجعة أهم من الحفظ الجديد. اجعل لك وردًا ثابتًا لمراجعة ما حفظته، فالقرآن تفلتُه أشد من تفلت الإبل.' },
    { title: 'استمع إلى قارئ متقن', content: 'الاستماع يساعد على تصحيح النطق وتثبيت الحفظ. استمع للآيات التي تحفظها من قارئك المفضل.' },
    { title: 'الصلاة بما تحفظ', content: 'صلِّ بالآيات الجديدة في صلواتك ونوافلك، فهذا من أعظم طرق تثبيت المحفوظ.' },
    { title: 'الصحبة الصالحة', content: 'ابحث عن صديق يعينك على الحفظ وتسمع له ويسمع لك، فالصحبة الصالحة من أكبر المحفزات.' },
];

const TipCard: React.FC<{ title: string; content: string }> = ({ title, content }) => (
    <div className="bg-amber-50 dark:bg-amber-900/40 border-r-4 border-amber-400 dark:border-amber-600 p-4 rounded-lg shadow-sm">
        <h3 className="font-bold text-amber-900 dark:text-amber-300">{title}</h3>
        <p className="text-amber-800 dark:text-amber-300/90 text-sm mt-1">{content}</p>
    </div>
);

const Tips: React.FC<TipsProps> = ({ setCurrentView }) => {
    return (
        <div className="p-4 md:p-8 max-w-3xl mx-auto">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-teal-800 dark:text-teal-300 flex items-center">
                    <LightBulbIcon className="w-8 h-8 ml-3" />
                    نصائح للحفظ والمراجعة
                </h1>
                <button 
                    onClick={() => setCurrentView('settingsMenu')} 
                    className="text-gray-500 hover:text-teal-600 dark:hover:text-teal-400 transition"
                    aria-label="الرجوع إلى الإعدادات"
                >
                    <ArrowRightIcon className="w-8 h-8" />
                </button>
            </header>
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {tips.map((tip, index) => (
                        <TipCard key={index} title={tip.title} content={tip.content} />
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default Tips;