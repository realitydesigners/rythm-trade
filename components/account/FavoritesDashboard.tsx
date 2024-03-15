"use client";
import { StreamData } from "@/types";
import { useUser } from "@clerk/nextjs";
import { User } from "@clerk/nextjs/server";
import React, { useEffect } from "react";
import useFetchBoxes from "../hooks/useFetchBoxes";

interface DashboardProps {
	pair: string;
	streamData: StreamData | null;
	selectedBoxArrayType: string;
}

interface FavoritesDashboardProps {
	favoritePairs: string[];
	numDisplayedFavorites: number;
	streamData: { [key: string]: StreamData | null };
	selectedBoxArrayTypes: { [key: string]: string };
}

const FavoritesDashboard: React.FC<FavoritesDashboardProps> = ({
	favoritePairs,
	numDisplayedFavorites,
	streamData,
	selectedBoxArrayTypes,
}) => {
	const { user } = useUser();

	return (
		<div>
			{favoritePairs.slice(0, numDisplayedFavorites).map((pair) => (
				<BoxDashboard
					key={pair}
					pair={pair}
					streamData={streamData[pair]}
					selectedBoxArrayType={selectedBoxArrayTypes[pair]}
					user={user as unknown as User}
				/>
			))}
		</div>
	);
};

const BoxDashboard: React.FC<
	DashboardProps & { user: User | null | undefined }
> = ({ pair, streamData, selectedBoxArrayType, user }) => {
	const { boxArrays, initializationComplete } = useFetchBoxes(
		user ?? undefined,
		pair,
		selectedBoxArrayType,
	);

	useEffect(() => {
		console.log("Box arrays:", boxArrays);
	}, [boxArrays]);

	return (
		<div className="flex w-full flex-col p-1">
			<div className="flex w-full items-center">
				<h3 className="w-20 pr-4 text-sm font-bold text-gray-200">{pair}</h3>
				<div className="flex flex-nowrap gap-2">
					{Object.entries(boxArrays).map(([boxSize, box]) => (
						<div key={boxSize} className="bg-gray-100">
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
