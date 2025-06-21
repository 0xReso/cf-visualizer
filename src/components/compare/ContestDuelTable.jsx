// src/components/compare/ContestDuelTable.jsx

import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Helper to determine duel result
function getDuelResult(rank1, rank2) {
  if (rank1 < rank2) return 1;
  if (rank2 < rank1) return -1;
  return 0;
}

const ContestDuelTable = ({ data, users }) => {
  // Debug logging
  console.log('ContestDuelTable data:', data);
  console.log('ContestDuelTable users:', users);

  // Handle case where data is not in expected format
  if (!data) {
    return <p className="text-center text-gray-600">No contest data available.</p>;
  }

  // Handle different data structures
  let common, h1Wins, h2Wins, handle1, handle2;

  if (data.common && Array.isArray(data.common)) {
    // Data is already in the expected format
    common = data.common;
    h1Wins = data.h1Wins || 0;
    h2Wins = data.h2Wins || 0;
    handle1 = data.handle1 || users?.handle1;
    handle2 = data.handle2 || users?.handle2;
  } else {
    // Data might be in a different format, try to extract
    common = [];
    h1Wins = 0;
    h2Wins = 0;
    handle1 = users?.handle1 || 'User 1';
    handle2 = users?.handle2 || 'User 2';
  }

  if (!common || common.length === 0) {
    return (
      <div className="text-center text-gray-600 p-8">
        <p>No common contests found between {handle1} and {handle2}.</p>
        <p className="text-sm mt-2">Both users need to have participated in the same contests to see a comparison.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-around mb-4 text-center">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{h1Wins}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{handle1} Wins</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{h2Wins}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{handle2} Wins</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-900 rounded-lg shadow overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-semibold">Contest</TableHead>
              <TableHead className="font-semibold">{handle1} Rank</TableHead>
              <TableHead className="font-semibold">{handle2} Rank</TableHead>
              <TableHead className="font-semibold">Winner</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {common.map((contest, index) => {
              const rank1 = contest.handle1?.rank || contest.rank1 || 'N/A';
              const rank2 = contest.handle2?.rank || contest.rank2 || 'N/A';
              const contestName = contest.contestName || contest.name || `Contest ${index + 1}`;
              
              let winner = 'Tie';
              let winnerClass = 'text-gray-500';
              
              if (rank1 !== 'N/A' && rank2 !== 'N/A') {
                if (rank1 < rank2) {
                  winner = `🏆 ${handle1}`;
                  winnerClass = 'text-green-600 dark:text-green-400 font-semibold';
                } else if (rank2 < rank1) {
                  winner = `🏆 ${handle2}`;
                  winnerClass = 'text-green-600 dark:text-green-400 font-semibold';
                }
              }

              return (
                <TableRow key={index} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <TableCell className="font-medium">{contestName}</TableCell>
                  <TableCell className="text-center">{rank1}</TableCell>
                  <TableCell className="text-center">{rank2}</TableCell>
                  <TableCell className={winnerClass}>
                    {winner}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default ContestDuelTable;