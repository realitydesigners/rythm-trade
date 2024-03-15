"use client";
import { fetchPairPosition } from "@/app/api/actions/fetchPositionData";
import { fetchBoxArrays } from "@/app/api/rest";
import { useWebSocket } from "@/components/context/WebSocketContext";
import { ResoBox, Stream, ThreeDBox } from "@/components/index";
import LoadingSkeleton from "@/components/loading/LoadingSkeleton";
import { StreamData } from "@/types";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const PairPage = () => {
	const { user } = useUser();
	const { streamData } = useWebSocket();
	const params = useParams();
	const pair = Array.isArray(params.pair) ? params.pair[0] : params.pair || "";
	const [positionData, setPositionData] = useState(null);
	const [currentClosePrice, setCurrentClosePrice] = useState<number | null>(
		null,
	);
	const [boxArrays, setBoxArrays] = useState({});
	const [selectedBoxArrayType, setSelectedBoxArrayType] = useState("d");
	const [boxView, setBoxView] = useState("3D");
	const [initializationComplete, setInitializationComplete] = useState(false);

	useEffect(() => {
		if (user?.id) {
			fetchPairPosition(user.id, pair).then(setPositionData);
			const fetchBoxes = async () => {
				const newBoxArrays = await fetchBoxArrays(
					user.id,
					pair,
					selectedBoxArrayType,
				);
				setBoxArrays(newBoxArrays);
				setInitializationComplete(true);
			};
			fetchBoxes();
		}
	}, [user?.id, pair, selectedBoxArrayType]);

	useEffect(() => {
		const getPositionData = async () => {
			if (user?.id) {
				const position = await fetchPairPosition(user.id, pair);
				setPositionData(position);
			}
		};

		getPositionData();
	}, [user?.id, pair]);

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
		<div className="h-full w-full rounded-xl  bg-black">
			{initializationComplete ? (
				<div className="relative top-16 flex h-full flex-col  p-2 lg:flex-row">
					<div className="relative flex h-full w-full flex-col items-center  justify-center p-1 lg:w-1/2 lg:p-4 ">
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
	);
};

export default PairPage;
