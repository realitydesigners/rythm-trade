"use server";

import { fetchAllPositions, fetchPairPositionSummary } from "@/app/api/rest";

export async function fetchPairPosition(userId: string, pair: string) {
	try {
		const pairPositionData = await fetchPairPositionSummary(userId, pair);
		console.log("pairPositionData", pairPositionData);
		return pairPositionData;
	} catch (error) {
		console.error("Error fetching position data:", error);
		return null;
	}
}

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export async function fetchAllPairPositions(userId: string): Promise<any> {
	try {
		const allPositionsData = await fetchAllPositions(userId);
		console.log("allPositionsData", allPositionsData);
		return allPositionsData;
	} catch (error) {
		console.error("Error fetching positions:", error);
		return null;
	}
}
