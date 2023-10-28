
/**
 * Finds the index of the highest high in a given data range.
 *
 * @param {Array} data - The dataset to search through.
 * @param {number} start - The starting index for the search.
 * @param {number} end - The ending index for the search.
 * @return {number} - The index of the highest high within the given range.
 */
export const findHighestHighIndex = (data: any[], start: number, end: number): number => {
    let highestIndex = start;
    for (let i = start; i >= end; i--) {
        if (parseFloat(data[i].mid.c) > parseFloat(data[highestIndex].mid.c)) {
            highestIndex = i;
        }
    }
    return highestIndex;
};

/**
 * Finds the index of the lowest low in a given data range.
 *
 * @param {Array} data - The dataset to search through.
 * @param {number} start - The starting index for the search.
 * @param {number} end - The ending index for the search.
 * @return {number} - The index of the lowest low within the given range.
 */
export const findLowestLowIndex = (data: any[], start: number, end: number): number => {
    let lowestIndex = start;
    for (let i = start; i >= end; i--) {
        if (parseFloat(data[i].mid.c) < parseFloat(data[lowestIndex].mid.c)) {
            lowestIndex = i;
        }
    }
    return lowestIndex;
};
