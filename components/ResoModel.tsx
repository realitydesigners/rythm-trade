"use client";

import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { fetchBoxArrays } from "../app/api/rest";
import { BoxArrays, StreamData } from "../types";
import ResoBox from "./ResoBox";
import useFetchBoxes from "./useFetchBoxes"; // Assuming useFetchBoxes is exported from a file named useFetchBoxes.ts

interface ResoModelProps {
	pair: string;
	streamData: StreamData | null;
	selectedBoxArrayType: string;
}

const ResoModel: React.FC<ResoModelProps> = ({
	pair,
	streamData,
	selectedBoxArrayType,
}) => {
	const { user } = useUser();

	const { boxArrays, initializationComplete } = useFetchBoxes(
		user ?? undefined,
		pair,
		selectedBoxArrayType,
	);

	const [currentClosePrice, setCurrentClosePrice] = useState<number | null>(
		null,
	);

	useEffect(() => {
		if (streamData) {
			const bidPrice = streamData.bids?.[0]?.price
				? parseFloat(streamData.bids[0].price)
				: null;
			const askPrice = streamData.asks?.[0]?.price
				? parseFloat(streamData.asks[0].price)
				: null;

			if (bidPrice !== null && askPrice !== null) {
				const currentPrice = (bidPrice + askPrice) / 2;
				setCurrentClosePrice(currentPrice);
			}
		}
	}, [streamData]);

	// Render
	if (!initializationComplete) {
		return (
			<div className="flex h-full w-full items-center  justify-center">
				{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
				<svg
					width="50"
					height="50"
					viewBox="0 0 50 50"
					xmlns="http://www.w3.org/2000/svg"
				>
					<circle
						cx="25"
						cy="25"
						r="20"
						stroke="#333"
						strokeWidth="5"
						fill="none"
						strokeDasharray="31.415, 31.415"
						strokeDashoffset="0"
					>
						<animateTransform
							attributeName="transform"
							type="rotate"
							from="0 25 25"
							to="360 25 25"
							dur="1s"
							repeatCount="indefinite"
						/>
					</circle>
				</svg>
			</div>
		);
	}

	return (
		<div className="h-auto w-full font-bold text-teal-400">
			<ResoBox boxArrays={boxArrays} />
		</div>
	);
};

export default ResoModel;
