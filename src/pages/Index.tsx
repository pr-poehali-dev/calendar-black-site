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
    }, 1000);
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
      <div className="flex flex-col space-y-6">
        <h2 className="text-5xl font-bold text-white capitalize tracking-wide text-center mb-4">
          {monthName} {year}
        </h2>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-7 gap-4">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xl font-medium text-white/70"
              >
                {day}
              </div>
            ))}
          </div>
          {weeks.map((week, idx) => (
            <div key={idx} className="grid grid-cols-7 gap-4">
              {week.map((day, dayIdx) => {
                const isToday = day === today && month === currentMonth && year === currentYear;
                
                return (
                  <div
                    key={dayIdx}
                    className={`aspect-square flex items-center justify-center text-3xl font-medium transition-all duration-200 ${
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

  const getCurrentMonth = () => {
    return getMonthData(currentDate.getFullYear(), currentDate.getMonth());
  };

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDate = (date: Date) => {
    const weekDays = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
    const months = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    
    const weekDay = weekDays[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    
    return `${weekDay}, ${day} ${month}`;
  };

  const currentMonth = getCurrentMonth();

  return (
    <div className="h-screen bg-black flex overflow-hidden">
      <div className="w-1/3 relative flex flex-col items-center justify-start p-12 pt-24">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://cdn.poehali.dev/files/9d7c6d6f-3af7-4586-bdb1-281422a811b7.jpg)'
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center space-y-6">
          <div className="text-9xl font-bold text-white tracking-wider">
            {formatTime(currentDate)}
          </div>
          <div className="text-2xl text-white/90 font-medium">
            {formatDate(currentDate)}
          </div>
        </div>
      </div>

      <div className="w-2/3 flex items-center justify-center p-12">
        <div className="w-full max-w-4xl">
          {renderMonth(currentMonth)}
        </div>
      </div>
    </div>
  );
}