import React, { useMemo, useState, useEffect } from "react";
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

const ComparisonRatingGraph = ({ user1Data, user2Data, user1Handle, user2Handle }) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const formattedData = useMemo(() => {
    if (!user1Data && !user2Data) return [];

    console.log('Comparison rating data - User 1:', user1Data?.[0]);
    console.log('Comparison rating data - User 2:', user2Data?.[0]);

    // Create a map of all contest dates
    const contestMap = new Map();

    // Process user1 data
    if (user1Data) {
      user1Data.forEach((contest) => {
        let contestDate;
        let rating;
        let contestName;
        
        if (contest.date) {
          contestDate = new Date(contest.date + 'T00:00:00');
          rating = contest.newRating;
          contestName = contest.contestName;
        } else if (contest.ratingUpdateTimeSeconds) {
          contestDate = new Date(contest.ratingUpdateTimeSeconds * 1000);
          rating = contest.newRating;
          contestName = contest.contestName;
        } else {
          return; // Skip invalid entries
        }

        const dateStr = contestDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: '2-digit'
        });

        const fullDate = contestDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        if (!contestMap.has(contestDate.getTime())) {
          contestMap.set(contestDate.getTime(), {
            date: dateStr,
            fullDate: fullDate,
            contestName: contestName,
            timestamp: contestDate.getTime()
          });
        }

        contestMap.get(contestDate.getTime())[`${user1Handle}_rating`] = rating;
      });
    }

    // Process user2 data
    if (user2Data) {
      user2Data.forEach((contest) => {
        let contestDate;
        let rating;
        let contestName;
        
        if (contest.date) {
          contestDate = new Date(contest.date + 'T00:00:00');
          rating = contest.newRating;
          contestName = contest.contestName;
        } else if (contest.ratingUpdateTimeSeconds) {
          contestDate = new Date(contest.ratingUpdateTimeSeconds * 1000);
          rating = contest.newRating;
          contestName = contest.contestName;
        } else {
          return; // Skip invalid entries
        }

        const dateStr = contestDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: '2-digit'
        });

        const fullDate = contestDate.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });

        if (!contestMap.has(contestDate.getTime())) {
          contestMap.set(contestDate.getTime(), {
            date: dateStr,
            fullDate: fullDate,
            contestName: contestName,
            timestamp: contestDate.getTime()
          });
        }

        contestMap.get(contestDate.getTime())[`${user2Handle}_rating`] = rating;
      });
    }

    // Convert map to array and sort by timestamp
    const result = Array.from(contestMap.values()).sort((a, b) => a.timestamp - b.timestamp);
    
    console.log('Formatted comparison data sample:', result?.[0]);
    console.log('Total comparison data points:', result.length);
    
    return result;
  }, [user1Data, user2Data, user1Handle, user2Handle]);

  if (formattedData.length === 0) {
    return <p className="text-center text-gray-600">No rating history available for comparison.</p>;
  }

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
          dataKey={`${user1Handle}_rating`}
          name={user1Handle}
          stroke="#000000"
          strokeWidth={2}
          dot={{ fill: "#000000", strokeWidth: 2, r: 3 }}
          activeDot={{ r: 5, stroke: "#000000", strokeWidth: 2 }}
          connectNulls={false}
        />
        <Line
          type="monotone"
          dataKey={`${user2Handle}_rating`}
          name={user2Handle}
          stroke="#666666"
          strokeWidth={2}
          dot={{ fill: "#666666", strokeWidth: 2, r: 3 }}
          activeDot={{ r: 5, stroke: "#666666", strokeWidth: 2 }}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ComparisonRatingGraph;