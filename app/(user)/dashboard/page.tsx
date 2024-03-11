"use client";
import { fetchAllPairPositions } from "@/app/api/actions/fetchPositionData";
import { useWebSocket } from "@/app/components/context/WebSocketContext";
import {
    FavoritesDashboard,
    FavoritesList,
    MasterPosition,
    MiniMenu,
} from "@/app/components/index";
import { PositionData } from "@/types";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import FavoritesSection from "../../components/FavoritesSection";
import useFavorites from "../../components/useFavorites";

const DashboardPage = () => {
    const { user } = useUser();
    const { streamData } = useWebSocket();
    const [showProfile, setShowProfile] = useState(false);
    const [positionData, setPositionData] = useState<PositionData[]>([]);
    const {
        favoritePairs,
        currencyPairs,
        handleReplaceFavorite,
        selectedBoxArrayTypes,
        numDisplayedFavorites,
        updateFavoritePairsOnDragDrop,
        deleteFavoritePair,
        addToFavorites,
        handleBoxArrayChange,
    } = useFavorites(user);

    const toggleProfile = () => {
        setShowProfile((prevShow) => !prevShow);
    };

    useEffect(() => {
        const getPositionData = async () => {
            if (user?.id) {
                const positions = await fetchAllPairPositions(user.id);
                setPositionData(positions);
            }
        };

        getPositionData();
    }, [user?.id]);

    return (
        <div className="flex w-full flex-wrap p-4 pt-20 lg:p-6 lg:pt-20 ">
            <FavoritesList
                favoritePairs={favoritePairs}
                streamData={streamData}
            />
            <MiniMenu
                toggleProfile={toggleProfile}
                addToFavorites={addToFavorites}
                currencyPairs={currencyPairs}
                favoritePairs={favoritePairs}
            />
            <FavoritesSection
                favoritePairs={favoritePairs}
                numDisplayedFavorites={numDisplayedFavorites}
                streamData={streamData}
                selectedBoxArrayTypes={selectedBoxArrayTypes}
                handleBoxArrayChange={handleBoxArrayChange}
                handleReplaceFavorite={handleReplaceFavorite}
                currencyPairs={currencyPairs}
                deleteFavoritePair={deleteFavoritePair}
                updateFavoritePairsOnDragDrop={updateFavoritePairsOnDragDrop}
                index={0}
            />
            <FavoritesDashboard
                favoritePairs={favoritePairs}
                numDisplayedFavorites={numDisplayedFavorites}
                streamData={streamData}
                selectedBoxArrayTypes={selectedBoxArrayTypes}
            />
            <MasterPosition positionData={positionData} />
        </div>
    );
};

export default DashboardPage;
