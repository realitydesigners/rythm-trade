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
  const [dropdownOpen, setDropdownOpen] = useState<Record<string, boolean>>({});

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

  const toggleDropdown = (pair: string) => {
    setDropdownOpen(prev => ({ ...prev, [pair]: !prev[pair] }));
  };
  
  const replaceFavorite = (pair: string, slot: number) => {
    setFavoritePairs(prev => {
        const newFavorites = [...prev];
        const existingIndex = newFavorites.indexOf(pair);
        if (existingIndex !== -1) {
    
            [newFavorites[slot - 1], newFavorites[existingIndex]] = [newFavorites[existingIndex], newFavorites[slot - 1]];
        } else {
            newFavorites[slot - 1] = pair;
        }
        return newFavorites;
    });
    toggleDropdown(pair);
};


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
              const existingIndex = newFavorites.indexOf(draggedItem);

              if (existingIndex !== -1) {
                  [newFavorites[index], newFavorites[existingIndex]] = [newFavorites[existingIndex], newFavorites[index]];
              } else {
                  newFavorites[index] = draggedItem;
              }

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
              <div className={styles.dropdown}>
                <button className={styles.dropdownToggle} onClick={() => toggleDropdown(pair)}>
                  &#9660;
                </button>
                {dropdownOpen[pair] && (
                  <div className={styles.replaceOptions}>
                    {Array.from({ length: 4 }, (_, i) => (
                      <button key={i} onClick={() => replaceFavorite(pair, i + 1)}>
                        Replace {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </OandaApiContext.Provider>
  );
};

export default DashboardPage;