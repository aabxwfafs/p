import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ProgressEntry } from '../types';
import Card from './Card';
import { ChartBarIcon, RefreshIcon } from './Icons';

interface ProgressChartProps {
  progress: ProgressEntry[];
}

const ProgressChart: React.FC<ProgressChartProps> = ({ progress }) => {
  const processDataForDailyChart = () => {
    const days = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
    const last7DaysData: { name: string; حفظ: number; مراجعة: number }[] = [];
    const today = new Date();

    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dayName = days[date.getDay()];
      const dateString = date.toISOString().split('T')[0];

      const entry = progress.find(p => p.date === dateString);
      last7DaysData.push({
        name: dayName,
        'حفظ': entry ? entry.memorizedPages : 0,
        'مراجعة': entry ? entry.revisedPages : 0,
      });
    }
    return last7DaysData;
  };
  
  const processDataForWeeklyChart = () => {
    const weeklyBuckets = Array.from({ length: 4 }, () => ({ 'حفظ': 0, 'مراجعة': 0 }));
    const today = new Date();
    const oneDay = 24 * 60 * 60 * 1000;
    // Use start of today for consistent calculations
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const todayMs = todayStart.getTime();

    progress.forEach(entry => {
      const entryDate = new Date(entry.date);
      // Use start of entry date
      const entryDateStart = new Date(entryDate.getFullYear(), entryDate.getMonth(), entryDate.getDate());
      const entryDateMs = entryDateStart.getTime();

      const diffDays = Math.floor((todayMs - entryDateMs) / oneDay);
      
      if (diffDays >= 0 && diffDays < 28) {
        // Week 4 (most recent) is index 3, Week 1 is index 0
        const weekIndex = 3 - Math.floor(diffDays / 7);
        if (weeklyBuckets[weekIndex]) {
            weeklyBuckets[weekIndex]['حفظ'] += entry.memorizedPages;
            weeklyBuckets[weekIndex]['مراجعة'] += entry.revisedPages;
        }
      }
    });

    return weeklyBuckets.map((bucket, index) => ({
        name: `الأسبوع ${index + 1}`,
        'حفظ': bucket['حفظ'],
        'مراجعة': bucket['مراجعة'],
    }));
  };

  const dailyChartData = processDataForDailyChart();
  const weeklyChartData = processDataForWeeklyChart();
  
  const commonTooltipProps = {
    contentStyle: {
      backgroundColor: 'rgba(31, 41, 55, 0.9)',
      border: '1px solid #4b5563',
      borderRadius: '0.5rem',
      direction: 'rtl' as const,
      color: '#e5e7eb'
    },
    itemStyle: { color: '#e5e7eb' },
    cursor: { fill: 'rgba(128, 128, 128, 0.1)' }
  };

  return (
    <Card>
      <div className="space-y-12">
        <div>
          <h2 className="text-xl font-bold text-teal-700 dark:text-teal-400 mb-4 flex items-center">
              <ChartBarIcon className="w-6 h-6 ml-2" />
              <span>تقدم الحفظ في آخر 7 أيام</span>
          </h2>
          <div className="h-64" style={{ minWidth: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyChartData} margin={{ top: 5, right: 2, left: -20, bottom: 5 }} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)"/>
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'rgb(107 114 128)', fontSize: 12 }} 
                  interval={0} 
                />
                <YAxis allowDecimals={false} tick={{ fill: 'rgb(107 114 128)' }}/>
                <Tooltip {...commonTooltipProps} />
                <Bar dataKey="حفظ" fill="#38b2ac" name="صفحات الحفظ" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-4 flex items-center">
              <RefreshIcon className="w-6 h-6 ml-2" />
              <span>تقدم المراجعة في آخر 7 أيام</span>
          </h2>
          <div className="h-64" style={{ minWidth: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyChartData} margin={{ top: 5, right: 2, left: -20, bottom: 5 }} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)"/>
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'rgb(107 114 128)', fontSize: 12 }} 
                  interval={0} 
                />
                <YAxis allowDecimals={false} tick={{ fill: 'rgb(107 114 128)' }}/>
                <Tooltip {...commonTooltipProps} />
                <Bar dataKey="مراجعة" fill="#4299e1" name="صفحات المراجعة" radius={[4, 4, 0, 0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-teal-700 dark:text-teal-400 mb-4 flex items-center">
              <ChartBarIcon className="w-6 h-6 ml-2" />
              <span>تقدم الحفظ في آخر 4 أسابيع</span>
          </h2>
          <div className="h-64" style={{ minWidth: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyChartData} margin={{ top: 5, right: 2, left: -20, bottom: 5 }} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)"/>
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'rgb(107 114 128)', fontSize: 12 }} 
                  interval={0} 
                />
                <YAxis allowDecimals={false} tick={{ fill: 'rgb(107 114 128)' }}/>
                <Tooltip {...commonTooltipProps} />
                <Bar dataKey="حفظ" fill="#38b2ac" name="صفحات الحفظ" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-blue-700 dark:text-blue-400 mb-4 flex items-center">
              <RefreshIcon className="w-6 h-6 ml-2" />
              <span>تقدم المراجعة في آخر 4 أسابيع</span>
          </h2>
          <div className="h-64" style={{ minWidth: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyChartData} margin={{ top: 5, right: 2, left: -20, bottom: 5 }} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)"/>
                <XAxis 
                  dataKey="name" 
                  tick={{ fill: 'rgb(107 114 128)', fontSize: 12 }} 
                  interval={0} 
                />
                <YAxis allowDecimals={false} tick={{ fill: 'rgb(107 114 128)' }}/>
                <Tooltip {...commonTooltipProps} />
                <Bar dataKey="مراجعة" fill="#4299e1" name="صفحات المراجعة" radius={[4, 4, 0, 0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProgressChart;