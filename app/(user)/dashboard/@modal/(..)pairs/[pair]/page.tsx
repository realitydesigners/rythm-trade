"use client";
import { fetchPairPosition } from "@/app/api/actions/fetchPositionData";
import Modal from "@/app/components/Modal";
import { useWebSocket } from "@/app/components/context/WebSocketContext";
import { ResoModel, Stream, ThreeDModel } from "@/app/components/index";
import { PositionData, StreamData } from "@/types";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

const PairPages = () => {
	const { user } = useUser();
	const { streamData } = useWebSocket();
	const params = useParams();
	const pair = Array.isArray(params.pair) ? params.pair[0] : params.pair || "";
	const [positionData, setPositionData] = useState<PositionData | null>(null);
	const [selectedBoxArrayType, setSelectedBoxArrayType] = useState("d");

	useEffect(() => {
		const getPositionData = async () => {
			if (user?.id) {
				const position = await fetchPairPosition(user.id, pair);
				setPositionData(position);
			}
		};

		getPositionData();
	}, [user?.id, pair]);

	const handleBoxArrayTypeChange = useCallback(
		(newType: string) => setSelectedBoxArrayType(newType),
		[],
	);

	const currentPairData: StreamData | null = streamData[pair] ?? null;

	return (
		<Modal>
			<div className="bg-black w-full h-full bg-gray-400 border border-gray-600/50 rounded-xl">
				<div className="w-auto p-8">
					<Stream pair={pair} data={currentPairData} />
				</div>
				<div className="w-full pb-20">
					<div className="w-full flex min-h-screen absolute z-10">
						<ThreeDModel
							pair={pair}
							streamData={currentPairData}
							selectedBoxArrayType={selectedBoxArrayType || ""}
						/>
					</div>
				</div>
			</div>
		</Modal>
	);
};

export default PairPages;
