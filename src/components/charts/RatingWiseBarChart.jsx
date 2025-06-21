// src/components/charts/RatingWiseBarChart.jsx

import React, { useMemo, useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";
import { formatRatingWiseData } from '@/utils/chart-formatters';

// Tailwind-inspired color for bars
const BAR_COLOR = "#2563eb"; // blue-600

// Custom tooltip for rating bars
const CustomTooltip = ({ active, payload, isMobile }) => {
  if (active && payload && payload.length) {
    const { rating, count } = payload[0].payload;
    return (
      <div className={`bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded p-2 shadow ${isMobile ? 'text-xs' : 'text-sm'}`}>
        <span className="font-semibold">Rating: {rating}</span>
        <br />
        Problems Solved: <span className="font-bold">{count}</span>
      </div>
    );
  }
  return null;
};

const RatingWiseBarChart = ({ data }) => {
  const chartData = useMemo(() => formatRatingWiseData(data), [data]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!chartData || chartData.length === 0) {
    return <p className="text-center text-gray-600">No data available.</p>;
  }

  const chartHeight = isMobile ? 250 : 300;

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="rating" 
          stroke="#6b7280" 
          fontSize={isMobile ? 10 : 12}
          tick={{ fontSize: isMobile ? 10 : 12 }}
        />
        <YAxis 
          stroke="#6b7280" 
          fontSize={isMobile ? 10 : 12}
          tick={{ fontSize: isMobile ? 10 : 12 }}
        />
        <Tooltip
          content={<CustomTooltip isMobile={isMobile} />}
          contentStyle={{
            backgroundColor: "#ffffff",
            borderColor: "#e5e7eb",
            color: "#374151",
            fontSize: isMobile ? "12px" : "14px"
          }}
          labelStyle={{ color: "#374151", fontSize: isMobile ? "11px" : "13px" }}
        />
        <Legend 
          wrapperStyle={{ 
            color: "#374151",
            fontSize: isMobile ? "11px" : "13px"
          }} 
        />
        <Bar dataKey="count" name="Problems Solved" fill="#000000" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default RatingWiseBarChart;