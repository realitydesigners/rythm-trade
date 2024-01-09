import { Box, BoxArrays, CandleData } from "../../types";
import {
	BOX_SIZES,
	SymbolsToDigits,
	symbolsToDigits,
} from "../utils/constants";

interface BoxCalculationInput {
	pair: string;
	oandaData: CandleData[];
	selectedBoxArrayType: string;
}

// Generates a map of box sizes based on the provided point sizes and currency pair
const generateBoxSizes = (
	pair: string,
	pointSizes: number[],
	symbolsToDigits: SymbolsToDigits,
): Map<number, number> => {
	const { point: pointValue } = symbolsToDigits[pair] || { point: 0.00001 };
	// biome-ignore lint/style/useConst: <explanation>
	let boxSizeMap = new Map<number, number>();
	for (const size of pointSizes) {
		boxSizeMap.set(size, size * pointValue);
	}
	return boxSizeMap;
};

// Main function to calculate all boxes
const calculateAllBoxes = (input: BoxCalculationInput): BoxArrays => {
	const { pair, oandaData, selectedBoxArrayType } = input;
	const boxSizeMap = generateBoxSizes(
		pair,
		BOX_SIZES[selectedBoxArrayType],
		symbolsToDigits,
	);

	const newBoxArrays: BoxArrays = {};

	// Initialize boxes with the last candle's data
	const latestCandle = oandaData[oandaData.length - 1];
	for (const [wholeNumberSize, decimalSize] of boxSizeMap) {
		const latestPrice = parseFloat(latestCandle.mid.c);
		newBoxArrays[wholeNumberSize] = {
			high: latestPrice,
			low: latestPrice - decimalSize,
			boxMovedUp: false,
			boxMovedDn: false,
			rngSize: decimalSize,
		};
	}

	// Iterate over each candle in reverse to update boxes
	for (let i = oandaData.length - 1; i >= 0; i--) {
		const currentPrice = parseFloat(oandaData[i].mid.c);

		for (const [wholeNumberSize, decimalSize] of boxSizeMap) {
			const box = newBoxArrays[wholeNumberSize];

			if (!box) {
				console.error(`Box not defined for size: ${wholeNumberSize}`);
				throw new Error(`Box not defined for size: ${wholeNumberSize}`);
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
		}
	}

	return newBoxArrays;
};

export { calculateAllBoxes, BoxCalculationInput };
