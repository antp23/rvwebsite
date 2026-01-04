import React, { useState, useEffect } from 'react';
import { getCalendar } from '../utils/api';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday } from 'date-fns';

const Calendar = () => {
  const [calendarData, setCalendarData] = useState({});
  const [currentDate, setCurrentDate] = useState(new Date());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCalendar();
  }, [currentDate]);

  const fetchCalendar = async () => {
    setLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;

      const response = await getCalendar({ year, month });
      setCalendarData(response.data.data);
    } catch (err) {
      console.error('Failed to load calendar:', err);
    } finally {
      setLoading(false);
    }
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Get day status
  const getDayStatus = (date) => {
    const dateKey = format(date, 'yyyy-MM-dd');
    const logs = calendarData[dateKey];

    if (!logs || logs.length === 0) return 'empty';

    const statuses = logs.map(log => log.status);
    if (statuses.includes('completed')) return 'completed';
    if (statuses.includes('partial')) return 'partial';
    if (statuses.includes('skipped')) return 'skipped';

    return 'empty';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'partial':
        return 'bg-yellow-500';
      case 'skipped':
        return 'bg-red-500';
      default:
        return 'bg-gray-200';
    }
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={previousMonth}
              className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Previous
            </button>
            <button
              onClick={nextMonth}
              className="px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span>Partial</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span>Skipped</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gray-200 rounded"></div>
            <span>No workout</span>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-center font-medium text-gray-700 py-2">
              {day}
            </div>
          ))}

          {/* Empty cells for days before month starts */}
          {Array.from({ length: monthStart.getDay() }).map((_, idx) => (
            <div key={`empty-${idx}`} className="aspect-square"></div>
          ))}

          {/* Month days */}
          {monthDays.map(day => {
            const status = getDayStatus(day);
            const today = isToday(day);

            return (
              <div
                key={day.toString()}
                className={`aspect-square flex flex-col items-center justify-center rounded-lg border ${
                  today ? 'border-primary-600 border-2' : 'border-gray-200'
                } ${getStatusColor(status)} ${status === 'empty' ? 'text-gray-900' : 'text-white font-semibold'}`}
              >
                <span className="text-sm">{format(day, 'd')}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
