'use client';
import React from 'react';
import DashboardPage from './dashboard/page';
import styles from './AppPage.module.css';

const AppPage = () => {
   return (
      <div className="p-3 lg:p-6">
         <h1 className="font-mono font-extrabold text-white text-2xl tracking-wide mb-4">RYTHM</h1>
         <DashboardPage />
      </div>
   );
};

export default AppPage;
