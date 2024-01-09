"use client";

import React, { useEffect, useState } from "react";
import { BoxArrays, StreamData } from "../../types";
import ThreeDBox from "./ThreeDBox";
import { fetchBoxArrays } from "../api/rest";
import { ResoBox } from ".";

interface ThreeDModelProps {
	pair: string;
	streamData: StreamData | null;
	selectedBoxArrayType: string;
	userId: string;
}

const ThreeDModel: React.FC<ThreeDModelProps> = ({
	pair,
	streamData,
	selectedBoxArrayType,
	userId,
}) => {
	const [boxArrays, setBoxArrays] = useState<BoxArrays>({});
	const [initializationComplete, setInitializationComplete] =
		useState<boolean>(false);

	useEffect(() => {
		let intervalId: string | number | NodeJS.Timeout | undefined;

		const fetchAndSetBoxes = async () => {
			try {
				const newBoxArrays = await fetchBoxArrays(
					userId,
					pair,
					selectedBoxArrayType,
				);
				setBoxArrays(newBoxArrays);
				setInitializationComplete(true);
			} catch (error) {
				console.error("Error fetching box arrays:", error);
			}
		};

		// Fetch immediately and then set up the interval
		fetchAndSetBoxes();
		intervalId = setInterval(fetchAndSetBoxes, 60000); // Fetch every 60 seconds

		// Clean up the interval on component unmount
		return () => clearInterval(intervalId);
	}, [userId, pair, selectedBoxArrayType]);

	// Render
	if (!initializationComplete) {
		return (
			<div className="w-full h-full flex items-center  justify-center">
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
		<div className="w-full min-h-screen relative font-bold">
			{initializationComplete ? (
				<>
					<div className="grid grid-cols-1 lg:grid-cols-2 w-full h-screen min-h-screen items-center justify-center gap-[1em] lg:pl-0 lg:pr-8 ">
						{/* <ThreeDBox boxArrays={boxArrays} /> */}
						<ResoBox boxArrays={boxArrays} />
					</div>
				</>
			) : (
				<div>Loading...</div>
			)}
		</div>
	);
};

export default ThreeDModel;
