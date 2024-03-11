// FavoritesSection.tsx
import React from "react";
import BoxArraySelect from "./BoxArraySelect";
import ResoModel from "./ResoModel";
import StreamCard from "./StreamCard";

interface FavoritesSectionProps {
    favoritePairs: string[];
    numDisplayedFavorites: number;
    streamData: any; // Adjust this type based on your data
    selectedBoxArrayTypes: any; // Adjust this type
    handleBoxArrayChange: any;
    handleReplaceFavorite: any;
    index: number; // If needed outside, consider passing it as part of an object or removing it if not used
    currencyPairs: string[];
    deleteFavoritePair: any;
    updateFavoritePairsOnDragDrop: any;
}

const FavoritesSection: React.FC<FavoritesSectionProps> = ({
    favoritePairs,
    numDisplayedFavorites,
    streamData,
    selectedBoxArrayTypes,
    handleBoxArrayChange,
    handleReplaceFavorite,
    currencyPairs,
    deleteFavoritePair,
    updateFavoritePairsOnDragDrop,
}) => {
    const handleDragStart = (pair: string) => {
        // Logic to set dragged item, consider moving this logic to parent or context if used in multiple places
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
        // Drag drop logic here
        updateFavoritePairsOnDragDrop(); // Adjust this call according to your logic
    };

    return (
        <div className="relative flex w-full overflow-x-auto">
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
                        <StreamCard
                            key={pair}
                            pair={pair}
                            streamData={streamData}
                        />
                        <ResoModel
                            pair={pair}
                            streamData={streamData[pair]}
                            selectedBoxArrayType={selectedBoxArrayTypes[pair]}
                        />
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
                ))}
        </div>
    );
};

export default FavoritesSection;
