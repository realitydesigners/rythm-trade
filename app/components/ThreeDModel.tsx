import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { BoxArrays, StreamData } from "../../types";
import { fetchBoxArrays } from "../api/rest";
import { ResoBox, ThreeDBox } from "./index";

interface ThreeDModelProps {
	pair: string;
	streamData: StreamData | null;
	selectedBoxArrayType: string;
}

const ThreeDModel: React.FC<ThreeDModelProps> = ({
	pair,
	streamData,
	selectedBoxArrayType,
}) => {
	const [boxArrays, setBoxArrays] = useState<BoxArrays>({});
	const [initializationComplete, setInitializationComplete] =
		useState<boolean>(false);

	const { user } = useUser();

	const [currentClosePrice, setCurrentClosePrice] = useState<number | null>(
		null,
	);

	useEffect(() => {
		let intervalId: string | number | NodeJS.Timeout | undefined = undefined;

		const fetchAndSetBoxes = async () => {
			if (user?.id) {
				console.log("Fetching boxes...");
				try {
					const newBoxArrays = await fetchBoxArrays(
						user.id,
						pair,
						selectedBoxArrayType,
					);
					setBoxArrays(newBoxArrays);
					setInitializationComplete(true);
				} catch (error) {
					console.error("Error fetching box arrays:", error);
				}
			}
		};

		fetchAndSetBoxes();
		intervalId = setInterval(fetchAndSetBoxes, 60000);

		return () => clearInterval(intervalId);
	}, [user, pair, selectedBoxArrayType]);

	useEffect(() => {
		if (streamData) {
			const bidPrice = streamData.bids?.[0]?.price
				? parseFloat(streamData.bids[0].price)
				: null;
			const askPrice = streamData.asks?.[0]?.price
				? parseFloat(streamData.asks[0].price)
				: null;

			if (bidPrice !== null && askPrice !== null) {
				const currentPrice = (bidPrice + askPrice) / 2;
				setCurrentClosePrice(currentPrice);
			}
		}
	}, [streamData]);

	return (
		<div className="relative min-h-screen w-full font-bold ">
			{initializationComplete ? (
				<div className="grid min-h-screen w-full grid-cols-1 items-center justify-center gap-[1em] pb-40 lg:grid-cols-2 lg:pb-0 lg:pl-0 lg:pr-8 ">
					<ThreeDBox boxArrays={boxArrays} />
					<ResoBox boxArrays={boxArrays} />
				</div>
			) : (
				<LoadingIndicator />
			)}
		</div>
	);
};

export default ThreeDModel;

const LoadingIndicator = () => (
	<div className="flex h-full w-full items-center justify-center">
		{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
		<svg
			width="80"
			height="80"
			viewBox="0 0 50 50"
			xmlns="http://www.w3.org/2000/svg"
		>
			<circle
				cx="25"
				cy="25"
				r="20"
				stroke="#333"
				strokeWidth="5"
				fill="none"
				strokeDasharray="31.415, 31.415"
				strokeDashoffset="0"
			>
				<animateTransform
					attributeName="transform"
					type="rotate"
					from="0 25 25"
					to="360 25 25"
					dur="1s"
					repeatCount="indefinite"
				/>
			</circle>
		</svg>
	</div>
);
