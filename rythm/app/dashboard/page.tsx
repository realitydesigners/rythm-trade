"use client";
import React from 'react';

const DashboardPage = () => {
  return (
    <div className='w-full pl-10 pr-10 pt-2 pb-2 bg-black rounded-lg shadow-lg text-sm space-y-1 font-mono text-gray-200'>
      <h1 className='text-gray-400 font-bold border-b border-gray-600 pb-2'>Dashboard</h1> 
      <a href="/dashboard/pairs/gbpusd" className='text-gray-400 font-bold'>GBP/USD</a>
    </div>
  );
};

export default DashboardPage;
