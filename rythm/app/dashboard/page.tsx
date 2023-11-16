'use client';

import React, { useEffect, useState } from 'react';
import Stream from '../components/Stream';
import ResoModel from '../components/ResoModel';
import MasterProfile from '../components/MasterProfile';
import { OandaApiContext, api } from '../api/OandaApi';
import styles from './DashboardPage.module.css';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import { Button, buttonVariants } from '@/components/ui/button';

const initialFavorites = [
  'EUR_USD',
  'USD_JPY',
  'GBP_USD',
  'AUD_CAD',
  'USD_SGD',
  'EUR_SEK',
  'HKD_JPY',
  'AUD_USD',
  'USD_CAD',
  'NZD_USD',
  'NZD_SGD',
  'USD_NOK',
  'USD_CNH',
  'SGD_CHF',
  'GBP_JPY',
  'USD_TRY',
  'AUD_JPY',
  'ZAR_JPY',
  'SGD_JPY',
  'GBP_ZAR',
];

const DashboardPage = () => {
  const [currencyPairs, setCurrencyPairs] = useState<string[]>([]);
  const [favoritePairs, setFavoritePairs] =
    useState<string[]>(initialFavorites);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [allPairs, setAllPairs] = useState<string[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [numDisplayedFavorites, setNumDisplayedFavorites] = useState<number>(8);

  const toggleProfile = () => {
    setShowProfile(prevShow => !prevShow);
  };
  useEffect(() => {
    const fetchInstruments = async () => {
      if (api) {
        const instruments = await api.getAccountInstruments();
        if (instruments) {
          const allPairsFetched = instruments.map(
            (inst: { name: string }) => inst.name,
          );
          setAllPairs(allPairsFetched);
          setCurrencyPairs(allPairsFetched);
        }
      }
    };
    fetchInstruments();
  }, []);

  useEffect(() => {
    const filteredPairs = allPairs.filter(
      pair => !favoritePairs.includes(pair),
    );
    setCurrencyPairs(filteredPairs);
  }, [favoritePairs, allPairs]);

  const handleNumFavoritesChange = (
    event: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setNumDisplayedFavorites(parseInt(event.target.value, 10));
  };

  const handleReplaceFavorite = (selectedPair: string, index: number) => {
    setFavoritePairs(prev => {
      const newFavorites = [...prev];
      newFavorites[index] = selectedPair;
      return newFavorites;
    });
  };
  const getFavoritePairsOptions = () => {
    const options = [];
    for (let i = 1; i <= favoritePairs.length; i++) {
      options.push(i);
    }
    return options;
  };
  const handleDragStart = (pair: string) => {
    setDraggedItem(pair);
  };

  const handleDragOver = (event: React.DragEvent<HTMLElement>) => {
    event.preventDefault();
  };

  const handleDrop = (
    event: React.DragEvent<HTMLElement>,
    dropZoneId: string,
    index = -1,
  ) => {
    event.preventDefault();
    if (!draggedItem) return;

    if (dropZoneId === 'favorites' && index !== -1) {
      setFavoritePairs(prev => {
        const newFavorites = [...prev];
        const existingIndex = newFavorites.indexOf(draggedItem);

        if (existingIndex !== -1) {
          [newFavorites[index], newFavorites[existingIndex]] = [
            newFavorites[existingIndex],
            newFavorites[index],
          ];
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
      <div>
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={toggleProfile}>
              {showProfile ? 'Hide' : 'Show'} Account Summary
            </Button>
          </DialogTrigger>
          <DialogContent>
            <MasterProfile />
          </DialogContent>
        </Dialog>
        <div className="w-full  mt-4 mb-4">
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Number of Favorites" />
            </SelectTrigger>
            <SelectContent>
              {getFavoritePairsOptions().map(n => (
                <SelectItem key={String(n)} value={String(n)}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className={styles.favoritePairs}>
          {favoritePairs.slice(0, numDisplayedFavorites).map((pair, index) => (
            <div
              key={pair}
              className={styles.favoritePair}
              onDrop={e => handleDrop(e, 'favorites', index)}
              onDragOver={handleDragOver}
              draggable
              onDragStart={() => handleDragStart(pair)}
            >
              <a href={`/dashboard/pairs/${pair}`}>
                <Stream pair={pair} />
              </a>
              <ResoModel pair={pair} />
              <select
                onChange={e => handleReplaceFavorite(e.target.value, index)}
                value={pair}
                className={styles.pairDropdown}
              >
                {currencyPairs.map(p => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      </div>
    </OandaApiContext.Provider>
  );
};

export default DashboardPage;
