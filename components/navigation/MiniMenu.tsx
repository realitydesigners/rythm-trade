"use client";
import { MasterProfile } from '@/components/index';
import React, { useEffect, useState } from 'react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/components/ui/index';



const LoadingSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-600/10 w-[275px] h-[40px] animate-pulse rounded-lg border border-gray-600/25 mb-4" />
  );
};

const MiniMenu = ({
  toggleProfile,
  addToFavorites,
  currencyPairs,
  favoritePairs,
}: {
  toggleProfile: () => void;
  addToFavorites: (pair: string) => void;
  currencyPairs: string[];
  favoritePairs: string[];
}) => {
  const [loading, setLoading] = useState(true); // Initialize loading state

  useEffect(() => {
    // Simulate loading effect
    const simulateLoading = () => {
      setTimeout(() => {
        setLoading(false); // Set loading state to false after 2 seconds
      }, 500);
    };

    simulateLoading(); // Start simulating loading
  }, []);

  return (
    <>
      {loading ? ( // Render LoadingSkeleton if loading state is true
        <LoadingSkeleton />
      ) : (
        <div className="mb-4 flex  w-full flex-wrap gap-2">
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={toggleProfile}>Account Summary</Button>
            </DialogTrigger>
            <DialogContent>
              <MasterProfile />
            </DialogContent>
          </Dialog>
          <div className="w-[120px] h-[40px]">
            <Select
              onValueChange={(pairToAdd) => addToFavorites(pairToAdd)}
              value=""
            >
              <SelectTrigger>
                <p className="w-full p-2 text-left text-xs text-gray-200">Add Pair</p>
              </SelectTrigger>
              <SelectContent>
                {currencyPairs
                  .filter((pair) => !favoritePairs.includes(pair))
                  .map((pair) => (
                    <SelectItem key={pair} value={pair}>
                      {pair}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </>
  );
};

export default MiniMenu;


