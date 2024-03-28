import {
    fetchFavoritePairs,
    fetchInstruments,
    updateFavoritePairs,
} from "@/app/api/rest";
import { sendWebSocketMessage } from "@/app/api/websocket";
import React, { useEffect, useState } from "react";

const initialFavorites = [
    "GBP_USD",
    "USD_JPY",
    "AUD_USD",
    "EUR_JPY",
    "EUR_USD",
    "USD_CAD",
    "NZD_USD",
    "GBP_JPY",
];

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const useFavorites = (user: any) => {
    const [currencyPairs, setCurrencyPairs] = useState<string[]>([]);
    const [favoritePairs, setFavoritePairs] = useState<string[]>([]);
    const [draggedItem, setDraggedItem] = useState<string | null>(null);
    const [allPairs, setAllPairs] = useState<string[]>([]);
    const [showProfile, setShowProfile] = useState(false);
    const [numDisplayedFavorites, setNumDisplayedFavorites] =
        useState<number>(0);

    const [selectedBoxArrayTypes, setSelectedBoxArrayTypes] = useState(
        Object.fromEntries(allPairs.map((pair) => [pair, "d"])),
    );

    useEffect(() => {
        const loadFavoritePairs = async () => {
            if (user) {
                try {
                    const fetchedFavoritePairs = await fetchFavoritePairs(
                        user.id,
                    );
                    setFavoritePairs(fetchedFavoritePairs);
                    setNumDisplayedFavorites(fetchedFavoritePairs.length);

                    const newSelectedBoxArrayTypes =
                        fetchedFavoritePairs.reduce(
                            (
                                acc: { [x: string]: string },
                                pair: string | number,
                            ) => {
                                acc[pair] = "d";
                                return acc;
                            },
                            {},
                        );
                    setSelectedBoxArrayTypes(newSelectedBoxArrayTypes);
                } catch (error) {
                    console.error("Error fetching favorite pairs:", error);
                }
            }
        };

        loadFavoritePairs();
    }, [user]);

    const handleUpdateFavoritePairs = async (newPairs: string[]) => {
        if (user) {
            try {
                await updateFavoritePairs(user.id, newPairs);
                setFavoritePairs(newPairs);

                sendWebSocketMessage({
                    userId: user.id,
                    favoritePairs: newPairs,
                });
            } catch (error) {
                console.error("Error updating favorite pairs:", error);
            }
        }
        const updatedBoxArrayTypes = { ...selectedBoxArrayTypes };
        // biome-ignore lint/complexity/noForEach: <explanation>
        newPairs.forEach((pair) => {
            if (!updatedBoxArrayTypes[pair]) {
                updatedBoxArrayTypes[pair] = "d";
            }
        });
        setSelectedBoxArrayTypes(updatedBoxArrayTypes);
    };

    useEffect(() => {
        const loadInstruments = async () => {
            if (user) {
                try {
                    const fetchedInstruments = await fetchInstruments(user.id);
                    setAllPairs(fetchedInstruments);
                    setCurrencyPairs(fetchedInstruments);
                } catch (error) {
                    console.error("Error fetching instruments:", error);
                }
            }
        };

        loadInstruments();
    }, [user]);

    useEffect(() => {
        const displayedFavorites = favoritePairs.slice(
            0,
            numDisplayedFavorites,
        );
        const filteredPairs = allPairs.filter(
            (pair) => !displayedFavorites.includes(pair),
        );
        setCurrencyPairs(filteredPairs);
    }, [favoritePairs, allPairs, numDisplayedFavorites]);

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        const updateFavoritePairsOnServer = async () => {
            if (
                JSON.stringify(favoritePairs) !==
                JSON.stringify(initialFavorites)
            ) {
                await handleUpdateFavoritePairs(favoritePairs);
            }
        };

        if (favoritePairs.length > 0) {
            updateFavoritePairsOnServer();
        }
    }, [favoritePairs]);

    const handleReplaceFavorite = (selectedPair: string, index: number) => {
        setFavoritePairs((prev) => {
            const newFavorites = [...prev];
            newFavorites[index] = selectedPair;
            return newFavorites;
        });
    };

    const handleBoxArrayChange = (pair: string, selectedKey: string) => {
        setSelectedBoxArrayTypes((prev: { [key: string]: string }) => ({
            ...prev,
            [pair]: selectedKey,
        }));
    };

    const deleteFavoritePair = async (pairToDelete: string) => {
        const updatedPairs = favoritePairs.filter(
            (pair) => pair !== pairToDelete,
        );
        await handleUpdateFavoritePairs(updatedPairs); // Update pairs on the server
        setFavoritePairs(updatedPairs); // Update local state
    };

    const addToFavorites = async (pairToAdd: string) => {
        if (!pairToAdd) return;
        if (favoritePairs.includes(pairToAdd)) {
            alert("This pair is already in your favorites!");
            return;
        }
        const updatedPairs = [...favoritePairs, pairToAdd];
        await handleUpdateFavoritePairs(updatedPairs);
        setFavoritePairs(updatedPairs);
        setNumDisplayedFavorites(updatedPairs.length);
    };

    return {
        favoritePairs,
        currencyPairs,
        handleReplaceFavorite,
        selectedBoxArrayTypes,
        numDisplayedFavorites,
        deleteFavoritePair,
        addToFavorites,
        handleBoxArrayChange,
    };
};

export default useFavorites;
