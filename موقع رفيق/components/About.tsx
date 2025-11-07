import React from 'react';
import Card from './Card';
import { InformationCircleIcon, ArrowRightIcon } from './Icons';

interface AboutProps {
    setCurrentView: (view: 'dashboard' | 'settingsMenu' | 'history' | 'about' | 'tips' | 'badges') => void;
}

const About: React.FC<AboutProps> = ({ setCurrentView }) => {
    return (
        <div className="p-4 md:p-8 max-w-3xl mx-auto">
            <header className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-teal-800 dark:text-teal-300 flex items-center">
                    <InformationCircleIcon className="w-8 h-8 ml-3" />
                    نبذة عن التطبيق
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
                <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                    <p className="font-bold text-xl text-teal-700 dark:text-teal-400">بسم الله الرحمن الرحيم</p>
                    <p>
                        "رفيق الحفظ القرآني" هو رفيقك الرقمي في رحلة حفظ ومراجعة القرآن الكريم. تم تصميم هذا التطبيق ليكون عونًا لك على تنظيم وردك اليومي، وتتبع إنجازك، وتحفيزك على الاستمرار بثبات نحو هدفك السامي.
                    </p>
                    <p>
                        نحن نؤمن بأن التكنولوجيا يمكن أن تكون أداة قوية في خدمة كتاب الله. من خلال واجهة بسيطة وميزات عملية، نسعى لمساعدتك على بناء علاقة قوية ومنظمة مع القرآن، قائمة على أفضل تقنيات متابعة الحفظ والمراجعة الدورية.
                    </p>
                    <p>
                        هدفنا هو أن نجعل عملية المتابعة سهلة ومحفزة، لتتفرغ أنت للتركيز على الأهم: التمعن في آيات الله وحفظها في صدرك.
                    </p>
                    <p className="text-center font-semibold text-gray-800 dark:text-gray-200">
                        نسأل الله أن يتقبل منا ومنكم، وأن يجعلنا من أهل القرآن الذين هم أهل الله وخاصته.
                    </p>
                </div>
            </Card>
        </div>
    );
};

export default About;