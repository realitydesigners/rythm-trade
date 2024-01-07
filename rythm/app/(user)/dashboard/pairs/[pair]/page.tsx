"use client";
import { fetchPairPosition } from "@/app/api/actions/fetchPositionData";
import { closeWebSocket, connectWebSocket } from "@/app/api/websocket";
import {
	BoxModel,
	MasterPosition,
	Stream,
	ThreeDModel,
} from "@/app/components/index";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/app/components/ui";
import {
	OandaApiContext,
	api,
} from "../../../../../../ryver/src/services/OandaApi";

import { BOX_SIZES } from "@/app/utils/constants";
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

const useWebSocketData = (userId: string | undefined, pair: string) => {
	const [streamData, setStreamData] = useState<Record<string, unknown>>({});

	useEffect(() => {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const handleWebSocketMessage = (message: any) => {
			const { data } = message;
			if (data?.type !== "HEARTBEAT") {
				setStreamData((prevData) => ({ ...prevData, [pair]: data }));
			}
		};

		if (userId) {
			connectWebSocket(userId, handleWebSocketMessage, console.error, () =>
				console.log("WebSocket Disconnected"),
			);
			return () => closeWebSocket();
		}
	}, [userId, pair]);

	return streamData;
};

const PairPage = () => {
	const { user } = useUser();
	const params = useParams();
	const pair = Array.isArray(params.pair) ? params.pair[0] : params.pair || "";
	const [positionData, setPositionData] = useState(null);
	const [selectedBoxArrayType, setSelectedBoxArrayType] = useState("d");
	const streamData = useWebSocketData(user?.id, pair);

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

	return (
		<OandaApiContext.Provider value={api}>
			<div className="w-full relative z-0">
				<StreamSection pair={pair} data={streamData[pair]} />
				<ThreeDModelSection
					pair={pair}
					data={streamData[pair]}
					selectedBoxArrayType={selectedBoxArrayType}
				/>
				<BoxModelSection
					pair={pair}
					data={streamData[pair]}
					selectedBoxArrayType={selectedBoxArrayType}
					onBoxArrayTypeChange={handleBoxArrayTypeChange}
				/>
				<MasterPositionSection data={positionData} pair={""} />
			</div>
		</OandaApiContext.Provider>
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
	<div className="w-full">
		<div id="three" className="w-full flex h-screen absolute z-10">
			<ThreeDModel
				pair={pair}
				streamData={data}
				selectedBoxArrayType={selectedBoxArrayType || ""}
			/>
		</div>
	</div>
);

const BoxModelSection: React.FC<CommonComponentProps> = ({
	pair,
	data,
	selectedBoxArrayType,
	onBoxArrayTypeChange,
}) => (
	<div className="w-full">
		<SelectBoxArrayType
			selectedBoxArrayType={selectedBoxArrayType}
			onBoxArrayTypeChange={onBoxArrayTypeChange}
			pair={""}
			data={undefined}
		/>
		<div id="elixr" className="w-full flex h-full">
			<BoxModel pair={pair} streamData={data} />
		</div>
	</div>
);

const SelectBoxArrayType: React.FC<CommonComponentProps> = ({
	selectedBoxArrayType,
	onBoxArrayTypeChange,
}) => (
	<div
		className="flex-rows gap-2 flex fixed left-0 top-40 p-4"
		style={{ zIndex: 1001 }}
	>
		<Select value={selectedBoxArrayType} onValueChange={onBoxArrayTypeChange}>
			<SelectTrigger>
				<SelectValue>{selectedBoxArrayType}</SelectValue>
			</SelectTrigger>
			<SelectContent>
				{Object.keys(BOX_SIZES).map((arrayKey) => (
					<SelectItem key={arrayKey} value={arrayKey}>
						{arrayKey}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	</div>
);

const MasterPositionSection: React.FC<CommonComponentProps> = ({ data }) => (
	<div className="w-full fixed bottom-0" style={{ zIndex: 1000 }}>
		<div className="w-full p-2 lg:p-4">
			{data ? (
				<MasterPosition positionData={[data]} />
			) : (
				<p>No position data available.</p>
			)}
		</div>
	</div>
);

export default PairPage;
