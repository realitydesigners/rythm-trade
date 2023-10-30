"use client";
import { chartData } from "../api/getData";
import { useState, useEffect } from "react";

import { CandleData } from "@/types";


function DataTable() {
  const [data, setData] = useState<CandleData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const result = await chartData();
        const reversedData = result.candles.reverse(); // Reverse the order of the candles array
        setData(reversedData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    getData();
  }, []);

  return (
    <div className=" bg-black p-4 lg:p-8 shadow-lg">
      <div className="overflow-x-auto rounded-xl">
        <table className="min-w-full divide-y divide-gray-600/20">
          <thead className="bg-black ">
            <tr className="font-mono text-gray-400 font-bold">
              <th className="p-4 text-left text-xs font-medium uppercase tracking-wider">
                Time
              </th>
              <th className="p-4  text-left text-xs font-medium uppercase tracking-wider">
                Open
              </th>
              <th className="p-4  text-left text-xs font-medium uppercase tracking-wider">
                Close
              </th>
              <th className="p-4  text-left text-xs font-medium uppercase tracking-wider">
                High
              </th>
              <th className="p-4  text-left text-xs font-medium uppercase tracking-wider">
                Low
              </th>
            </tr>
          </thead>
          <tbody className="bg-black divide-y divide-gray-600/20 text-gray-400 text-xs">
            {loading ? (
              // Render placeholders or loading animation over each row
              <tr className="uppercase text-xs text-gray-600">
                <td className="px-4 py-2 animate-pulse">Loading...</td>
                <td className="px-4 py-2 animate-pulse">Loading...</td>
                <td className="px-4 py-2 animate-pulse">Loading...</td>
                <td className="px-4 py-2 animate-pulse">Loading...</td>
                <td className="px-4 py-2 animate-pulse">Loading...</td>
              </tr>
            ) : (
              // Render actual data rows
              data.map((candle) => (
                <tr key={candle.time}>
                  <td className="px-4 py-2 whitespace-nowrap font-mono">
                    {new Date(candle.time).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap font-mono">
                    {candle.mid.o}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap font-mono">
                    {candle.mid.c}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap font-mono">
                    {candle.mid.h}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap font-mono">
                    {candle.mid.l}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default DataTable;