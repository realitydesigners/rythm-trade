"use client";
import { fetchPairPosition } from "@/app/api/actions/fetchPositionData";
import { useWebSocket } from "@/app/components/context/WebSocketContext";
import { Stream, ThreeDModel } from "@/app/components/index";
import { PositionData, StreamData } from "@/types";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";
type CommonComponentProps = {
	pair: string;
	data: StreamData | null;
	selectedBoxArrayType?: string;
	onBoxArrayTypeChange?: (newType: string) => void;
};

const PairPage = () => {
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
		<div className="w-full relative z-0">
			<StreamSection pair={pair} data={currentPairData} />
			<ThreeDModelSection
				pair={pair}
				data={currentPairData}
				selectedBoxArrayType={selectedBoxArrayType}
			/>
		</div>
	);
};

const StreamSection: React.FC<CommonComponentProps> = ({ pair, data }) => (
	<div className="w-full top-20 fixed z-30 pl-6 pr-6">
		<Stream pair={pair} data={data} />
	</div>
);

const ThreeDModelSection: React.FC<CommonComponentProps> = ({
	pair,
	data,
	selectedBoxArrayType,
}) => (
	<div className="w-full pb-20">
		<div id="three" className="w-full flex min-h-screen absolute z-10">
			<ThreeDModel
				pair={pair}
				streamData={data}
				selectedBoxArrayType={selectedBoxArrayType || ""}
			/>
		</div>
	</div>
);

export default PairPage;
