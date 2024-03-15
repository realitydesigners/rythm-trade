import React from "react";
import BoxArraySelect from "../charts/BoxArraySelect";
import ResoModel from "../charts/ResoModel";
import StreamCard from "../stream/StreamCard";

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
		<div className="relative flex h-full w-full gap-4 overflow-x-auto py-2 ">
			{favoritePairs.slice(0, numDisplayedFavorites).map((pair, index) => (
				<div
					key={pair}
					className="flex w-auto flex-col rounded-lg border border-gray-600/50 p-4 "
				>
					<StreamCard key={pair} pair={pair} streamData={streamData} />
					<div className="h-[20em] w-[20em] overflow-hidden rounded-lg border border-gray-700/50">
						<ResoModel
							pair={pair}
							streamData={streamData[pair]}
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
			))}
		</div>
	);
};

export default FavoritesSection;
