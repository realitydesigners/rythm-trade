// src/api/rest.ts
const serverBaseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

/**
 * Fetches favorite currency pairs for a given user.
 * @param {string} userId - The user's unique identifier.
 * @returns {Promise<Array<string>>} A promise that resolves to an array of favorite currency pairs.
 * @throws {Error} Throws an error if the network response is not ok.
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const fetchFavoritePairs = async (userId: any) => {
   try {
      const response = await fetch(`${serverBaseUrl}/forex-preferences/${userId}`);
      if (!response.ok) {
         throw new Error('Network response was not ok');
      }
      const data = await response.json();
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
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

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const fetchInstruments = async (userId: any) => {
   try {
      const response = await fetch(`${serverBaseUrl}/instruments/${userId}`);
      if (!response.ok) {
         throw new Error('Failed to fetch instruments');
      }
      const instruments = await response.json();
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
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

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
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

/**
 * Fetches the position summary for a given currency pair.
 * @param {string} userId - The user's unique identifier.
 * @param {string} pair - The currency pair.
 * @returns {Promise<any>} - A promise that resolves to the position summary.
 * @throws {Error} - Throws an error if the network response is not ok.
 */
export const fetchPairPositionSummary = async (userId: string, pair: string) => {
   try {
      const response = await fetch(`${serverBaseUrl}/pair-position-summary/${userId}/${pair}`);
      if (!response.ok) {
         throw new Error(`Network response was not ok, status: ${response.status}`);
      }
      const text = await response.text();
      return text ? JSON.parse(text) : null;
   } catch (error) {
      console.error('Error fetching pair position summary:', error);
      throw error;
   }
};

/**
 * Updates Oanda credentials for a given user.
 * @param {string} userId - The user's unique identifier.
 * @param {string} apiKey - The Oanda API key.
 * @param {string} accountId - The Oanda account ID.
 * @throws {Error} Throws an error if the network response is not ok.
 */
export const updateOandaCredentials = async (userId: string, apiKey: string, accountId: string) => {
   try {
      console.log(`Updating credentials for ${userId}: apiKey=${apiKey}, accountId=${accountId}`);

      const response = await fetch(`${serverBaseUrl}/user/${userId}/oanda-credentials`, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ apiKey, accountId }),
      });

      if (!response.ok) {
         throw new Error('Network response was not ok');
      }
      return await response.json();
   } catch (error) {
      console.error('Error updating Oanda credentials:', error);
      throw error;
   }
};

/**
 * Fetches the Oanda credentials for a given user.
 * @param {string} userId - The user's unique identifier.
 * @returns {Promise<{ apiKey: string | null, accountId: string | null }>} A promise that resolves to the user's Oanda credentials.
 * @throws {Error} Throws an error if the network response is not ok.
 */
export const fetchOandaCredentials = async (userId: string) => {
   try {
      const response = await fetch(`${serverBaseUrl}/user/${userId}/oanda-credentials`);
      if (!response.ok) {
         throw new Error('Network response was not ok');
      }
      return await response.json();
   } catch (error) {
      console.error('Error fetching Oanda credentials:', error);
      throw error;
   }
};
