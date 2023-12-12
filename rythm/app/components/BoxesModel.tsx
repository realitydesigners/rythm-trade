// BoxesModel Component: Displays boxes representing price ranges for a given currency pair.
// The boxes are calculated based on historical candle data fetched from Oanda API.
// Each box represents a specific range of prices and is updated based on new candle data.

"use client";

import React, { useState, useEffect, useContext, useCallback } from "react";

import { CandleData, Box, BoxArrays, StreamData } from "../../types";
import {
	findCurrentPrice,
	findHighest,
	findLowest,
} from "../api/priceAnalysis";
import { OandaApiContext } from "../api/OandaApi";
import {
	SymbolsToDigits,
	symbolsToDigits,
	BOX_SIZES,
} from "../utils/constants";
import BoxChart from "./BoxChart";
import ResoBox from "./ResoBox";

interface BoxModelProps {
	pair: string;
	streamData: StreamData | null;
}

// generateBoxSizes: Generates a map of box sizes based on the provided point sizes and currency pair.
const generateBoxSizes = (
	pair: string,
	pointSizes: number[],
	symbolsToDigits: SymbolsToDigits,
): Map<number, number> => {
	const { point: pointValue } = symbolsToDigits[pair] || { point: 0.00001 };
	const boxSizeMap = new Map<number, number>();
	// biome-ignore lint/complexity/noForEach: <explanation>
	pointSizes.forEach((size) => {
		boxSizeMap.set(size, size * pointValue);
	});
	return boxSizeMap;
};

const BoxesModel: React.FC<BoxModelProps> = ({ pair, streamData }) => {
	const api = useContext(OandaApiContext);
	const [currentClosePrice, setCurrentClosePrice] = useState<number | null>(
		null,
	);
	const [boxArrays, setBoxArrays] = useState<BoxArrays>({});
	const [initializationComplete, setInitializationComplete] =
		useState<boolean>(false);
	const [selectedBoxArray, setSelectedBoxArray] = useState<string>("d");

	// Function to switch between arrays
	const switchBoxArray = (arrayKey: string) => {
		if (selectedBoxArray === arrayKey) {
			// Do nothing if the selected array is already active
			return;
		}
		setInitializationComplete(false);
		setSelectedBoxArray(arrayKey);
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
					const box = newBoxArrays[wholeNumberSize];
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
						BOX_SIZES[selectedBoxArray],
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
	}, [pair, selectedBoxArray]);

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
					BOX_SIZES[selectedBoxArray],
					symbolsToDigits,
				);

				// biome-ignore lint/complexity/noForEach: <explanation>
				boxSizes.forEach((decimalSize, wholeNumberSize) => {
					const box = newBoxArrays[wholeNumberSize];
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
		[pair, selectedBoxArray],
	);

	useEffect(() => {
		if (streamData && initializationComplete) {
			const bidPrice = streamData.bids?.[0]?.price
				? parseFloat(streamData.bids[0].price)
				: null;
			const askPrice = streamData.asks?.[0]?.price
				? parseFloat(streamData.asks[0].price)
				: null;

			if (bidPrice !== null && askPrice !== null) {
				const currentPrice = (bidPrice + askPrice) / 2;
				console.log("update with stream");
				updateBoxesWithCurrentPrice(currentPrice);
			}
		}
	}, [streamData, updateBoxesWithCurrentPrice, initializationComplete]);

	// Render
	if (!initializationComplete) {
		return (
			<div className="w-full h-full flex justify-center">
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

	/* Modify renderToggleButtons function to apply active class */
	const renderToggleButtons = () => {
		return (
			<div className="flex space-x-2">
				{["d", "1", "2", "3"].map((value) => (
					// biome-ignore lint/a11y/useButtonType: <explanation>
					<button
						key={value}
						onClick={() => switchBoxArray(value)}
						className={`px-4 py-2 border border-gray-200 rounded ${
							selectedBoxArray === value ? "bg-blue-500 text-white" : "bg-white"
						}`}
					>
						{value}
					</button>
				))}
			</div>
		);
	};

	// Render: Displays the current close price and a list of boxes with their respective sizes and states.
	return (
		<div className="p-4">
			{initializationComplete ? (
				<>
					<BoxChart boxArrays={boxArrays} />
					<ResoBox boxArrays={boxArrays} />
					{renderToggleButtons()}
					<div className="my-4">
						<span className="font-bold">Current Close Price:</span>{" "}
						{currentClosePrice}
					</div>
					<table className="min-w-full table-auto">
						<thead>
							<tr className="bg-gray-200">
								<th className="px-4 py-2">Box Size</th>
								<th className="px-4 py-2">Status</th>
								<th className="px-4 py-2">High</th>
								<th className="px-4 py-2">Low</th>
							</tr>
						</thead>
						<tbody>
							{Object.entries(boxArrays).map(([size, box]) => (
								<tr key={size}>
									<td className="px-4 py-2">{size}</td>
									<td className="px-4 py-2">
										{box.boxMovedUp ? "UP" : box.boxMovedDn ? "DOWN" : "STABLE"}
									</td>
									<td className="px-4 py-2">{box.high}</td>
									<td className="px-4 py-2">{box.low}</td>
								</tr>
							))}
						</tbody>
					</table>
				</>
			) : (
				<div className="flex justify-center items-center h-full">
					Loading...
				</div>
			)}
		</div>
	);
};

export default BoxesModel;
