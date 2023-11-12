"use client";
import React from 'react';
import DashboardPage from './dashboard/page';
import styles from './AppPage.module.css';

const AppPage = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>RYTHM - High Precision Algorithmic Trading</h1>
      <DashboardPage />
    </div>
  );
};

export default AppPage;
