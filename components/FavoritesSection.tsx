import React from "react";
import BoxArraySelect from "./BoxArraySelect";
import ResoModel from "./ResoModel";
import StreamCard from "./StreamCard";

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
}) => {
    return (
        <div className="relative flex w-full overflow-x-auto">
            {favoritePairs
                .slice(0, numDisplayedFavorites)
                .map((pair, index) => (
                    <div
                        key={pair}
                        className="mb-4 mr-4 flex h-[125vw] w-[90vw] flex-col rounded-lg border border-gray-600/50 p-3 lg:h-[600px] lg:w-[800px] lg:p-6"
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
