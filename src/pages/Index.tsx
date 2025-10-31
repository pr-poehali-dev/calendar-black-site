import { useState, useMemo, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const currentDate = new Date();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

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
    
    return {
      year,
      month,
      daysInMonth,
      startDayOfWeek,
      monthName: firstDay.toLocaleDateString('ru-RU', { month: 'long' }),
    };
  };

  const months = useMemo(() => {
    const monthsData = [];
    for (let month = 0; month < 12; month++) {
      monthsData.push(getMonthData(selectedYear, month));
    }
    return monthsData;
  }, [selectedYear]);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const monthElements = container.querySelectorAll('[data-month]');
      if (monthElements[selectedMonth]) {
        const element = monthElements[selectedMonth] as HTMLElement;
        const containerHeight = container.clientHeight;
        const elementTop = element.offsetTop;
        const elementHeight = element.offsetHeight;
        const scrollTo = elementTop - (containerHeight / 2) + (elementHeight / 2);
        
        container.scrollTo({
          top: scrollTo,
          behavior: 'smooth'
        });
      }
    }
  }, [selectedMonth, selectedYear]);

  const isToday = (year: number, month: number, day: number) => {
    return (
      currentDate.getFullYear() === year &&
      currentDate.getMonth() === month &&
      currentDate.getDate() === day
    );
  };

  const weekDays = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

  const renderMonth = (monthData: ReturnType<typeof getMonthData>, isActive: boolean) => {
    const { year, month, daysInMonth, startDayOfWeek, monthName } = monthData;
    
    const adjustedStartDay = startDayOfWeek === 0 ? 6 : startDayOfWeek - 1;
    
    const weeks: Array<{ weekNumber: number; days: JSX.Element[] }> = [];
    let currentWeekDays: JSX.Element[] = [];
    let currentWeek = getWeekNumber(new Date(year, month, 1));
    
    for (let i = 0; i < adjustedStartDay; i++) {
      currentWeekDays.push(<div key={`empty-${i}`} className="aspect-square" />);
    }
    
    for (let day = 1; day <= daysInMonth; day++) {
      const isCurrentDay = isToday(year, month, day);
      const dayOfWeek = new Date(year, month, day).getDay();
      const adjustedDay = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
      
      currentWeekDays.push(
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
      
      if (adjustedDay === 6 || day === daysInMonth) {
        while (currentWeekDays.length < 7) {
          currentWeekDays.push(<div key={`empty-end-${currentWeekDays.length}`} className="aspect-square" />);
        }
        weeks.push({ weekNumber: currentWeek, days: currentWeekDays });
        currentWeekDays = [];
        if (day < daysInMonth) {
          currentWeek = getWeekNumber(new Date(year, month, day + 1));
        }
      }
    }

    return (
      <div 
        className={`flex flex-col space-y-3 transition-opacity duration-300 ${
          isActive ? 'opacity-100' : 'opacity-50'
        }`}
        data-month={month}
      >
        <h2 className="text-2xl font-medium text-white/90 capitalize tracking-wide text-center">
          {monthName}
        </h2>
        <div className="flex flex-col gap-2">
          <div className="grid grid-cols-[auto_repeat(7,1fr)] gap-2 items-center">
            <div className="text-xs text-gray-500"></div>
            {weekDays.map((day) => (
              <div
                key={day}
                className="text-center text-xs font-normal text-white/50"
              >
                {day}
              </div>
            ))}
          </div>
          {weeks.map((week, idx) => (
            <div key={idx} className="grid grid-cols-[auto_repeat(7,1fr)] gap-2 items-center">
              <div className="text-xs text-gray-500 font-light text-right pr-1 w-6">
                {week.weekNumber}
              </div>
              {week.days}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      if (selectedYear > currentDate.getFullYear() - 5) {
        setSelectedYear(selectedYear - 1);
        setSelectedMonth(11);
      }
    } else {
      setSelectedMonth(selectedMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      if (selectedYear < currentDate.getFullYear() + 5) {
        setSelectedYear(selectedYear + 1);
        setSelectedMonth(0);
      }
    } else {
      setSelectedMonth(selectedMonth + 1);
    }
  };

  return (
    <div className="h-screen bg-black flex flex-col overflow-hidden">
      <div className="flex items-center justify-center gap-6 py-4 px-4 sticky top-0 z-10 bg-black/90 backdrop-blur-sm border-b border-white/10">
        <button
          onClick={handlePrevMonth}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <Icon name="ChevronUp" size={24} className="text-white" />
        </button>
        <h1 className="text-3xl font-bold text-white tracking-wider min-w-[120px] text-center">
          {selectedYear}
        </h1>
        <button
          onClick={handleNextMonth}
          className="p-2 rounded-full hover:bg-white/10 transition-colors"
        >
          <Icon name="ChevronDown" size={24} className="text-white" />
        </button>
      </div>
      
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto snap-y snap-mandatory scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        <div className="flex flex-col items-center gap-16 py-8 px-4">
          {months.map((monthData, index) => (
            <div 
              key={index} 
              className="w-full max-w-md snap-center"
            >
              {renderMonth(monthData, index === selectedMonth)}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default Index;
