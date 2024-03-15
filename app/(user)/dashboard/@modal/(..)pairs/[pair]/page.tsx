"use client";
import { useWebSocket } from "@/components/context/WebSocketContext";
import useFetchBoxes from "@/components/hooks/useFetchBoxes";
import { Modal, ResoBox, Stream, ThreeDBox } from "@/components/index";
import LoadingSkeleton from "@/components/loading/LoadingSkeleton";
import { StreamData } from "@/types";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import React, { useState } from "react";

const PairPages = () => {
	const { user } = useUser();
	const { streamData } = useWebSocket();
	const params = useParams();
	const pair = Array.isArray(params.pair) ? params.pair[0] : params.pair || "";
	const [boxView, setBoxView] = useState("3D");
	const [selectedBoxArrayType, setSelectedBoxArrayType] = useState("d");

	const { boxArrays, initializationComplete } = useFetchBoxes(
		user ?? undefined,
		pair,
		selectedBoxArrayType,
	);

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
						<div className="  flex h-full w-full flex-col  p-1 lg:w-1/2 lg:p-4 ">
							<div
								id="charts"
								className="relative flex h-full w-full items-center justify-center rounded-xl  border border-gray-600/50 "
							>
								{boxView === "3D" ? (
									<div className="flex h-full w-full items-center justify-center ">
										<ThreeDBox boxArrays={boxArrays} />
									</div>
								) : (
									<div className="flex h-[40em] w-[40em] rounded-lg p-6">
										<ResoBox boxArrays={boxArrays} />
									</div>
								)}

								<div className="z-90 absolute right-4 top-4 flex flex-col gap-2">
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
					<div className="flex h-full w-full items-center  justify-center">
						<LoadingSkeleton width="100" height="100" />
					</div>
				)}
			</div>
		</Modal>
	);
};

export default PairPages;
