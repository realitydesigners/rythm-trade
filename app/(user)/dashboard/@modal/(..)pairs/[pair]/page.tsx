"use client";
import { fetchBoxArrays } from "@/app/api/rest";
import Modal from "@/app/components/Modal";
import { useWebSocket } from "@/app/components/context/WebSocketContext";
import { ResoBox, Stream, ThreeDBox } from "@/app/components/index";
import LoadingSkeleton from "@/app/components/loading/LoadingSkeleton";
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
	const [boxArrays, setBoxArrays] = useState<Record<string, any>>({});
	const [initializationComplete, setInitializationComplete] = useState(false);

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
		<button
			type="button"
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
					<LoadingSkeleton />
				)}
			</div>
		</Modal>
	);
};

export default PairPages;
