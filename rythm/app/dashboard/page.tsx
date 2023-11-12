"use client";

import React, { useEffect, useState } from 'react';
import Stream from '../components/Stream';
import MasterProfile from '../components/MasterProfile';
import { OandaApiContext, api } from '../api/OandaApi';
import styles from './DashboardPage.module.css';
const initialFavorites = ['EUR_USD', 'USD_JPY', 'GBP_USD', 'AUD_CAD'];

const DashboardPage = () => {
  const [currencyPairs, setCurrencyPairs] = useState<string[]>([]);
  const [favoritePairs, setFavoritePairs] = useState<string[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstruments = async () => {
      if (api) {
        const instruments = await api.getAccountInstruments();
        if (instruments) {
          const allPairs = instruments.map((inst: { name: string; }) => inst.name);
          setCurrencyPairs(allPairs);
          setFavoritePairs(initialFavorites);
        }
      }
    };
    fetchInstruments();
  }, []);

  const handleDragStart = (pair: string) => {
    setDraggedItem(pair);
  };

  const handleDragOver = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLElement>, dropZoneId: string, index = -1) => {
    event.preventDefault();
    if (!draggedItem) return;
    if (dropZoneId === 'favorites' && index !== -1) {
      setFavoritePairs(prev => {
        const newFavorites = [...prev];
        newFavorites[index] = draggedItem;
        return newFavorites;
      });
    }
    setDraggedItem(null);
  };
  
  return (
    <OandaApiContext.Provider value={api}>
      <div className={styles.dashboardContainer}>
        <MasterProfile />
        <div className={styles.favoritePairs}>
          {favoritePairs.map((pair, index) => (
            <a key={pair} href={`/dashboard/pairs/${pair}`} className={styles.favoritePair}
               onDrop={(e) => handleDrop(e, 'favorites', index)}
               onDragOver={handleDragOver} draggable
               onDragStart={() => handleDragStart(pair)}>
              <Stream pair={pair} />
            </a>
          ))}
        </div>
        <div className={styles.allPairs}>
          {currencyPairs.map(pair => (
            <div key={pair} className={styles.pairContainer} draggable
                 onDragStart={() => handleDragStart(pair)}>
              <a href={`/dashboard/pairs/${pair}`} className={styles.pairLink}>
                {pair}
              </a>
            </div>
          ))}
        </div>
      </div>
    </OandaApiContext.Provider>
  );
};
export default DashboardPage;
