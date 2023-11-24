'use client';

import React, { useEffect, useState } from 'react';
import Stream from '../components/Stream';
import ResoModel from '../components/ResoModel';
import ElixrModel from '../components/ElixrModel';
import PositionTable from '../components/PositionTable';
import MasterProfile from '../components/MasterProfile';
import { OandaApiContext, api } from '../api/OandaApi';
import MasterPosition from '../components/MasterPosition';
import styles from './DashboardPage.module.css';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/app/components/Shadcn/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/Shadcn/dialog';

import { Button, buttonVariants } from '@/app/components/Shadcn/button';
import { BOX_SIZES } from '../utils/constants';
import { PositionData } from '@/types';

const initialFavorites = ['GBP_USD', 'USD_JPY', 'AUD_USD', 'EUR_JPY', 'EUR_USD', 'USD_CAD', 'NZD_USD', 'GBP_JPY'];

const DashboardPage = () => {
  const [currencyPairs, setCurrencyPairs] = useState<string[]>([]);
  const [favoritePairs, setFavoritePairs] = useState<string[]>(initialFavorites);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [allPairs, setAllPairs] = useState<string[]>([]);
  const [showProfile, setShowProfile] = useState(false);
  const [numDisplayedFavorites, setNumDisplayedFavorites] = useState<number>(4);
  const [streamData, setStreamData] = useState<{ [pair: string]: any }>({});
  const [isLoading, setIsLoading] = useState(true); // Initialize as true to show loading by default
  const [selectedBoxArrayTypes, setSelectedBoxArrayTypes] = useState(Object.fromEntries(initialFavorites.map(pair => [pair, 'd'])));
  const [positionData, setPositionData] = useState<PositionData[]>([]);

  const handleBoxArrayChange = (pair: string, selectedKey: string) => {
    setSelectedBoxArrayTypes(prev => ({
      ...prev,
      [pair]: selectedKey,
    }));
  };

  const toggleProfile = () => {
    setShowProfile(prevShow => !prevShow);
  };
  useEffect(() => {
    const fetchInstruments = async () => {
      if (api) {
        const instruments = await api.getAccountInstruments();
        if (instruments) {
          const allPairsFetched = instruments.map((inst: { name: string }) => inst.name);
          const sortedPairs = allPairsFetched.sort((a: string, b: any) => a.localeCompare(b));
          setAllPairs(sortedPairs);
          setCurrencyPairs(sortedPairs);
        }
      }
    };
    fetchInstruments();
  }, []);

  useEffect(() => {
    const handleStreamData = (data: any, pair: string) => {
      if (data.type !== 'HEARTBEAT') {
        setStreamData(prevData => ({
          ...prevData,
          [pair]: data,
        }));
      }
    };

    api.unsubscribeFromPairs(favoritePairs);
    api.subscribeToPairs(favoritePairs, handleStreamData);

    return () => {
      api.unsubscribeFromPairs(favoritePairs);
    };
  }, [favoritePairs]);

  // Fetch position data periodically
  useEffect(() => {
    const fetchPositionData = async () => {
      const positions = await api.getAllPositions();
      setPositionData(positions);
    };

    fetchPositionData();
    const intervalId = setInterval(fetchPositionData, 5000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const displayedFavorites = favoritePairs.slice(0, numDisplayedFavorites);
    const filteredPairs = allPairs.filter(pair => !displayedFavorites.includes(pair));
    setCurrencyPairs(filteredPairs);
  }, [favoritePairs, allPairs, numDisplayedFavorites]);

  const handleNumFavoritesChange = (newValue: string) => {
    setNumDisplayedFavorites(parseInt(newValue, 10));
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
      <div className="w-full flex p-6 flex-wrap ">
        <div className="w-full flex flex-wrap gap-2 mb-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={toggleProfile}>Account Summary</Button>
            </DialogTrigger>
            <DialogContent>
              <MasterProfile />
            </DialogContent>
          </Dialog>

          <Select onValueChange={handleNumFavoritesChange} value={numDisplayedFavorites.toString()}>
            <SelectTrigger>
              <SelectValue>{numDisplayedFavorites} Favorites</SelectValue>{' '}
            </SelectTrigger>
            <SelectContent>
              {getFavoritePairsOptions().map(n => (
                <SelectItem key={n} value={n.toString()}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 lg:gap-4 w-full">
          {favoritePairs.slice(0, numDisplayedFavorites).map((pair, index) => (
            <div key={pair} className="w-full p-3 lg:p-6 border border-gray-600 h-[420px] sm:h-[550px] md:h-[575px] lg:h-[650px] rounded-lg" onDrop={e => handleDrop(e, 'favorites', index)} onDragOver={handleDragOver} draggable onDragStart={() => handleDragStart(pair)}>
              <a href={`/dashboard/pairs/${pair}`}>
                <Stream pair={pair} data={streamData[pair]} />
              </a>
              <ResoModel pair={pair} streamData={streamData[pair]} selectedBoxArrayType={selectedBoxArrayTypes[pair]} />
              <div className="w-full  flex justify-center items-center gap-2">
                <Select value={selectedBoxArrayTypes[pair]} onValueChange={newValue => handleBoxArrayChange(pair, newValue)}>
                  <SelectTrigger>
                    <SelectValue>{selectedBoxArrayTypes[pair]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(BOX_SIZES).map(arrayKey => (
                      <SelectItem key={arrayKey} value={arrayKey}>
                        {arrayKey}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={pair} onValueChange={newValue => handleReplaceFavorite(newValue, index)}>
                  <SelectTrigger>
                    <SelectValue>{pair}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {currencyPairs.map(p => (
                      <SelectItem key={p} value={p}>
                        {p}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <ElixrModel pair={pair} streamData={streamData[pair]} />
            </div>
          ))}
        </div>
      </div>
      <MasterPosition positionData={positionData} />

    </OandaApiContext.Provider>
  );
};

export default DashboardPage;
