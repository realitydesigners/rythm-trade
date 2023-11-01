"use client";
import React from 'react'
import Link  from 'next/link'

const DashboardPage = () => {
  const currencyPairs = ['gbpusd', 'eurusd', 'usdjpy', 'usdcad', 'usdchf', 'audusd'];

  return (
    <div className='w-full p-4 bg-black rounded-lg shadow-lg text-sm space-y-1 font-mono text-gray-200'>
      <h1 className='text-gray-400 font-bold border-b border-gray-600 tracking-widest uppercase  pb-2'>Dashboard</h1> 
      {currencyPairs.map(pair => (
        <div key={pair}>
          <Link href={`/dashboard/pairs/${pair}`} className='text-gray-400 text-lg tracking-wide font-bold hover:text-white'>
            {pair.toUpperCase()}
          </Link>
        </div>
      ))}
    </div>
  );
};

export default DashboardPage;