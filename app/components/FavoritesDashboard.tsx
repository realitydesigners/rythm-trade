"use client";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { BoxArrays, StreamData } from "../../types";
import { fetchBoxArrays } from "../api/rest";

interface DashboardProps {
    pair: string;
    streamData: StreamData | null;
    selectedBoxArrayType: string;
}

interface FavoritesDashboardProps {
    favoritePairs: string[];
    numDisplayedFavorites: number;
    streamData: { [key: string]: StreamData | null }; // Assuming StreamData is the type for your stream data
    selectedBoxArrayTypes: { [key: string]: string };
}

const FavoritesDashboard: React.FC<FavoritesDashboardProps> = ({
    favoritePairs,
    numDisplayedFavorites,
    streamData,
    selectedBoxArrayTypes,
}) => {
    return (
        <div>
            {favoritePairs.slice(0, numDisplayedFavorites).map((pair) => (
                <BoxDashbaord
                    key={pair}
                    pair={pair}
                    streamData={streamData[pair]}
                    selectedBoxArrayType={selectedBoxArrayTypes[pair]}
                />
            ))}
        </div>
    );
};

const BoxDashbaord: React.FC<DashboardProps> = ({
    pair,
    streamData,
    selectedBoxArrayType,
}) => {
    const [boxArrays, setBoxArrays] = useState<BoxArrays>({});
    const { user } = useUser();

    useEffect(() => {
        const fetchAndSetBoxes = async () => {
            if (user?.id) {
                console.log("Fetching boxes...");
                try {
                    const newBoxArrays = await fetchBoxArrays(
                        user.id,
                        pair,
                        selectedBoxArrayType,
                    );

                    setBoxArrays(newBoxArrays);
                    console.log(
                        "Fetched box arrays:",
                        newBoxArrays,
                        "pair:",
                        pair,
                        "selectedBoxArrayType:",
                        selectedBoxArrayType,
                    );
                } catch (error) {
                    console.error("Error fetching box arrays:", error);
                }
            }
        };

        fetchAndSetBoxes();
        const intervalId = setInterval(fetchAndSetBoxes, 60000);

        return () => clearInterval(intervalId);
    }, [user?.id, pair, selectedBoxArrayType]);

    useEffect(() => {
        console.log("Box arrays:", boxArrays);
    }, [boxArrays]);

    return (
        <div className="flex w-full flex-col  p-1">
            <div className="flex w-full items-center ">
                <h3 className="w-20 pr-4 text-sm font-bold text-gray-200">
                    {pair}
                </h3>
                <div className="flex flex-nowrap gap-2">
                    {Object.entries(boxArrays).map(([boxSize, box]) => (
                        <div key={boxSize} className="bg-gray-100 ">
                            <div
                                className={`box text-xs font-bold ${
                                    box.boxMovedUp ? "bg-[#59cfc3]" : ""
                                } ${box.boxMovedDn ? "bg-[#CF596E]" : ""} p-2`}
                            >
                                {boxSize}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default FavoritesDashboard;