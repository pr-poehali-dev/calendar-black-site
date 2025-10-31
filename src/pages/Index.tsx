import { useState, useEffect } from 'react';

export default function Index() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    'январь', 'февраль', 'март', 'апрель', 'май', 'июнь',
    'июль', 'август', 'сентябрь', 'октябрь', 'ноябрь', 'декабрь'
  ];

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

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
      <div className="flex flex-col space-y-3">
        <h2 className="text-2xl font-bold text-white capitalize tracking-wide text-center">
          {monthName} {year}
        </h2>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-white/70"
              >
                {day}
              </div>
            ))}
          </div>
          {weeks.map((week, idx) => (
            <div key={idx} className="grid grid-cols-7 gap-2">
              {week.map((day, dayIdx) => {
                const isToday = day === today && month === currentMonth && year === currentYear;
                
                return (
                  <div
                    key={dayIdx}
                    className={`aspect-square flex items-center justify-center text-lg font-medium transition-all duration-200 ${
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

  const getThreeMonths = () => {
    const months = [];
    const now = new Date();
    
    for (let i = -1; i <= 1; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() + i, 1);
      months.push(getMonthData(date.getFullYear(), date.getMonth()));
    }
    
    return months;
  };

  const threeMonths = getThreeMonths();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-12">
        {threeMonths.map((monthData, index) => (
          <div key={index}>
            {renderMonth(monthData)}
          </div>
        ))}
      </div>
    </div>
  );
}
