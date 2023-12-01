import { DatabaseService } from '../../services/DatabaseService';

export class UserController {
  private dbService: DatabaseService;

  constructor() {
    this.dbService = new DatabaseService();
  }

  /**
   * Retrieves a user by their Clerk ID.
   * @param {string} clerkUserId - The Clerk user ID.
   * @returns {Promise<any>} A promise that resolves to the user data.
   */
  public async getUserByClerkId(clerkUserId: string): Promise<any> {
    return await this.dbService.getUserByClerkId(clerkUserId);
  }

  /**
   * Creates or updates a user in the database.
   * @param {string} clerkUserId - The Clerk user ID.
   * @param {string} userEmail - The user's email address.
   * @param {string} [userName] - The user's name. Optional.
   * @returns {Promise<any>} A promise that resolves to the created or updated user data.
   */
  public async createUserOrUpdate(clerkUserId: string, userEmail: string, userName?: string): Promise<any> {
    return await this.dbService.createUserOrUpdate(clerkUserId, userEmail, userName);
  }

  /**
   * Retrieves Forex preferences for a given user.
   * @param {string} userId - The user's ID.
   * @returns {Promise<any>} A promise that resolves to the Forex preferences.
   */
  public async getForexPreferences(userId: string): Promise<any> {
    return await this.dbService.getForexPreferences(userId);
  }

  /**
   * Sets Forex preferences for a given user.
   * @param {string} userId - The user's ID.
   * @param {string[]} pairs - The Forex pairs.
   * @returns {Promise<any>} A promise that resolves to the updated Forex preferences.
   */
  public async setForexPreferences(userId: string, pairs: string[]): Promise<any> {
    return await this.dbService.setForexPreferences(userId, pairs);
  }
}