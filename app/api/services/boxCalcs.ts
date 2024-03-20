import { BoxArrays } from "@/types";
import { BOX_SIZES, SymbolsToDigits, symbolsToDigits } from "@/utils/constants";

const generateBoxSizes = (
  pair: string,
  pointSizes: number[],
  symbolsToDigits: SymbolsToDigits
): Map<number, number> => {
  const { point: pointValue } = symbolsToDigits[pair] || { point: 0.00001 };
  let boxSizeMap = new Map<number, number>();
  for (const size of pointSizes) {
    boxSizeMap.set(size, size * pointValue);
  }
  return boxSizeMap;
};
export const updateBoxArraysWithCurrentPrice = (
  currentPrice: number,
  existingBoxArrays: BoxArrays,
  pair: string,
  selectedBoxArrayType: string
): BoxArrays => {
  const boxSizeMap = generateBoxSizes(
    pair,
    BOX_SIZES[selectedBoxArrayType],
    symbolsToDigits
  );

  const updatedBoxArrays: BoxArrays = { ...existingBoxArrays };

  for (const [wholeNumberSize, decimalSize] of boxSizeMap) {
    const box = updatedBoxArrays[wholeNumberSize];

    if (!box) {
      console.error(`Box not defined for size: ${wholeNumberSize}`);
      continue;
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
  }

  return updatedBoxArrays;
};
