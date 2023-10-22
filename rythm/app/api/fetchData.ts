import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const OANDA_BASE_URL = process.env.NEXT_PUBLIC_OANDA_BASE_URL;
const OANDA_TOKEN = process.env.NEXT_PUBLIC_OANDA_TOKEN;
const ACCOUNT_ID = process.env.NEXT_PUBLIC_ACCOUNT_ID;

export const fetchData = async () => {
  // Check for the presence of required environment variables
  if (!OANDA_TOKEN || !ACCOUNT_ID) {
    console.error(
      "Missing necessary environment variables (OANDA_TOKEN or ACCOUNT_ID)."
    );
    return null;
  }

  try {
    const response = await axios.get(
      `${OANDA_BASE_URL}/accounts/${ACCOUNT_ID}/instruments/GBP_USD/candles?granularity=M1`,
      {
        headers: {
          Authorization: `Bearer ${OANDA_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status !== 200) {
      throw new Error(
        `Failed to fetch data from Oanda. Status Code: ${response.status}`
      );
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return null;
  }
};
