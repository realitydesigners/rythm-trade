import { CandleData } from '../../types';

export function findCurrentPrice(data: CandleData[]): number | undefined {
   if (data.length === 0) {
      return undefined;
   }

   const sortedData = data.sort((a, b) => {
      const timeA = new Date(a.time).getTime();
      const timeB = new Date(b.time).getTime();
      return timeB - timeA;
   });

   return parseFloat(sortedData[0].mid.c);
}

export function findHighest(data: CandleData[], startIdx: number, endIdx: number): number | undefined {
   if (startIdx < 0 || endIdx >= data.length || startIdx > endIdx) {
      return undefined; // Handle invalid input
   }

   let highestValue = -Infinity;
   for (let i = startIdx; i <= endIdx; i++) {
      const closePrice = parseFloat(data[i].mid.c); // Convert to a number
      if (closePrice > highestValue) {
         highestValue = closePrice;
      }
   }
   return highestValue;
}

export function findLowest(data: CandleData[], startIdx: number, endIdx: number): number | undefined {
   if (startIdx < 0 || endIdx >= data.length || startIdx > endIdx) {
      return undefined; // Handle invalid input
   }

   let lowestValue = Infinity;
   for (let i = startIdx; i <= endIdx; i++) {
      const closePrice = parseFloat(data[i].mid.c); // Convert to a number
      if (closePrice < lowestValue) {
         lowestValue = closePrice;
      }
   }
   return lowestValue;
}
