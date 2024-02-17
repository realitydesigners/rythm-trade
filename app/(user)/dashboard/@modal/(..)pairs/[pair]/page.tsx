"use client";
import { closeWebSocket, connectWebSocket } from "@/app/api/websocket";
import Modal from "@/app/components/Modal";
import { useWebSocket } from "@/app/components/context/WebSocketContext";
import { ResoModel, Stream, ThreeDModel } from "@/app/components/index";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import React, { useCallback, useEffect, useState } from "react";

type CommonComponentProps = {
	pair: string;
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	data: any;
	selectedBoxArrayType?: string;
	onBoxArrayTypeChange?: (newType: string) => void;
};

const PairPage = () => {
	const { user } = useUser();
	const params = useParams();
	const { streamData } = useWebSocket();
	const pair = Array.isArray(params.pair) ? params.pair[0] : params.pair || "";
	const [selectedBoxArrayType, setSelectedBoxArrayType] = useState("d");

	const handleBoxArrayTypeChange = useCallback(
		(newType: string) => setSelectedBoxArrayType(newType),
		[],
	);

	return (
		<Modal>
			<div className="w-full h-full bg-black/80 border-gray-600/50 p-8 border rounded-lg">
				<StreamSection pair={pair} data={streamData[pair]} />
			</div>
		</Modal>
	);
};

const StreamSection: React.FC<CommonComponentProps> = ({
	pair,
	data,
	selectedBoxArrayType,
}) => (
	<div className="flex-row">
		<Stream pair={pair} data={data} />
		{/* <ThreeDModelSection
			pair={pair}
			data={data}
			selectedBoxArrayType={selectedBoxArrayType}
		/> */}
	</div>
);

const ThreeDModelSection: React.FC<CommonComponentProps> = ({
	pair,
	data,
	selectedBoxArrayType,
}) => (
	<div className="w-full pb-20">
		<div id="three" className="w-full flex">
			<ResoModel
				pair={pair}
				streamData={data}
				selectedBoxArrayType={selectedBoxArrayType || ""}
			/>
		</div>
	</div>
);

export default PairPage;
