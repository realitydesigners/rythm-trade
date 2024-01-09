// controllers/ModelsController.ts

import { calculateAllBoxes } from "../../models/BoxCalculations";
import { OandaApi } from "../../services/OandaApi";
import { DatabaseService } from "../../services/DatabaseService";

export class ModelController {
  private dbService: DatabaseService;

  constructor() {
    this.dbService = new DatabaseService();
  }

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
      process.env.OANDA_STREAM_URL
    );
  }

  async calculateBoxArrays(userId: string, pair: string, boxArrayType: string) {
    try {
      const oandaApi = await this.getOandaApiForUser(userId);
      if (!oandaApi) {
        console.error("Oanda API not initialized for user:", userId);
        return {};
      }

      const granularity = "M1";
      const count = 6000;
      const oandaData = await oandaApi.fetchLargeCandles(
        pair,
        count,
        granularity
      );

      if (!oandaData || oandaData.length === 0) {
        console.log("No data received from Oanda API");
        return {};
      }

      return calculateAllBoxes({
        pair,
        oandaData,
        selectedBoxArrayType: boxArrayType,
      });
    } catch (error) {
      console.error("Error in calculateBoxArrays:", error);
      throw new Error("An error occurred while calculating box arrays");
    }
  }
}
