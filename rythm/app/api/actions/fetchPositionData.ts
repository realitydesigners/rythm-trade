"use server";

import { fetchPairPositionSummary } from "@/app/api/rest";

export async function fetchPairPosition(userId: string, pair: string) {
	try {
		const positionData = await fetchPairPositionSummary(userId, pair);
		console.log("positionData", positionData);
		return positionData;
	} catch (error) {
		console.error("Error fetching position data:", error);
		return null;
	}
}
