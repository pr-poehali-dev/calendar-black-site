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

  const formatTime = (date: Date) => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const formatDate = (date: Date) => {
    const weekDayNames = ['воскресенье', 'понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота'];
    const monthNamesGenitive = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'];
    
    const weekDay = weekDayNames[date.getDay()];
    const day = date.getDate();
    const month = monthNamesGenitive[date.getMonth()];
    
    return `${weekDay}, ${day} ${month}`;
  };

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
                    className={`aspect-square flex items-center justify-center text-6xl font-medium transition-all duration-200 ${
                      day === null
                        ? ''
                        : isToday
                        ? 'border-[12px] border-red-500 text-white'
                        : 'text-white hover:bg-white/10'
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

  const getWeekNumber = (date: Date) => {
    const target = new Date(date.valueOf());
    const dayNr = (date.getDay() + 6) % 7;
    target.setDate(target.getDate() - dayNr + 3);
    const firstThursday = target.valueOf();
    target.setMonth(0, 1);
    if (target.getDay() !== 4) {
      target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    }
    return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
  };

  const renderMiniMonth = (year: number, month: number) => {
    const monthData = getMonthData(year, month);
    const monthName = monthNames[month];
    const weeks = [];
    
    for (let i = 0; i < monthData.days.length; i += 7) {
      weeks.push(monthData.days.slice(i, i + 7));
    }

    const today = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return (
      <div className="flex flex-col gap-1 mb-4">
        <h3 className="text-xs font-bold text-white/80 capitalize text-center mb-1">
          {monthName} {year}
        </h3>
        <div className="flex gap-1">
          <div className="flex flex-col gap-1 pt-5">
            {weeks.map((week, idx) => {
              const firstDayOfWeek = week.find(d => d !== null);
              if (!firstDayOfWeek) return <div key={idx} className="h-4" />;
              const weekNum = getWeekNumber(new Date(year, month, firstDayOfWeek));
              return (
                <div key={idx} className="text-[10px] text-white/50 w-6 h-4 flex items-center justify-center">
                  {weekNum}
                </div>
              );
            })}
          </div>
          <div className="flex-1">
            <div className="grid grid-cols-7 gap-1 mb-1">
              {['П', 'В', 'С', 'Ч', 'П', 'С', 'В'].map((day, i) => (
                <div key={i} className="text-[8px] text-white/50 text-center">
                  {day}
                </div>
              ))}
            </div>
            {weeks.map((week, idx) => (
              <div key={idx} className="grid grid-cols-7 gap-1 mb-1">
                {week.map((day, dayIdx) => {
                  const isToday = day === today && month === currentMonth && year === currentYear;
                  return (
                    <div
                      key={dayIdx}
                      className={`text-[10px] flex items-center justify-center h-4 ${
                        day === null
                          ? ''
                          : isToday
                          ? 'bg-red-500 rounded-full text-white font-bold'
                          : 'text-white/70'
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
      </div>
    );
  };

  const currentMonth = getMonthData(currentDate.getFullYear(), currentDate.getMonth());
  
  const allMonths = [];
  const currentYear = currentDate.getFullYear();
  const currentMonthIndex = currentDate.getMonth();
  
  for (let yearOffset = -2; yearOffset <= 2; yearOffset++) {
    for (let month = 0; month < 12; month++) {
      allMonths.push({
        year: currentYear + yearOffset,
        month: month
      });
    }
  }
  
  const currentMonthPosition = (2 * 12) + currentMonthIndex;

  return (
    <div className="h-screen bg-black flex overflow-hidden">
      <div className="w-1/3 relative flex flex-col justify-between p-12">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80)'
          }}
        >
          <div className="absolute inset-0 bg-black/40" />
        </div>
        
        <div className="relative z-10 flex flex-col items-center space-y-6 pt-12">
          <div className="text-9xl font-bold text-white tracking-wider">
            {formatTime(currentDate)}
          </div>
          <div className="text-2xl text-white/90 font-medium">
            {formatDate(currentDate)}
          </div>
        </div>

        <div className="relative z-10 flex justify-center pb-8">
          <div 
            className="pogoda-informer-2-6" 
            data-stick="false" 
            data-city="27612" 
            data-width="350" 
            data-height="150"
          />
        </div>
      </div>

      <div className="w-1/2 flex items-center justify-center p-12">
        <div className="w-full max-w-3xl">
          {renderMonth(currentMonth)}
        </div>
      </div>

      <div className="w-1/6 bg-black/50 p-4 overflow-y-auto" ref={(el) => {
        if (el) {
          const targetElement = el.children[0]?.children[currentMonthPosition] as HTMLElement;
          if (targetElement) {
            setTimeout(() => {
              targetElement.scrollIntoView({ block: 'center', behavior: 'auto' });
            }, 100);
          }
        }
      }}>
        <div className="space-y-2">
          {allMonths.map(({ year, month }, idx) => (
            <div key={`${year}-${month}`}>
              {renderMiniMonth(year, month)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}