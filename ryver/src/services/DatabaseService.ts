import { PrismaClient, User } from "@prisma/client";

export class DatabaseService {
	private prisma: PrismaClient;

	constructor() {
		this.prisma = new PrismaClient();
	}

	/**
	 * Retrieves a user by their Clerk ID.
	 * @param {string} clerkUserId - The Clerk user ID.
	 * @returns {Promise<User | null>} A promise that resolves to the user data or null if not found.
	 */
	public async getUserByClerkId(clerkUserId: string): Promise<User | null> {
		try {
			const user = await this.prisma.user.findUnique({
				where: { clerkUserId },
			});
			return user;
		} catch (error) {
			console.error("Error in getUserByClerkId:", error);
			throw error;
		}
	}

	/**
	 * Creates a new user or updates an existing one in the database.
	 * @param {string} clerkUserId - The Clerk user ID.
	 * @param {string} userEmail - The user's email address.
	 * @param {string} [userName] - The user's name. Optional.
	 * @returns {Promise<User>} A promise that resolves to the created or updated user data.
	 */
	public async createUserOrUpdate(
		clerkUserId: string,
		userEmail: string,
		userName?: string,
	): Promise<User> {
		try {
			const user = await this.prisma.user.upsert({
				where: { clerkUserId },
				update: { email: userEmail, name: userName },
				create: { clerkUserId, email: userEmail, name: userName },
			});
			console.log(user);
			return user;
		} catch (error) {
			console.error("Error in createUserOrUpdate:", error);
			throw error;
		}
	}

	/**
	 * Retrieves Forex preferences for a user by their user ID.
	 * @param {number} userId - The user's ID.
	 * @returns {Promise<any>} A promise that resolves to the Forex preferences.
	 */
	public async getForexPreferences(userId: string): Promise<any> {
		try {
			const forexPreference = await this.prisma.forexPreference.findUnique({
				where: { userId },
				include: { pairs: true }, // Include related ForexPair entities
			});
			return forexPreference;
		} catch (error) {
			console.error("Error in getForexPreferences:", error);
			throw error;
		}
	}

	/**
	 * Sets Forex preferences for a user by their user ID.
	 * @param {number} userId - The user's ID.
	 * @param {string[]} pairs - An array of Forex pairs.
	 * @returns {Promise<any>} A promise that resolves after setting the preferences.
	 */
	public async setForexPreferences(
		userId: string,
		pairs: string[],
	): Promise<any> {
		try {
			console.log(
				`Setting Forex preferences for user: ${userId} with pairs: ${pairs.join(
					", ",
				)}`,
			);

			// First, create or find the ForexPreference entity
			const forexPreference = await this.prisma.forexPreference.upsert({
				where: { userId },
				update: {},
				create: { userId },
			});

			console.log(
				`ForexPreference entity created or found with ID: ${forexPreference.id}`,
			);

			// Delete existing ForexPairs for the preference
			const deleteResult = await this.prisma.forexPair.deleteMany({
				where: { forexPreferenceId: forexPreference.id },
			});

			console.log(`Deleted ${deleteResult.count} existing ForexPair(s)`);

			// Prepare new ForexPairs data
			const forexPairs = pairs.map((pair) => ({
				forexPreferenceId: forexPreference.id,
				pair,
			}));

			console.log("ForexPairs to be created:", forexPairs);

			// Create new ForexPairs
			const createResult = await this.prisma.forexPair.createMany({
				data: forexPairs,
				skipDuplicates: true, // This might help avoid the unique constraint error
			});

			console.log(`Created ${createResult.count} new ForexPair(s)`);

			return forexPreference;
		} catch (error) {
			console.error("Error in setForexPreferences:", error);
			throw error;
		}
	}

	/**
	 * Updates Oanda credentials (API key and account ID) for a user in the database.
	 * @param {string} userId - The user's ID.
	 * @param {string} apiKey - The new Oanda API key to set.
	 * @param {string} accountId - The new Oanda account ID to set.
	 * @returns {Promise<User>} A promise that resolves to the updated user data.
	 */
	public async updateUserOandaCredentials(
		userId: string,
		apiKey: string,
		accountId: string,
	): Promise<User> {
		console.log(`Updating Oanda credentials for user ${userId}`);
		return await this.prisma.user.update({
			where: { clerkUserId: userId },
			data: { oandaApiKey: apiKey, oandaAccountId: accountId },
		});
	}
}
