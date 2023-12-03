// src/api/rest.ts
const serverBaseUrl = process.env.NEXT_PUBLIC_SERVER_URL;

export const fetchFavoritePairs = async (userId: any) => {
  try {
    const response = await fetch(`${serverBaseUrl}/forex-preferences/${userId}`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    return data.pairs.map((pair: { pair: any; }) => pair.pair);
  } catch (error) {
    console.error('Error fetching favorite pairs:', error);
    throw error;
  }
};

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

export const fetchInstruments = async (userId: any) => {
  try {
    const response = await fetch(`${serverBaseUrl}/instruments/${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch instruments');
    }
    const instruments = await response.json();
    return instruments.map((inst: { name: any; }) => inst.name);
  } catch (error) {
    console.error('Error fetching instruments:', error);
    throw error;
  }
};

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
  