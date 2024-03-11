"use client";
import { fetchAllPairPositions } from "@/app/api/actions/fetchPositionData";
import FavoritesList from "@/app/components/FavoritesList";
import { useWebSocket } from "@/app/components/context/WebSocketContext";
import {
    BoxDashboard,
    MasterPosition,
    MasterProfile,
    ResoModel,
    Stream,
} from "@/app/components/index";
import {
    Button,
    Dialog,
    DialogContent,
    DialogTrigger,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/app/components/ui/index";
import { PositionData } from "@/types";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import useFavorites from "../../components/useFavorites";
import { BOX_SIZES } from "../../utils/constants";

const DashboardPage = () => {
    const { user } = useUser();
    const { streamData } = useWebSocket();
    const [draggedItem, setDraggedItem] = useState<string | null>(null);
    const [showProfile, setShowProfile] = useState(false);
    const [positionData, setPositionData] = useState<PositionData[]>([]);
    const {
        favoritePairs,
        currencyPairs,
        handleReplaceFavorite,
        selectedBoxArrayTypes,
        numDisplayedFavorites,
        updateFavoritePairsOnDragDrop,
        handleUpdateFavoritePairs,
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

    const handleDragStart = (pair: string) => {
        setDraggedItem(pair);
    };

    const handleDragOver = (event: React.DragEvent<HTMLElement>) => {
        event.preventDefault();
    };
    const handleDrop = (
        event: React.DragEvent<HTMLElement>,
        dropZoneId: string,
        index: number,
    ) => {
        event.preventDefault();
        if (!draggedItem) return;

        updateFavoritePairsOnDragDrop(draggedItem, dropZoneId, index);
        setDraggedItem(null);
    };

    return (
        <div className="flex w-full flex-wrap p-4 pt-20 lg:p-6 lg:pt-20 ">
            {favoritePairs.slice(0, numDisplayedFavorites).map((pair) => (
                <BoxDashboard
                    pair={pair}
                    streamData={streamData[pair]}
                    selectedBoxArrayType={selectedBoxArrayTypes[pair]}
                />
            ))}

            <FavoritesList
                favoritePairs={favoritePairs}
                streamData={streamData}
            />
            <div className="mb-4 flex w-full flex-wrap gap-2">
                <Dialog>
                    <DialogTrigger asChild>
                        <Button onClick={toggleProfile}>Account Summary</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <MasterProfile />
                    </DialogContent>
                </Dialog>
                <Select
                    onValueChange={(pairToAdd) => addToFavorites(pairToAdd)}
                    value=""
                >
                    <SelectTrigger>
                        <p className="w-full p-2 text-left text-xs text-gray-200">
                            Add Pair
                        </p>
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
            <div className="relative  flex w-full  overflow-x-auto">
                {favoritePairs
                    .slice(0, numDisplayedFavorites)
                    .map((pair, index) => (
                        <div
                            key={pair}
                            className="mb-4 mr-4 flex h-[125vw] w-[90vw] flex-col rounded-lg border border-gray-600/50 p-3 lg:h-[600px] lg:w-[800px] lg:p-6"
                            onDrop={(e) => handleDrop(e, "favorites", index)}
                            onDragOver={handleDragOver}
                            draggable
                            onDragStart={() => handleDragStart(pair)}
                        >
                            <div className="flex items-center justify-between">
                                <div className="p-2">
                                    <Stream
                                        pair={pair}
                                        data={streamData[pair]}
                                    />
                                </div>
                                <Link
                                    href={`/pairs/${pair}`}
                                    className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-[1em] rounded-lg bg-gray-600/25 transition-transform hover:scale-105 hover:brightness-110"
                                >
                                    <div className="absolute inset-0 bg-gray-600/25 opacity-0 transition-opacity hover:opacity-100" />
                                    {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                                    <svg
                                        className="h-4 w-4 scale-x-[-1] transform text-gray-200/75 transition-transform duration-300 ease-in-out"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                        xlinkTitle="svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M10.707 2.293a1 1 0 010 1.414L4.414 10l6.293 6.293a1 1 0 11-1.414 1.414l-7-7a1 1 0 010-1.414l7-7a1 1 0 011.414 0z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </Link>
                            </div>
                            <ResoModel
                                pair={pair}
                                streamData={streamData[pair]}
                                selectedBoxArrayType={
                                    selectedBoxArrayTypes[pair]
                                }
                            />
                            <div className="flex  items-center justify-center space-x-2">
                                <Select
                                    value={selectedBoxArrayTypes[pair]}
                                    onValueChange={(newValue) =>
                                        handleBoxArrayChange(pair, newValue)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue>
                                            {selectedBoxArrayTypes[pair]}
                                        </SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {Object.keys(BOX_SIZES).map(
                                            (arrayKey) => (
                                                <SelectItem
                                                    key={arrayKey}
                                                    value={arrayKey}
                                                >
                                                    {arrayKey}
                                                </SelectItem>
                                            ),
                                        )}
                                    </SelectContent>
                                </Select>
                                <Select
                                    value={pair}
                                    onValueChange={(newValue) =>
                                        handleReplaceFavorite(newValue, index)
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue>{pair}</SelectValue>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {currencyPairs.map((p) => (
                                            <SelectItem key={p} value={p}>
                                                {p}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <Button
                                    onClick={() => deleteFavoritePair(pair)}
                                >
                                    Delete
                                </Button>
                            </div>
                        </div>
                    ))}
            </div>
            <div className="w-full p-2 lg:p-4">
                <MasterPosition positionData={positionData} />
            </div>
        </div>
    );
};

export default DashboardPage;
