import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const RatingGraph = ({ data }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!data || data.length === 0) {
    return <p className="text-center text-gray-600">No rating history available.</p>;
  }

  // Debug logging
  console.log('Rating graph data structure:', data?.[0]);
  console.log('All rating data:', data);
  
  const formattedData = data.map((d, index) => {
    // The contests hook returns data with 'date' field already formatted
    // But let's also handle the raw API format as fallback
    let contestDate;
    let rating;
    let contestName;
    
    if (d.date) {
      // Data from contests hook (already formatted)
      contestDate = new Date(d.date + 'T00:00:00'); // Add time to make it a valid date
      rating = d.newRating;
      contestName = d.contestName;
    } else if (d.ratingUpdateTimeSeconds) {
      // Raw API format
      contestDate = new Date(d.ratingUpdateTimeSeconds * 1000);
      rating = d.newRating;
      contestName = d.contestName;
    } else {
      // Fallback
      contestDate = new Date();
      rating = d.newRating || d.rating || 0;
      contestName = d.contestName || `Contest ${index + 1}`;
    }
    
    return {
      ...d,
      date: contestDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: '2-digit'
      }),
      fullDate: contestDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      contestName: contestName,
      rating: rating,
      originalIndex: index
    };
  });

  console.log('Formatted rating data:', formattedData?.[0]);

  const chartHeight = isMobile ? 300 : 400;

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <LineChart data={formattedData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
        <XAxis 
          dataKey="date" 
          stroke="#6b7280" 
          fontSize={isMobile ? 9 : 11}
          tick={{ fontSize: isMobile ? 9 : 11 }}
          angle={isMobile ? -45 : 0}
          textAnchor={isMobile ? "end" : "middle"}
          height={isMobile ? 60 : 40}
        />
        <YAxis 
          stroke="#6b7280" 
          domain={['dataMin - 100', 'dataMax + 100']} 
          fontSize={isMobile ? 10 : 12}
          tick={{ fontSize: isMobile ? 10 : 12 }}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: "#ffffff",
            borderColor: "#e5e7eb",
            color: "#374151",
            fontSize: isMobile ? "12px" : "14px"
          }}
          labelStyle={{ color: "#374151", fontSize: isMobile ? "11px" : "13px" }}
          formatter={(value, name, props) => [
            value,
            name
          ]}
          labelFormatter={(label, payload) => {
            if (payload && payload[0]) {
              return `${payload[0].payload.fullDate} - ${payload[0].payload.contestName}`;
            }
            return label;
          }}
        />
        <Legend 
          wrapperStyle={{ 
            color: "#374151",
            fontSize: isMobile ? "11px" : "13px"
          }} 
        />
        <Line
          type="monotone"
          dataKey="rating"
          name="Rating"
          stroke="#000000"
          strokeWidth={2}
          dot={{ fill: "#000000", strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: "#000000", strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default RatingGraph;