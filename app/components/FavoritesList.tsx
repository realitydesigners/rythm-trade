import { monomaniac, space } from "@/app/fonts";
import { StreamData } from "@/types";
import Link from "next/link";
import React from "react";

interface NavbarStreamProps {
	pair: string;
	data: StreamData | null;
}
interface FavoritesListProps {
	favoritePairs: string[];
	streamData: { [key: string]: StreamData };
}

const FavoriteItem: React.FC<NavbarStreamProps> = ({ pair, data }) => {
	const price = data?.bids?.[0]?.price ?? "";
	const trend = Math.random() < 1 ? "up" : "down";
	const trendIconPath =
		trend === "up" ? "/icons/uptrend.svg" : "/icons/downtrend.svg";

	return (
		<Link
			href={`/dashboard/pairs/${pair}`}
			className="border border-gray-600/50 rounded-lg flex items-center px-4 py-2 hover:scale-105 hover:bg-gray-600/25 transition-all duration-300"
		>
			<div className="pr-4 white-space-nowrap">
				<div className={`${monomaniac.className} text-mg text-gray-200`}>
					{pair}
				</div>
				<div className="text-xl text-gray-400 font-bold">{price}</div>
			</div>
			<div className="w-32 flex justify-center items-center">
				<img src={trendIconPath} alt={trend} className="h-12" />
			</div>
		</Link>
	);
};

const FavoritesList: React.FC<FavoritesListProps> = ({
	favoritePairs,
	streamData,
}) => {
	return (
		<div className="w-full h-auto">
			<div className="mx-auto py-4 flex items-center justify-start space-x-4 overflow-x-auto">
				{favoritePairs.map((pair) => (
					<FavoriteItem key={pair} pair={pair} data={streamData[pair]} />
				))}
			</div>
		</div>
	);
};

export default FavoritesList;
