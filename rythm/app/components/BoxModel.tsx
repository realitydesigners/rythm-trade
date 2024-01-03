"use client";


import { symbolsToDigits } from "@/app/utils/constants";
import React, { useContext, useEffect, useRef, useState } from "react";
import { Button } from "../../components/ui/button";
import { CandleData, StreamData } from "../../types";
import { OandaApiContext } from "../api/OandaApi";

interface PriceBoxModelProps {
	pair: string;
	streamData: StreamData | null;
}

interface PriceBox {
	slope: number;
	intercept: number;
	touches: number;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	toggleActive?: any;
}

const BoxModel: React.FC<PriceBoxModelProps> = ({ pair, streamData }) => {
	const api = useContext(OandaApiContext);
	const priceBoxInstance = useRef<PriceBox | null>(null);

	const [initializationComplete, setInitializationComplete] =
		useState<boolean>(false);
	const [priceBoxes, setPriceBoxes] = useState<{
		priceBoxMax: PriceBox[];
		priceBoxMin: PriceBox[];
	} | null>(null); // Updated variable names
	const [currentPrice, setCurrentPrice] = useState<number>(0);
	const [priceToBoxRatio, setPriceToBoxRatio] = useState<number>(0.5); // Updated variable name
	const [intersectingPrice, setIntersectingPrice] = useState<number>(0);
	const [botActive, setBotActive] = useState(false);

	const toggleBot = () => {
		setBotActive(!botActive);
	};


	const findLocalExtrema = (
		data: number[],
		findMax: boolean,
		numCandles = 5,
	): number[] => {
		const extrema: number[] = [];
		for (let i = numCandles; i < data.length - numCandles; i++) {
			let isExtrema = true;
			for (let j = 1; j <= numCandles; j++) {
				if (findMax) {
					if (data[i] <= data[i - j] || data[i] <= data[i + j]) {
						isExtrema = false;
						break;
					}
				} else {
					if (data[i] >= data[i - j] || data[i] >= data[i + j]) {
						isExtrema = false;
						break;
					}
				}
			}
			if (isExtrema) {
				extrema.push(i);
			}
		}
		return extrema;
	};

	const pairPointValue = symbolsToDigits[pair]?.point || 0.00001;

	const checkTouch = (price: number, index: number, box: PriceBox): boolean => {
		const expectedPrice = box.slope * index + box.intercept;
		const threshold = pairPointValue * 30;
		return Math.abs(price - expectedPrice) < threshold;
	};

	const countTouches = (prices: number[], boxes: PriceBox[]): PriceBox[] => {
		return boxes.map((box) => {
			let touchCount = 0;
			// biome-ignore lint/complexity/noForEach: <explanation>
			prices.forEach((price, index) => {
				if (checkTouch(price, index, box)) {
					touchCount++;
				}
			});
			return { ...box, touches: touchCount };
		});
	};
	const calculateSlope = (
		x: number[],
		y: number[],
	): { slope: number; intercept: number } => {
		if (x.length !== 2 || y.length !== 2) {
			throw new Error("calculateSlope function expects exactly two points");
		}

		const [x1, x2] = x;
		const [y1, y2] = y;
		const slope = (y2 - y1) / (x2 - x1);
		const intercept = y1 - slope * x1;

		return { slope, intercept };
	};
	const calculatePriceBoxIntersection = (
		boxMax: { intercept: number; slope: number },
		boxMin: { intercept: number; slope: number }
	) => {
		if (
			boxMax.slope === boxMin.slope ||
			(boxMax.slope < boxMin.slope &&
				boxMax.intercept < boxMin.intercept) ||
			(boxMax.slope > boxMin.slope &&
				boxMax.intercept > boxMin.intercept)
		) {
			return null;
		}

		const xIntersection =
			(boxMin.intercept - boxMax.intercept) /
			(boxMax.slope - boxMin.slope);
		const intersectingPrice =
			boxMax.slope * xIntersection + boxMax.intercept;

		return intersectingPrice;
	}

	const calculatePriceBoxes = (oandaData: CandleData[]): {
		priceBoxMax: PriceBox[];
		priceBoxMin: PriceBox[];
	} => {
		const highs = oandaData.map((data) => parseFloat(data.mid.h));
		const lows = oandaData.map((data) => parseFloat(data.mid.l));

		const maxIdx = findLocalExtrema(highs, true);
		const minIdx = findLocalExtrema(lows, false);

		const priceBoxMax: PriceBox[] = [];
		const priceBoxMin: PriceBox[] = [];

		for (let i = 0; i < maxIdx.length - 1; i++) {
			const x = [maxIdx[i], maxIdx[i + 1]];
			const y = [highs[x[0]], highs[x[1]]];
			const { slope, intercept } = calculateSlope(x, y);
			priceBoxMax.push({ slope, intercept, touches: 0 });
		}

		for (let i = 0; i < minIdx.length - 1; i++) {
			const x = [minIdx[i], minIdx[i + 1]];
			const y = [lows[x[0]], lows[x[1]]];
			const { slope, intercept } = calculateSlope(x, y);
			priceBoxMin.push({ slope, intercept, touches: 0 });
		}

		const touchedPriceBoxMax = countTouches(highs, priceBoxMax).filter(
			(priceBox) => priceBox.touches >= 10
		);
		const touchedPriceBoxMin = countTouches(lows, priceBoxMin).filter(
			(priceBox) => priceBox.touches >= 10
		);

		return { priceBoxMax: touchedPriceBoxMax, priceBoxMin: touchedPriceBoxMin };
	};


	const calculateAveragePriceBox = (boxes: PriceBox[]): PriceBox => {
		const numElixrs = boxes.length;
		if (numElixrs === 0) {
			return { slope: 0, intercept: 0, touches: 0 };
		}

		let totalSlope = 0;
		let totalIntercept = 0;
		let totalTouches = 0;

		// biome-ignore lint/complexity/noForEach: <explanation>
		boxes.forEach((box) => {
			totalSlope += box.slope;
			totalIntercept += box.intercept;
			totalTouches += box.touches;
		});

		const averageSlope = totalSlope / numElixrs;
		const averageIntercept = totalIntercept / numElixrs;
		const averageTouches = totalTouches / numElixrs;

		return {
			slope: averageSlope,
			intercept: averageIntercept,
			touches: averageTouches,
		};
	};

	const generateMasterPriceBoxesAndUpdatePrice = (
		oandaData: CandleData[]
	) => {
		const boxes = calculatePriceBoxes(oandaData);

		const averageBoxMax = calculateAveragePriceBox(boxes.priceBoxMax);
		const averageBoxMin = calculateAveragePriceBox(boxes.priceBoxMin);

		setPriceBoxes({ priceBoxMax: [averageBoxMax], priceBoxMin: [averageBoxMin] });

		const intersectPrice = calculatePriceBoxIntersection(
			averageBoxMax,
			averageBoxMin
		);
		if (intersectPrice !== null) {
			setIntersectingPrice(intersectPrice);
		} else {
			console.log("No intersection between price boxes");
		}
		setInitializationComplete(true);
	};

	const updatePriceToBoxRatio = () => {
		if (
			priceBoxes &&
			priceBoxes.priceBoxMax.length > 0 &&
			priceBoxes.priceBoxMin.length > 0
		) {
			const maxBoxLastIndex = priceBoxes.priceBoxMax.length - 1;
			const minBoxLastIndex = priceBoxes.priceBoxMin.length - 1;
			const maxBoxPrice =
				priceBoxes.priceBoxMax[0].slope * maxBoxLastIndex +
				priceBoxes.priceBoxMax[0].intercept;
			const minBoxPrice =
				priceBoxes.priceBoxMin[0].slope * minBoxLastIndex +
				priceBoxes.priceBoxMin[0].intercept;

			if (currentPrice > maxBoxPrice) {
				setPriceToBoxRatio(1.0);
			} else if (currentPrice < minBoxPrice) {
				setPriceToBoxRatio(0.0);
			} else {
				const distanceToMax = Math.abs(currentPrice - maxBoxPrice);
				const distanceToMin = Math.abs(currentPrice - minBoxPrice);
				const totalDistance = distanceToMax + distanceToMin;
				const ratio =
					totalDistance > 0 ? distanceToMin / totalDistance : 0.5;
				setPriceToBoxRatio(ratio);
			}
		}
	};

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		if (streamData && initializationComplete && priceBoxInstance.current) {
			const bidPrice = streamData.bids?.[0]?.price
				? parseFloat(streamData.bids[0].price)
				: null;
			const askPrice = streamData.asks?.[0]?.price
				? parseFloat(streamData.asks[0].price)
				: null;

			if (bidPrice !== null && askPrice !== null) {
				const currentPrice = (bidPrice + askPrice) / 2;
				setCurrentPrice(currentPrice);


			}

		}
	}, [
		streamData,
		initializationComplete,
		currentPrice,
		priceToBoxRatio,
		intersectingPrice,
	]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		// biome-ignore lint/style/useConst: <explanation>
		let intervalId: NodeJS.Timeout;

		const fetchAndCalculatePriceBoxes = async () => {
			const oandaData = await api?.fetchLargeCandles(pair, 6000, "M1");
			if (oandaData && oandaData.length > 0) {
				generateMasterPriceBoxesAndUpdatePrice(oandaData);
			} else {
				console.log("No data received from Oanda API");
			}
		};

		fetchAndCalculatePriceBoxes();
		intervalId = setInterval(fetchAndCalculatePriceBoxes, 60000);

		return () => clearInterval(intervalId);
	}, [pair]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		updatePriceToBoxRatio();
	}, [currentPrice, priceBoxes]);

	return (
		<div className="w-full h-auto ">
			{initializationComplete ? (
				<>
					{/* Render P/L table */}
					<div className="w-full flex justify-center items-center gap-2">
						<Button onClick={toggleBot}>
							{botActive ? "Turn Off PriceBox" : "Turn On PriceBox"}
						</Button>
					</div>
				</>
			) : (
				<div className="w-full p-2 h-auto flex justify-center">

					{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
					<svg
						width="25"
						height="25"
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
			)}
		</div>
	);
};

export default BoxModel;

