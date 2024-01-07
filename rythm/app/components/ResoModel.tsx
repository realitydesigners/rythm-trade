// BoxesModel Component: Displays boxes representing price ranges for a given currency pair.
// The boxes are calculated based on historical candle data fetched from Oanda API.
// Each box represents a specific range of prices and is updated based on new candle data.

"use client";

import React, {
	useCallback,
	useContext,
	useEffect,
	useRef,
	useState,
} from "react";

import { Button } from "@/app/components/ui/button";
import { Box, BoxArrays, CandleData, StreamData } from "../../types";
import { OandaApiContext } from "../api/OandaApi";
import {
	findCurrentPrice,
	findHighest,
	findLowest,
} from "../api/priceAnalysis";
import {
	BOX_SIZES,
	SymbolsToDigits,
	symbolsToDigits,
} from "../utils/constants";

import ResoBot from "@/app/algorithms/ResoBot";
import ResoBox from "./ResoBox";

interface ResoModelProps {
	pair: string;
	streamData: StreamData | null;
	selectedBoxArrayType: string;
}
// generateBoxSizes: Generates a map of box sizes based on the provided point sizes and currency pair.
const generateBoxSizes = (
	pair: string,
	pointSizes: number[],
	symbolsToDigits: SymbolsToDigits,
): Map<number, number> => {
	const { point: pointValue } = symbolsToDigits[pair] || { point: 0.00001 };

	// biome-ignore lint/style/useConst: <explanation>
	let boxSizeMap = new Map<number, number>();
	// biome-ignore lint/complexity/noForEach: <explanation>
	pointSizes.forEach((size) => {
		boxSizeMap.set(size, size * pointValue);
	});
	return boxSizeMap;
};

const ResoModel: React.FC<ResoModelProps> = ({
	pair,
	streamData,
	selectedBoxArrayType,
}) => {
	const api = useContext(OandaApiContext);
	const [currentClosePrice, setCurrentClosePrice] = useState<number | null>(
		null,
	);
	const [boxArrays, setBoxArrays] = useState<BoxArrays>({});
	const [initializationComplete, setInitializationComplete] =
		useState<boolean>(false);
	const resoInstance = useRef<ResoBot | null>(null);
	const [botActive, setBotActive] = useState(false); // Bot active state

	// Toggle bot function
	const toggleBot = () => {
		if (resoInstance.current) {
			resoInstance.current.toggleActive();
			setBotActive(!botActive); // Toggle the bot active state
		}
	};

	// calculateAllBoxes: Calculates the high and low values for each box size based on the candle data.
	const calculateAllBoxes = useCallback(
		(C: number, oandaData: CandleData[], boxSizeMap: Map<number, number>) => {
			const newBoxArrays: BoxArrays = {};

			// Initialize boxes with the last candle's data
			const latestCandle = oandaData[oandaData.length - 1];
			// biome-ignore lint/complexity/noForEach: <explanation>
			boxSizeMap.forEach((decimalSize, wholeNumberSize) => {
				const latestPrice = parseFloat(latestCandle.mid.c);
				newBoxArrays[wholeNumberSize] = {
					high: latestPrice,
					low: latestPrice - decimalSize,
					boxMovedUp: false,
					boxMovedDn: false,
					rngSize: decimalSize,
				};
			});

			// Iterate over each candle in reverse to update boxes
			for (let i = oandaData.length - 1; i >= 0; i--) {
				const currentPrice = parseFloat(oandaData[i].mid.c);

				// biome-ignore lint/complexity/noForEach: <explanation>
				boxSizeMap.forEach((decimalSize, wholeNumberSize) => {
					// biome-ignore lint/style/useConst: <explanation>
					let box = newBoxArrays[wholeNumberSize];

					if (!box) {
						console.error(`Box not defined for size: ${wholeNumberSize}`);
						return;
					}

					if (currentPrice > box.high) {
						box.high = currentPrice;
						box.low = currentPrice - decimalSize;
						box.boxMovedUp = true;
						box.boxMovedDn = false;
					} else if (currentPrice < box.low) {
						box.low = currentPrice;
						box.high = currentPrice + decimalSize;
						box.boxMovedUp = false;
						box.boxMovedDn = true;
					}

					newBoxArrays[wholeNumberSize] = box;
				});
			}

			setBoxArrays(newBoxArrays);
			if (!initializationComplete) {
				setInitializationComplete(true);
			}
		},
		[initializationComplete],
	);

	// useEffect: Fetches candle data at regular intervals and calculates boxes based on this data.
	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		// biome-ignore lint/style/useConst: <explanation>
		let intervalId: NodeJS.Timeout;

		const fetchAndCalculateBoxes = async () => {
			const oandaData = await api?.fetchLargeCandles(pair, 6000, "M1");
			if (oandaData && oandaData.length > 0) {
				const currentPrice = findCurrentPrice(oandaData);
				if (currentPrice !== undefined) {
					const boxSizes = generateBoxSizes(
						pair,
						BOX_SIZES[selectedBoxArrayType],
						symbolsToDigits,
					);
					calculateAllBoxes(currentPrice, oandaData, boxSizes);
				}
			} else {
				console.log("No valid data received.");
			}
		};

		fetchAndCalculateBoxes();
		intervalId = setInterval(fetchAndCalculateBoxes, 60000);

		return () => clearInterval(intervalId);
	}, [pair, selectedBoxArrayType]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	const updateBoxesWithCurrentPrice = useCallback(
		(currentPrice: number) => {
			if (!initializationComplete) {
				return;
			}
			setBoxArrays((prevBoxArrays) => {
				const newBoxArrays = { ...prevBoxArrays };
				let isUpdated = false;

				const boxSizes = generateBoxSizes(
					pair,
					BOX_SIZES[selectedBoxArrayType],
					symbolsToDigits,
				);

				// biome-ignore lint/complexity/noForEach: <explanation>
				boxSizes.forEach((decimalSize, wholeNumberSize) => {
					// biome-ignore lint/style/useConst: <explanation>
					let box = newBoxArrays[wholeNumberSize];
					if (!box) {
						console.error(`Box not defined for size: ${wholeNumberSize}`);
						return;
					}
					if (currentPrice > box.high) {
						box.high = currentPrice;
						box.low = currentPrice - decimalSize;
						box.boxMovedUp = true;
						box.boxMovedDn = false;
						isUpdated = true;
					} else if (currentPrice < box.low) {
						box.low = currentPrice;
						box.high = currentPrice + decimalSize;
						box.boxMovedUp = false;
						box.boxMovedDn = true;
						isUpdated = true;
					}
				});

				return isUpdated ? newBoxArrays : prevBoxArrays;
			});
		},
		[pair, selectedBoxArrayType],
	);

	useEffect(() => {
		if (streamData && initializationComplete && resoInstance.current) {
			const bidPrice = streamData.bids?.[0]?.price
				? parseFloat(streamData.bids[0].price)
				: null;
			const askPrice = streamData.asks?.[0]?.price
				? parseFloat(streamData.asks[0].price)
				: null;

			if (bidPrice !== null && askPrice !== null) {
				const currentPrice = (bidPrice + askPrice) / 2;
				setCurrentClosePrice(currentPrice);
				updateBoxesWithCurrentPrice(currentPrice);
				resoInstance.current.onData(currentPrice, boxArrays);
			}
		}
	}, [
		streamData,
		boxArrays,
		initializationComplete,
		updateBoxesWithCurrentPrice,
	]);
	// Render
	if (!initializationComplete) {
		return (
			<div className="w-full h-full flex items-center  justify-center">
				{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
				<svg
					width="50"
					height="50"
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
	}

	return (
		<div className="w-full h-auto text-teal-400 font-bold">
			{initializationComplete ? (
				<>
					<ResoBox boxArrays={boxArrays} />

					<div className="w-full flex justify-center items-center gap-2">
						<Button onClick={toggleBot}>
							{botActive ? "Turn Off reso" : "Turn On reso"}
						</Button>
					</div>
				</>
			) : (
				<div>Loading...</div>
			)}
		</div>
	);
};

export default ResoModel;
