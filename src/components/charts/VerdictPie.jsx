import React, { useMemo, useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatVerdictsData } from '@/utils/chart-formatters';

const COLORS = {
  "OK": "#000000", // Black
  "WRONG_ANSWER": "#404040", // Dark Gray
  "TIME_LIMIT_EXCEEDED": "#808080", // Medium Gray
  "MEMORY_LIMIT_EXCEEDED": "#A0A0A0", // Light Gray
  "RUNTIME_ERROR": "#C0C0C0", // Lighter Gray
  "COMPILATION_ERROR": "#E0E0E0", // Very Light Gray
  "OTHER": "#2A2A2A" // Very Dark Gray
};

const VerdictPie = ({ data }) => {
  const chartData = useMemo(() => formatVerdictsData(data), [data]);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024); // Desktop: 1024px+, Mobile/iPad: <1024px
    };
    
    checkDesktop();
    window.addEventListener('resize', checkDesktop);
    return () => window.removeEventListener('resize', checkDesktop);
  }, []);

  if (!chartData || chartData.length === 0) {
    return <p className="text-center text-gray-600">No verdict data available.</p>;
  }

  // Layout based on screen size: vertical for phone+iPad, horizontal for desktop
  const chartHeight = isDesktop ? 300 : 360;
  const outerRadius = isDesktop ? 70 : 45;
  const legendLayout = isDesktop ? "vertical" : "vertical";
  const legendAlign = isDesktop ? "right" : "center";
  const legendVerticalAlign = isDesktop ? "middle" : "bottom";

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={chartHeight}>
        <PieChart margin={{ top: 10, right: 10, bottom: isDesktop ? 20 : 50, left: 10 }}>
          <Tooltip
            contentStyle={{
              backgroundColor: "#ffffff",
              borderColor: "#000000",
              color: "#000000",
              fontSize: isDesktop ? "14px" : "12px"
            }}
            labelStyle={{ color: "#000000", fontSize: isDesktop ? "13px" : "11px" }}
          />
          <Legend 
            layout={legendLayout}
            align={legendAlign}
            verticalAlign={legendVerticalAlign}
            wrapperStyle={{ 
              color: "#374151",
              fontSize: isDesktop ? "12px" : "10px",
              paddingTop: isDesktop ? "0px" : "20px",
              lineHeight: "1.2"
            }}
          />
          <Pie
            data={chartData}
            cx="50%"
            cy={isDesktop ? "50%" : "35%"}
            labelLine={false}
            outerRadius={outerRadius}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {chartData.map((entry) => (
              <Cell key={`cell-${entry.name}`} fill={COLORS[entry.name] || COLORS['OTHER']} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VerdictPie;
