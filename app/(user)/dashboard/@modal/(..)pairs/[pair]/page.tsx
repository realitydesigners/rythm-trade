"use client";
import { fetchBoxArrays } from "@/app/api/rest"; // Importing fetchBoxArrays from the second code snippet
import Modal from "@/app/components/Modal";
import { useWebSocket } from "@/app/components/context/WebSocketContext";
import { ResoBox, Stream, ThreeDBox } from "@/app/components/index"; // Importing ThreeDBox and ResoBox from the second code snippet
import { PositionData, StreamData } from "@/types";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";

import React, { useEffect, useState } from "react";

const PairPages = () => {
	const { user } = useUser();
	const { streamData } = useWebSocket();
	const params = useParams();
	const pair = Array.isArray(params.pair) ? params.pair[0] : params.pair || "";
	const [boxView, setBoxView] = useState("3D");
	const [positionData, setPositionData] = useState<PositionData | null>(null);
	const [selectedBoxArrayType, setSelectedBoxArrayType] = useState("d");
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [boxArrays, setBoxArrays] = useState<Record<string, any>>({}); // State to hold box arrays
	const [initializationComplete, setInitializationComplete] = useState(false); // State to track initialization completion

	useEffect(() => {
		// biome-ignore lint/style/useConst: <explanation>
		let intervalId: NodeJS.Timeout;

		const fetchAndSetBoxes = async () => {
			if (user?.id) {
				console.log("Fetching boxes...");
				try {
					const newBoxArrays = await fetchBoxArrays(
						user.id,
						pair,
						selectedBoxArrayType,
					);
					setBoxArrays(newBoxArrays);
					setInitializationComplete(true);
				} catch (error) {
					console.error("Error fetching box arrays:", error);
				}
			}
		};

		fetchAndSetBoxes();
		intervalId = setInterval(fetchAndSetBoxes, 60000);

		return () => clearInterval(intervalId);
	}, [user, pair, selectedBoxArrayType]);

	const currentPairData: StreamData | null = streamData[pair] ?? null;

	const ViewSwitchButton = ({ view }: { view: string }) => (
		// biome-ignore lint/a11y/useButtonType: <explanation>
		<button
			onClick={() => setBoxView(view)}
			className={`transform rounded-md px-4 py-2 transition-colors duration-300 ease-in-out focus:outline-none ${
				boxView === view
					? "bg-gray-200 text-gray-900"
					: "bg-gray-600/50 text-white hover:bg-gray-500"
			}`}
		>
			{view}
		</button>
	);

	return (
		<Modal>
			<div className="h-full w-full rounded-xl border border-gray-600/50 bg-black">
				{initializationComplete ? (
					<div className="flex h-full flex-col p-2 lg:flex-row">
						<div className="relative flex h-full w-full flex-col  items-center p-1 lg:w-1/2 lg:p-4 ">
							<div className="relative flex h-[500px] w-full overflow-hidden rounded-xl  border border-gray-600/50 lg:h-[800px] ">
								{boxView === "3D" ? (
									<div className="flex h-full w-full items-center justify-center ">
										<ThreeDBox boxArrays={boxArrays} />
									</div>
								) : (
									<div className="flex h-full w-full items-center justify-center py-20 pr-6 lg:p-20 lg:py-0 lg:pr-0">
										<ResoBox boxArrays={boxArrays} />
									</div>
								)}

								<div className="z-80 absolute right-4 top-4 flex flex-col gap-2">
									<ViewSwitchButton view="3D" />
									<ViewSwitchButton view="2D" />
								</div>
							</div>
						</div>
						<div className="flex h-full w-full p-1 lg:w-1/2 lg:p-4">
							<div className="h-full w-full rounded-xl border border-gray-600/50 p-6">
								<Stream pair={pair} data={currentPairData} />
							</div>
						</div>
					</div>
				) : (
					<LoadingIndicator />
				)}
			</div>
		</Modal>
	);
};

export default PairPages;

const LoadingIndicator = () => (
	<div className="flex h-full w-full items-center justify-center">
		{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
		<svg
			width="80"
			height="80"
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
