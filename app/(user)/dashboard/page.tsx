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
			<FavoritesList favoritePairs={favoritePairs} streamData={streamData} />
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
