import React, { useMemo, useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

// Helper: get Date in IST at midnight
function getISTToday() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const istOffset = 5.5 * 60 * 60 * 1000;
  const ist = new Date(utc + istOffset);
  ist.setHours(0, 0, 0, 0);
  return ist;
}

// Helper: UTC seconds to YYYY-MM-DD in IST
function getISTDateString(creationTimeSeconds) {
  const utc = new Date(creationTimeSeconds * 1000);
  const istOffset = 5.5 * 60 * 60 * 1000;
  const ist = new Date(utc.getTime() + istOffset);
  return ist.toISOString().slice(0, 10);
}

// Format heatmap data
function formatHeatmapData(submissions) {
  const dateCount = {};
  submissions.forEach(sub => {
    const date = getISTDateString(sub.creationTimeSeconds);
    dateCount[date] = (dateCount[date] || 0) + 1;
  });
  return dateCount;
}

// Get intensity level for submission count
function getIntensity(count) {
  if (count === 0) return 0;
  if (count <= 2) return 1;
  if (count <= 5) return 2;
  if (count <= 10) return 3;
  return 4;
}

// Get color class for intensity
function getColorClass(intensity) {
  const colors = [
    'bg-gray-100 dark:bg-gray-800', // 0 submissions
    'bg-green-200 dark:bg-green-900', // 1-2 submissions
    'bg-green-400 dark:bg-green-700', // 3-5 submissions
    'bg-green-600 dark:bg-green-500', // 6-10 submissions
    'bg-green-800 dark:bg-green-300', // 10+ submissions
  ];
  return colors[intensity] || colors[0];
}

// Generate past year grid
function generateYearGrid(submissionsByDate) {
  const today = getISTToday();
  const grid = [];
  const startDate = new Date(today);
  startDate.setDate(today.getDate() - 364); // 52 weeks
  
  // Get the Sunday of the start week
  const startDay = startDate.getDay();
  startDate.setDate(startDate.getDate() - startDay);
  
  let currentDate = new Date(startDate);
  let week = [];
  
  while (currentDate <= today) {
    const dateStr = currentDate.toISOString().slice(0, 10);
    const count = submissionsByDate[dateStr] || 0;
    const intensity = getIntensity(count);
    
    week.push({
      date: dateStr,
      count,
      intensity,
      dayOfWeek: currentDate.getDay(),
    });
    
    if (currentDate.getDay() === 6 || currentDate >= today) { // Saturday or last day
      grid.push([...week]);
      week = [];
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return grid;
}

const SubmissionHeatmap = ({ data }) => {
  const [isMobile, setIsMobile] = useState(false);
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0, content: '' });

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const { submissionsByDate, grid, totalSubmissions } = useMemo(() => {
    if (!data || data.length === 0) {
      return { submissionsByDate: {}, grid: [], totalSubmissions: 0 };
    }
    
    const submissionsByDate = formatHeatmapData(data);
    const grid = generateYearGrid(submissionsByDate);
    const totalSubmissions = data.length;
    
    return { submissionsByDate, grid, totalSubmissions };
  }, [data]);

  const handleMouseEnter = (e, day) => {
    const rect = e.target.getBoundingClientRect();
    const date = new Date(day.date).toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    
    setTooltip({
      show: true,
      x: rect.left + rect.width / 2,
      y: rect.top - 10,
      content: `${day.count} submissions on ${date}`
    });
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false, x: 0, y: 0, content: '' });
  };

  if (!data || data.length === 0) {
    return (
      <div className="text-center text-gray-600 p-8">
        <p>No submission data available for the last year.</p>
      </div>
    );
  }

  const cellSize = isMobile ? 10 : 12;
  const gap = isMobile ? 2 : 3;

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        <p>{totalSubmissions} submissions in the last year</p>
      </div>

      {/* Heatmap Grid */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full">
          <div className="flex gap-1">
            {/* Day labels */}
            <div className="flex flex-col justify-between" style={{ height: `${(cellSize + gap) * 7 - gap}px` }}>
              {['', 'Mon', '', 'Wed', '', 'Fri', ''].map((label, i) => (
                <div key={i} className={`text-xs text-gray-500 flex items-center`} style={{ height: `${cellSize}px` }}>
                  {label}
                </div>
              ))}
            </div>

            {/* Weeks grid */}
            <div className="flex" style={{ gap: `${gap}px` }}>
              {grid.map((week, weekIndex) => (
                <div key={weekIndex} className="flex flex-col" style={{ gap: `${gap}px` }}>
                  {week.map((day, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={cn(
                        'rounded-sm border cursor-pointer transition-all hover:ring-2 hover:ring-gray-400',
                        getColorClass(day.intensity)
                      )}
                      style={{ 
                        width: `${cellSize}px`, 
                        height: `${cellSize}px` 
                      }}
                      onMouseEnter={(e) => handleMouseEnter(e, day)}
                      onMouseLeave={handleMouseLeave}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Month labels */}
          <div className="mt-2 flex justify-between text-xs text-gray-500 ml-8">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map(month => (
              <span key={month}>{month}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
        <span>Less</span>
        <div className="flex items-center gap-1">
          {[0, 1, 2, 3, 4].map(intensity => (
            <div
              key={intensity}
              className={cn('rounded-sm border', getColorClass(intensity))}
              style={{ width: `${cellSize}px`, height: `${cellSize}px` }}
            />
          ))}
        </div>
        <span>More</span>
      </div>

      {/* Tooltip */}
      {tooltip.show && (
        <div
          className="fixed z-50 px-2 py-1 text-xs text-white bg-gray-900 rounded shadow-lg pointer-events-none transform -translate-x-1/2 -translate-y-full"
          style={{ left: tooltip.x, top: tooltip.y }}
        >
          {tooltip.content}
        </div>
      )}
    </div>
  );
};

export default SubmissionHeatmap;