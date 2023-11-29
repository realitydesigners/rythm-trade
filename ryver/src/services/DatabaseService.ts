import { PrismaClient, User } from '@prisma/client';

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
      console.error('Error in getUserByClerkId:', error);
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
  public async createUserOrUpdate(clerkUserId: string, userEmail: string, userName?: string): Promise<User> {
    try {
      const user = await this.prisma.user.upsert({
        where: { clerkUserId },
        update: { email: userEmail, name: userName },
        create: { clerkUserId, email: userEmail, name: userName },
      });
      return user;
    } catch (error) {
      console.error('Error in createUserOrUpdate:', error);
      throw error;
    }
  }
}
