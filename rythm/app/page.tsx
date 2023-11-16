'use client';
import React from 'react';
import DashboardPage from './dashboard/page';
import styles from './AppPage.module.css';

const AppPage = () => {
  return (
    <div className={styles.container}>
      <h1 className="font-mono font-bold text-white text-2xl tracking-wide mb-8">
        RYTHM
      </h1>
      <DashboardPage />
    </div>
  );
};

export default AppPage;
