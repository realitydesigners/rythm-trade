import axios from "axios";

import {
  OANDA_BASE_URL,
  OANDA_STREAM_URL,
  OANDA_TOKEN,
  ACCOUNT_ID,
  INSTRUMENT,
} from "./index";

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
