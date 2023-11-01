"use client";
import React from 'react';
import DashboardPage from './dashboard/page';

const AppPage = () => {
  return (
    <div className='w-full pl-10 pr-10 pt-2 pb-2 bg-black rounded-lg shadow-lg text-sm space-y-1 font-mono text-gray-200'>
      <h1 className='text-gray-400 font-bold border-b border-gray-600 pb-2'>RYTHM - High Precision Algorithmic Trading</h1>
      <DashboardPage />
    </div>
  );
};

export default AppPage;
