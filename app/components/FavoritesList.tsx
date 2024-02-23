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
			href={`/pairs/${pair}`}
			className="flex items-center rounded-lg border border-gray-600/50 px-4 py-2 transition-all duration-300 hover:scale-105 hover:bg-gray-600/25"
		>
			<div className="white-space-nowrap pr-4">
				<div className={`${monomaniac.className} text-mg text-gray-200`}>
					{pair}
				</div>
				<div className="text-xl font-bold text-gray-400">{price}</div>
			</div>
			<div className="flex w-32 items-center justify-center">
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
		<div className="h-auto w-full">
			<div className="mx-auto flex items-center justify-start space-x-4 overflow-x-auto py-4">
				{favoritePairs.map((pair) => (
					<FavoriteItem key={pair} pair={pair} data={streamData[pair]} />
				))}
			</div>
		</div>
	);
};

export default FavoritesList;
