import { useState, useMemo } from 'react';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const currentDate = new Date();

  const getWeekNumber = (date: Date): number => {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
  };

  const getMonthData = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startDayOfWeek = firstDay.getDay();
    
    const weeks: number[] = [];
    for (let day = 1; day <= daysInMonth; day += 7) {
      const date = new Date(year, month, day);
      weeks.push(getWeekNumber(date));
    }
    
    return {
      year,
      month,
      daysInMonth,
      startDayOfWeek,
      monthName: firstDay.toLocaleDateString('ru-RU', { month: 'long' }),
      weeks,
    };
  };

  const months = useMemo(() => {
    const monthsData = [];
    for (let month = 0; month < 12; month++) {
      monthsData.push(getMonthData(selectedYear, month));
    }
    return monthsData;
  }, [selectedYear]);

  const isToday = (year: number, month: number, day: number) => {
    return (
      currentDate.getFullYear() === year &&
      currentDate.getMonth() === month &&
      currentDate.getDate() === day
    );
  };

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const renderMonth = (monthData: ReturnType<typeof getMonthData>) => {
    const days = [];
    const weekNumbers = [];
    const { year, month, daysInMonth, startDayOfWeek, monthName } = monthData;
    
    const adjustedStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
    
    let currentWeek = getWeekNumber(new Date(year, month, 1));
    let weekRowCount = 0;
    
    for (let i = 0; i < adjustedStartDay; i++) {
      days.push(<div key={`empty-${i}`} className="aspect-square" />);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const isCurrentDay = isToday(year, month, day);
      const dayOfWeek = new Date(year, month, day).getDay();
      const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      
      if (adjustedDay === 0 && day > 1) {
        currentWeek = getWeekNumber(new Date(year, month, day));
        weekRowCount++;
      }
      
      if (adjustedDay === 0) {
        weekNumbers.push(
          <div key={`week-${weekRowCount}`} className="flex items-center justify-center text-xs text-white/40 font-light">
            {currentWeek}
          </div>
        );
      }
      
      days.push(
        <div
          key={day}
          className={`aspect-square flex items-center justify-center text-base font-light transition-all duration-200 hover:scale-110 ${
            isCurrentDay
              ? 'bg-[#EF4444] rounded-full text-white font-medium'
              : 'text-white/90'
          }`}
        >
          {day}
        </div>
      );
    }

    if (weekNumbers.length === 0) {
      weekNumbers.push(
        <div key="week-0" className="flex items-center justify-center text-xs text-white/40 font-light">
          {currentWeek}
        </div>
      );
    }

    return (
      <div className="flex flex-col space-y-3">
        <h2 className="text-xl font-medium text-white/90 capitalize tracking-wide">
          {monthName}
        </h2>
        <div className="grid grid-cols-[auto_1fr] gap-2">
          <div className="flex flex-col gap-2 pt-8">
            {weekNumbers}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-normal text-white/50 pb-1"
              >
                {day}
              </div>
            ))}
            {days}
          </div>
        </div>
      </div>
    );
  };

  const handlePrevYear = () => {
    if (selectedYear > currentDate.getFullYear() - 5) {
      setSelectedYear(selectedYear - 1);
    }
  };

  const handleNextYear = () => {
    if (selectedYear < currentDate.getFullYear() + 5) {
      setSelectedYear(selectedYear + 1);
    }
  };

  return (
    <div className="min-h-screen bg-black p-4 md:p-8">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-center gap-6 mb-8 sticky top-4 z-10 bg-black/80 backdrop-blur-sm py-4 rounded-lg">
          <button
            onClick={handlePrevYear}
            disabled={selectedYear <= currentDate.getFullYear() - 5}
            className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Icon name="ChevronLeft" size={28} className="text-white" />
          </button>
          <h1 className="text-4xl font-bold text-white tracking-wider">
            {selectedYear}
          </h1>
          <button
            onClick={handleNextYear}
            disabled={selectedYear >= currentDate.getFullYear() + 5}
            className="p-2 rounded-full hover:bg-white/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <Icon name="ChevronRight" size={28} className="text-white" />
          </button>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 md:gap-10">
          {months.map((monthData, index) => (
            <div key={index} className="w-full animate-fade-in">
              {renderMonth(monthData)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Index;
