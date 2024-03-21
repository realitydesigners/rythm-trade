// src/api/rest.ts
const serverBaseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
const handleResponse = async (response: any) => {
	if (!response.ok) {
		const errorData = await response.text();
		throw new Error(`Error: ${response.status}, ${errorData}`);
	}
	return response.json();
};

/**
 * Fetches favorite currency pairs for a given user.
 * @param {string} userId - The user's unique identifier.
 * @returns {Promise<Array<string>>} A promise that resolves to an array of favorite currency pairs.
 * @throws {Error} Throws an error if the network response is not ok.
 */

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const fetchFavoritePairs = async (userId: any) => {
	try {
		console.log("Fetching favorite pairs for userId:", userId);
		const response = await fetch(
			`${serverBaseUrl}/forex-preferences/${userId}`,
		);
		const data = await handleResponse(response);
		// Assuming data.pairs is an array of objects with a 'pair' property
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		return data.pairs.map((pair: { pair: any }) => pair.pair);
	} catch (error) {
		console.error("Error fetching favorite pairs:", error);
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
		console.log("Updating favorite pairs for userId:", userId);
		const response = await fetch(`${serverBaseUrl}/forex-preferences`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ userId, pairs: newPairs }),
		});
		await handleResponse(response);
	} catch (error) {
		console.error("Error updating favorite pairs:", error);
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
			throw new Error("Failed to fetch instruments");
		}
		const instruments = await response.json();
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		return instruments.map((inst: { name: any }) => inst.name);
	} catch (error) {
		console.error("Error fetching instruments:", error);
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
			throw new Error("Network response was not ok");
		}
		const positions = await response.json();
		return positions;
	} catch (error) {
		console.error("Error fetching positions:", error);
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
export const fetchPairPositionSummary = async (
	userId: string,
	pair: string,
) => {
	try {
		const response = await fetch(
			`${serverBaseUrl}/pair-position-summary/${userId}/${pair}`,
		);
		if (!response.ok) {
			throw new Error(
				`Network response was not ok, status: ${response.status}`,
			);
		}
		const text = await response.text();
		return text ? JSON.parse(text) : null;
	} catch (error) {
		console.error("Error fetching pair position summary:", error);
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
export const updateOandaCredentials = async (
	userId: string,
	apiKey: string,
	accountId: string,
) => {
	try {
		console.log(
			`Updating credentials for ${userId}: apiKey=${apiKey}, accountId=${accountId}`,
		);

		const response = await fetch(
			`${serverBaseUrl}/user/${userId}/oanda-credentials`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ apiKey, accountId }),
			},
		);

		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return await response.json();
	} catch (error) {
		console.error("Error updating Oanda credentials:", error);
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
		const response = await fetch(
			`${serverBaseUrl}/user/${userId}/oanda-credentials`,
		);
		if (!response.ok) {
			throw new Error("Network response was not ok");
		}
		return await response.json();
	} catch (error) {
		console.error("Error fetching Oanda credentials:", error);
		throw error;
	}
};

/**
 * Fetches box arrays for a given user.
 * @param {string} userId - The user's unique identifier.
 * @param {string} pair - The currency pair.
 * @param {string} boxArrayType - The type of box array.
 * @returns {Promise<BoxArrays>} A promise that resolves to the box arrays.
 * @throws {Error} Throws an error if the network response is not ok.
 */
export const fetchBoxArrays = async (
	userId: any,
	pair: any,
	boxArrayType: any,
) => {
	try {
		console.log("log array");
		console.log(userId, pair, boxArrayType);
		const response = await fetch(`${serverBaseUrl}/calculate-box-arrays`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ userId, pair, boxArrayType }),
		});
		return await handleResponse(response);
	} catch (error) {
		console.error("Error fetching box arrays:", error);
		throw error;
	}
};

/**
 * Fetches candle data for a given user and currency pair.
 * @param {string} userId - The user's unique identifier.
 * @param {string} pair - The currency pair.
 * @param {number} count - The number of candles to fetch.
 * @param {string} granularity - The granularity of the candles.
 * @returns {Promise<CandleData[]>} A promise that resolves to an array of candle data.
 * @throws {Error} Throws an error if the network response is not ok.
 */
export const fetchCandles = async (
	userId: any,
	pair: any,
	count = 300,
	granularity = "S5",
) => {
	try {
		const response = await fetch(
			`${serverBaseUrl}/candles/${userId}/${pair}?count=${count}&granularity=${granularity}`,
		);
		if (!response.ok) {
			throw new Error("Failed to fetch candles");
		}
		return await response.json();
	} catch (error) {
		console.error("Error fetching candles:", error);
		throw error;
	}
};
