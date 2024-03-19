"use client"
import { space } from "@/app/fonts";
import LoadingPulse from "@/components/loading/LoadingPulse";
import { StreamData } from "@/types";
import Link from "next/link";
import React, { useEffect, useState } from 'react';


interface NavbarStreamProps {
  pair: string;
  data: StreamData | null;
}

interface FavoritesListProps {
  favoritePairs: string[];
  streamData: { [key: string]: StreamData };
}

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="bg-gray-600/10 min-w-[250px] h-[75px] animate-pulse rounded-lg border border-gray-600/25 p-4" />
  );
};

const FavoriteItem: React.FC<NavbarStreamProps> = ({ pair, data }) => {
  const price = data?.bids?.[0]?.price ?? "";
  const trend = Math.random() < 1 ? "up" : "down";
  const trendIconPath =
    trend === "up" ? "/icons/uptrend.svg" : "/icons/downtrend.svg";

  return (
    <Link
      href={`/pairs/${pair}`}
	 
      className="flex items-center  min-w-[250px]  h-[75px]  rounded-lg border border-gray-600/25 px-3 py-2 transition-all duration-300 hover:scale-105 hover:bg-gray-600/10"
    >
      <div className="white-space-nowrap pr-2">
        {pair ? (
          <div className={`${space.className} text-mg text-gray-200`}>
            {pair}
          </div>
        ) : (
          <LoadingPulse className="w-[75px] h-[25px] mb-1 animate-pulse" />
        )}
        {price ? (
          <div className="text-xl font-bold text-gray-400">{price}</div>
        ) : (
          <LoadingPulse className="w-[75px] h-[30px] animate-pulse" />
        )}
      </div>
      <div className="flex w-32 items-center justify-center">
        {trendIconPath && (
          <div className="flex w-32 items-center justify-center">
            <img src={trendIconPath} alt={trend} className="h-12" />
          </div>
        )}
      </div>
    </Link>
  );
};

const FavoritesList: React.FC<FavoritesListProps> = ({
  favoritePairs,
  streamData,
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
    <div className="h-auto w-full">
      <div className="mx-auto flex items-center justify-start space-x-4 overflow-x-auto py-4">
        {loading ? (
			
          favoritePairs.map((pair) => <LoadingSkeleton key={pair} />)
        ) : (
          favoritePairs.map((pair) => (
            <FavoriteItem key={pair} pair={pair} data={streamData[pair]} />
          ))
        )}
      </div>
    </div>
  );
};


export default FavoritesList;
