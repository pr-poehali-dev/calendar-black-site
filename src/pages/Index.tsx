import { useState, useEffect } from 'react';

export default function Index() {
  const [currentDate] = useState(new Date());

  const monthNames = [
    'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
    'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
  ];

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const getMonthData = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    
    let startDayOfWeek = firstDay.getDay();
    startDayOfWeek = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;

    const days = [];
    
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return { days, month, year };
  };

  const renderMonth = (monthData: { days: (number | null)[], month: number, year: number }) => {
    const { days, month, year } = monthData;
    const monthName = monthNames[month];
    
    const weeks = [];
    for (let i = 0; i < days.length; i += 7) {
      weeks.push(days.slice(i, i + 7));
    }

    const today = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return (
      <div className="flex flex-col space-y-4">
        <h2 className="text-3xl font-bold text-white capitalize tracking-wide text-center mb-2">
          {monthName} {year}
        </h2>
        <div className="flex flex-col gap-3">
          <div className="grid grid-cols-7 gap-3">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-lg font-medium text-white/70"
              >
                {day}
              </div>
            ))}
          </div>
          {weeks.map((week, idx) => (
            <div key={idx} className="grid grid-cols-7 gap-3">
              {week.map((day, dayIdx) => {
                const isToday = day === today && month === currentMonth && year === currentYear;
                
                return (
                  <div
                    key={dayIdx}
                    className={`aspect-square flex items-center justify-center text-2xl font-medium transition-all duration-200 ${
                      day === null
                        ? ''
                        : isToday
                        ? 'bg-red-500 rounded-full text-white'
                        : 'text-white hover:bg-white/10 rounded-full'
                    }`}
                  >
                    {day || ''}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getNextMonths = () => {
    const months = [];
    for (let i = 0; i < 3; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      months.push(getMonthData(date.getFullYear(), date.getMonth()));
    }
    return months;
  };

  const nextMonths = getNextMonths();

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://yastatic.net/s3/home/services/block/2.6/block.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 gap-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-7xl w-full">
        {nextMonths.map((monthData, idx) => (
          <div key={idx}>
            {renderMonth(monthData)}
          </div>
        ))}
      </div>
      
      <div className="mt-8">
        <div 
          className="pogoda-informer-2-6" 
          data-stick="false" 
          data-city="27612" 
          data-width="350" 
          data-height="150"
        />
      </div>
    </div>
  );
}