'use client';

import { useUser } from '@clerk/nextjs';
import React, { useEffect, useState } from 'react';
import Stream from '../components/Stream';
import ResoModel from '../components/ResoModel';
import ElixrModel from '../components/ElixrModel';
import MasterProfile from '../components/MasterProfile';
import { OandaApiContext, api } from '../api/OandaApi';
import MasterPosition from '../components/MasterPosition';

import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { fetchFavoritePairs, updateFavoritePairs, fetchInstruments, fetchAllPositions } from '../api/rest';

import { Button } from '@/components/ui/button';
import { BOX_SIZES } from '../utils/constants';
import { PositionData } from '@/types';
import { closeWebSocket, connectWebSocket, sendWebSocketMessage } from '../api/websocket';

const initialFavorites = ['GBP_USD', 'USD_JPY', 'AUD_USD', 'EUR_JPY', 'EUR_USD', 'USD_CAD', 'NZD_USD', 'GBP_JPY'];
const DashboardPage = () => {
   const { user } = useUser();
   const [currencyPairs, setCurrencyPairs] = useState<string[]>([]);
   const [favoritePairs, setFavoritePairs] = useState<string[]>([]);
   const [draggedItem, setDraggedItem] = useState<string | null>(null);
   const [allPairs, setAllPairs] = useState<string[]>([]);
   const [showProfile, setShowProfile] = useState(false);
   const [numDisplayedFavorites, setNumDisplayedFavorites] = useState<number>(0);
   const [streamData, setStreamData] = useState<{ [pair: string]: any }>({});
   const [selectedBoxArrayTypes, setSelectedBoxArrayTypes] = useState(Object.fromEntries(allPairs.map(pair => [pair, 'd'])));
   const [positionData, setPositionData] = useState<PositionData[]>([]);
   const [ws, setWs] = useState<WebSocket | null>(null);

   useEffect(() => {
      const handleWebSocketMessage = (message: any) => {
         const { data, pair } = message;
         if (data.type !== 'HEARTBEAT') {
            setStreamData(prevData => ({
              ...prevData,
              [pair]: data,
            }));
         }
      };
      const handleWebSocketError = (event: any) => {
         console.error('WebSocket Error:', event);
      };

      const handleWebSocketClose = () => {
         console.log('WebSocket Disconnected');
      };

      if (user) {
         connectWebSocket(user.id, handleWebSocketMessage, handleWebSocketError, handleWebSocketClose);
      }

      return () => {
         closeWebSocket();
      };
   }, [user]);

   useEffect(() => {
      const loadFavoritePairs = async () => {
         if (user) {
            try {
               const fetchedFavoritePairs = await fetchFavoritePairs(user.id);
               setFavoritePairs(fetchedFavoritePairs);
               setNumDisplayedFavorites(fetchedFavoritePairs.length);

               const newSelectedBoxArrayTypes = fetchedFavoritePairs.reduce((acc: { [x: string]: string }, pair: string | number) => {
                  acc[pair] = 'd';
                  return acc;
               }, {});
               setSelectedBoxArrayTypes(newSelectedBoxArrayTypes);
            } catch (error) {
               console.error('Error fetching favorite pairs:', error);
            }
         }
      };

      loadFavoritePairs();
   }, [user]);

   // Function to handle updating favorite pairs
   const handleUpdateFavoritePairs = async (newPairs: string[]) => {
      if (user) {
         try {
            await updateFavoritePairs(user.id, newPairs);
            setFavoritePairs(newPairs);

            // Send updated favorite pairs to the WebSocket server
            sendWebSocketMessage({
               userId: user.id,
               favoritePairs: newPairs,
            });
         } catch (error) {
            console.error('Error updating favorite pairs:', error);
         }
      }
      const updatedBoxArrayTypes = { ...selectedBoxArrayTypes };
      newPairs.forEach(pair => {
         if (!updatedBoxArrayTypes[pair]) {
            updatedBoxArrayTypes[pair] = 'd';
         }
      });
      setSelectedBoxArrayTypes(updatedBoxArrayTypes);
   };

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
      const loadInstruments = async () => {
         if (user) {
            try {
               const fetchedInstruments = await fetchInstruments(user.id);
               setAllPairs(fetchedInstruments);
               setCurrencyPairs(fetchedInstruments);
            } catch (error) {
               console.error('Error fetching instruments:', error);
            }
         }
      };

      loadInstruments();
   }, [user]);

   // Fetch position data periodically
   useEffect(() => {
      const fetchPositionData = async () => {
         if (user) {
            try {
               const positions = await fetchAllPositions(user.id);
               setPositionData(positions);
            } catch (error) {
               console.error('Error fetching positions:', error);
            }
         }
      };

      fetchPositionData();
      const intervalId = setInterval(fetchPositionData, 1000);

      return () => clearInterval(intervalId);
   }, [user]);

   useEffect(() => {
      const displayedFavorites = favoritePairs.slice(0, numDisplayedFavorites);
      const filteredPairs = allPairs.filter(pair => !displayedFavorites.includes(pair));
      setCurrencyPairs(filteredPairs);
   }, [favoritePairs, allPairs, numDisplayedFavorites]);

   useEffect(() => {
      // Update favorite pairs on the server only when there's a change
      const updateFavoritePairsOnServer = async () => {
         if (JSON.stringify(favoritePairs) !== JSON.stringify(initialFavorites)) {
            await handleUpdateFavoritePairs(favoritePairs);
         }
      };

      if (favoritePairs.length > 0) {
         updateFavoritePairsOnServer();
      }
   }, [favoritePairs]);

   const handleReplaceFavorite = (selectedPair: string, index: number) => {
      setFavoritePairs(prev => {
         const newFavorites = [...prev];
         newFavorites[index] = selectedPair;
         return newFavorites;
      });
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
   // Function to delete a favorite pair
   const deleteFavoritePair = async (pairToDelete: string) => {
      const updatedPairs = favoritePairs.filter(pair => pair !== pairToDelete);
      await handleUpdateFavoritePairs(updatedPairs); // Update pairs on the server
      setFavoritePairs(updatedPairs); // Update local state
   };

   // Function to add a selected pair to favorites
   const addToFavorites = async (pairToAdd: string) => {
      if (!pairToAdd) return;
      if (favoritePairs.includes(pairToAdd)) {
         alert('This pair is already in your favorites!');
         return;
      }
      const updatedPairs = [...favoritePairs, pairToAdd];
      await handleUpdateFavoritePairs(updatedPairs);
      setFavoritePairs(updatedPairs);
      setNumDisplayedFavorites(updatedPairs.length);
   };

   return (
      <OandaApiContext.Provider value={api}>
         <div className="w-full flex pt-20 lg:pt-20 lg:p-6 p-4 flex-wrap ">
            <div className="w-full flex flex-wrap gap-2 mb-4">
               <Dialog>
                  <DialogTrigger asChild>
                     <Button onClick={toggleProfile}>Account Summary</Button>
                  </DialogTrigger>
                  <DialogContent>
                     <MasterProfile />
                  </DialogContent>
               </Dialog>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2 lg:gap-4 w-full">
               {favoritePairs.slice(0, numDisplayedFavorites).map((pair, index) => (
                  <div key={pair} className="w-full p-3 lg:p-6 border border-gray-600 h-[420px] sm:h-[550px] md:h-[575px] lg:h-[650px] rounded-lg" onDrop={e => handleDrop(e, 'favorites', index)} onDragOver={handleDragOver} draggable onDragStart={() => handleDragStart(pair)}>
                     <Button onClick={() => deleteFavoritePair(pair)}>Delete</Button>
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
               <Select onValueChange={pairToAdd => addToFavorites(pairToAdd)} value="">
                  <SelectTrigger>
                     <SelectValue>Add More Pairs</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                     {currencyPairs
                        .filter(pair => !favoritePairs.includes(pair))
                        .map(pair => (
                           <SelectItem key={pair} value={pair}>
                              {pair}
                           </SelectItem>
                        ))}
                  </SelectContent>
               </Select>
            </div>
         </div>
         <MasterPosition positionData={positionData} />
      </OandaApiContext.Provider>
   );
};

export default DashboardPage;
