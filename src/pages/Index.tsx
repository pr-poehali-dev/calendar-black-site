import { useState, useMemo } from 'react';

const Index = () => {
  const [currentDate] = useState(new Date());

  const getMonthData = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    return {
      year,
      month,
      daysInMonth,
      startDayOfWeek,
      monthName: firstDay.toLocaleDateString('ru-RU', { month: 'long' }),
    };
  };

  const months = useMemo(() => {
    const current = currentDate.getMonth();
    const year = currentDate.getFullYear();
    
    return [
      getMonthData(year, current - 1 < 0 ? 11 : current - 1),
      getMonthData(year, current),
      getMonthData(year, current + 1 > 11 ? 0 : current + 1),
    ];
  }, [currentDate]);

  const isToday = (year: number, month: number, day: number) => {
    const today = currentDate;
    return (
      today.getFullYear() === year &&
      today.getMonth() === month &&
      today.getDate() === day
    );
  };

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const renderMonth = (monthData: ReturnType<typeof getMonthData>) => {
    const days = [];
    const { year, month, daysInMonth, startDayOfWeek, monthName } = monthData;
    
    const adjustedStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
    
    for (let i = 0; i < adjustedStartDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const isCurrentDay = isToday(year, month, day);
      days.push(
        <div
          key={day}
          className={`aspect-square flex items-center justify-center text-lg font-light transition-all duration-200 hover:scale-110 ${
            isCurrentDay
              ? 'bg-[#EF4444] rounded-full text-white font-medium'
              : 'text-white/90'
          }`}
        >
          {day}
        </div>
      );
    }

    return (
      <div className="flex flex-col space-y-4 animate-fade-in">
        <h2 className="text-2xl font-medium text-white/90 capitalize tracking-wide">
          {monthName} {year}
        </h2>
        <div className="grid grid-cols-7 gap-3">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-normal text-white/60 pb-2"
            >
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-8">
      <div className="max-w-7xl w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-16">
          {months.map((monthData, index) => (
            <div key={index} className="w-full">
              {renderMonth(monthData)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
