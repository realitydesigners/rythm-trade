"use client";
import { fetchAllPairPositions } from "@/app/api/actions/fetchPositionData";
import { useWebSocket } from "@/components/context/WebSocketContext";
import useFavorites from "@/components/hooks/useFavorites";
import {
    FavoritesDashboard,
    FavoritesList,
    FavoritesSection,
    MasterPosition,
    MiniMenu,
} from "@/components/index";
import { PositionData } from "@/types";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";

import { Container, Text } from "@/components/ui-ux/index";

const UserPage = () => {
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
        <div className="flex min-h-screen w-full flex-wrap bg-black p-4 pt-20 lg:pl-40 lg:pt-20 ">
            <Container variant="default">
                <Text variant="default">Test Text</Text>
                <Text variant="p" className="text-xl">
                    Test Text
                </Text>
            </Container>
        </div>
    );
};

export default UserPage;
