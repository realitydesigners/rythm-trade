// src/api/rest.ts
const serverBaseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

/**
 * Fetches favorite currency pairs for a given user.
 * @param {string} userId - The user's unique identifier.
 * @returns {Promise<Array<string>>} A promise that resolves to an array of favorite currency pairs.
 * @throws {Error} Throws an error if the network response is not ok.
 */
export const fetchFavoritePairs = async (userId: any) => {
  try {
    const response = await fetch(`${serverBaseUrl}/forex-preferences/${userId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.pairs.map((pair: { pair: any }) => pair.pair);
  } catch (error) {
    console.error('Error fetching favorite pairs:', error);
    throw error;
  }
};

/**
 * Updates the favorite currency pairs for a given user.
 * @param {string} userId - The user's unique identifier.
 * @param {Array<string>} newPairs - An array of new favorite currency pairs.
 * @throws {Error} Throws an error if the network response is not ok.
 */
export const updateFavoritePairs = async (userId: any, newPairs: any) => {
  try {
    const response = await fetch(`${serverBaseUrl}/forex-preferences`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId, pairs: newPairs }),
    });
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
  } catch (error) {
    console.error('Error updating favorite pairs:', error);
    throw error;
  }
};

/**
 * Fetches available trading instruments for a given user.
 * @param {string} userId - The user's unique identifier.
 * @returns {Promise<Array<string>>} A promise that resolves to an array of instrument names.
 * @throws {Error} Throws an error if the network response is not ok.
 */
export const fetchInstruments = async (userId: any) => {
  try {
    const response = await fetch(`${serverBaseUrl}/instruments/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch instruments');
    }
    const instruments = await response.json();
    return instruments.map((inst: { name: any }) => inst.name);
  } catch (error) {
    console.error('Error fetching instruments:', error);
    throw error;
  }
};

/**
 * Fetches all trading positions for a given user.
 * @param {string} userId - The user's unique identifier.
 * @returns {Promise<any>} A promise that resolves to the positions data.
 * @throws {Error} Throws an error if the network response is not ok.
 */
export const fetchAllPositions = async (userId: any) => {
  try {
    const response = await fetch(`${serverBaseUrl}/positions/${userId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const positions = await response.json();
    return positions;
  } catch (error) {
    console.error('Error fetching positions:', error);
    throw error;
  }
};