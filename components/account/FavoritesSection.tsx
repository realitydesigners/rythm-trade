"use client"
import React, { useEffect, useState } from 'react';
import BoxArraySelect from '../charts/BoxArraySelect';
import ResoModel from '../charts/ResoModel';
import StreamCard from '../stream/StreamCard';

interface FavoritesSectionProps {
  favoritePairs: string[];
  numDisplayedFavorites: number;
  streamData: any;
  selectedBoxArrayTypes: any;
  handleBoxArrayChange: any;
  handleReplaceFavorite: any;
  index: number;
  currencyPairs: string[];
  deleteFavoritePair: any;
}

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-600/10 w-[350px] h-[480px] animate-pulse rounded-lg border border-gray-600/50" />
  );
};

const FavoritesSection: React.FC<FavoritesSectionProps> = ({
  favoritePairs,
  numDisplayedFavorites,
  streamData,
  selectedBoxArrayTypes,
  handleBoxArrayChange,
  handleReplaceFavorite,
  currencyPairs,
  deleteFavoritePair,
}) => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const simulateLoading = () => {
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    };

    simulateLoading();
  }, []);

  return (
    <div className="relative h-[600px] flex flex-row  w-full gap-4 overflow-x-auto ">
      {favoritePairs.slice(0, numDisplayedFavorites).map((pair, index) => (
        <div key={pair} className="w-[350px] h-[480px]">
          {loading ? (
            <LoadingSkeleton />
          ) : (
            <div className="flex w-auto flex-col rounded-lg border border-gray-600/50 p-4">
              <StreamCard key={pair} pair={pair} streamData={streamData?.[pair] || {}} />
              <div className="h-[20em] w-[20em] overflow-hidden rounded-lg border border-gray-700/50">
                <ResoModel
                  pair={pair}
                  streamData={streamData?.[pair] || {}}
                  selectedBoxArrayType={selectedBoxArrayTypes[pair]}
                />
              </div>
              <BoxArraySelect
                selectedBoxArrayTypes={selectedBoxArrayTypes}
                handleBoxArrayChange={handleBoxArrayChange}
                pair={pair}
                handleReplaceFavorite={handleReplaceFavorite}
                index={index}
                currencyPairs={currencyPairs}
                deleteFavoritePair={deleteFavoritePair}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default FavoritesSection;
