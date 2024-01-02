import { OandaApi } from "../../services/OandaApi";
import { DatabaseService } from "../../services/DatabaseService";

export class OandaController {
	private dbService: DatabaseService;

	constructor() {
		this.dbService = new DatabaseService();
	}

	/**
	 * Retrieves an instance of the OandaApi for a user based on their credentials.
	 * @param {string} userId - The user's ID.
	 * @returns {Promise<OandaApi | null>} A promise that resolves to an OandaApi instance or null if credentials are missing.
	 */
	private async getOandaApiForUser(userId: string): Promise<OandaApi | null> {
		const userData = await this.dbService.getUserByClerkId(userId);
		if (!userData || !userData.oandaApiKey || !userData.oandaAccountId) {
			console.error(`Oanda credentials not found for user ID: ${userId}`);
			return null;
		}
		return new OandaApi(
			userData.oandaApiKey,
			process.env.OANDA_BASE_URL,
			userData.oandaAccountId,
			process.env.OANDA_STREAM_URL,
		);
	}

	/**
	 * Retrieves the account summary from the Oanda API.
	 * @param {string} userId - The ID of the user for whom the account summary is being fetched.
	 * @returns {Promise<any>} A promise that resolves to the account summary.
	 */
	public async getAccountSummary(userId: string): Promise<any> {
		console.log("Received request for getAccountSummary");

		try {
			const oandaApi = await this.getOandaApiForUser(userId);
			if (!oandaApi) return { error: "Oanda API not initialized" };
			const summary = await oandaApi.getAccountSummary();
			console.log("Account Summary:", summary);
			return summary;
		} catch (error) {
			console.error("Error in getAccountSummary:", error);
			return { error: "An error occurred while fetching account summary" };
		}
	}

	/**
	 * Retrieves the list of instruments from the Oanda API for a user's account.
	 * @param {string} userId - The ID of the user for whom the instruments are being fetched.
	 * @returns {Promise<any>} A promise that resolves to the list of instruments.
	 */
	public async getInstruments(userId: string): Promise<any> {
		console.log(`Received request for getInstruments for user: ${userId}`);

		try {
			const oandaApi = await this.getOandaApiForUser(userId);
			if (!oandaApi) return { error: "Oanda API not initialized" };
			// Fetch instruments for the user's account
			const instruments = await oandaApi.getAccountInstruments();
			console.log("Instruments:", instruments);
			return instruments;
		} catch (error) {
			console.error("Error in getInstruments:", error);
			return { error: "An error occurred while fetching instruments" };
		}
	}

	/**
	 * Retrieves all positions from the Oanda API for a user's account.
	 * @param {string} userId - The ID of the user for whom the positions are being fetched.
	 * @returns {Promise<any>} A promise that resolves to the list of all positions.
	 */
	public async getAllPositions(userId: string): Promise<any> {
		try {
			const oandaApi = await this.getOandaApiForUser(userId);
			if (!oandaApi) return { error: "Oanda API not initialized" };
			// Fetch all positions for the user's account
			const positions = await oandaApi.getAllPositions();
			return positions;
		} catch (error) {
			console.error("Error in getAllPositions:", error);
			return { error: "An error occurred while fetching positions" };
		}
	}

	/**
	 * Retrieves the position summary for a given currency pair.
	 * @param {string} userId - The ID of the user.
	 * @param {string} pair - The currency pair.
	 * @returns {Promise<any>} - A promise that resolves to the position summary.
	 */
	async getPairPositionSummary(userId: string, pair: string): Promise<any> {
		console.log(
			`Received request for getPairPositionSummary for user: ${userId}, pair: ${pair}`,
		);
		try {
			const oandaApi = await this.getOandaApiForUser(userId);
			if (!oandaApi) return { error: "Oanda API not initialized" };
			// Assuming there is a method in oandaApi to get the pair position summary
			const positionSummary = await oandaApi.getPairPositionSummary(pair);
			console.log("Pair Position Summary:", positionSummary);
			return positionSummary;
		} catch (error) {
			console.error("Error in getPairPositionSummary:", error);
			return {
				error: "An error occurred while fetching pair position summary",
			};
		}
	}
}
