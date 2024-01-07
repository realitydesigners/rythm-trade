"use client";
import { useUser } from "@clerk/nextjs";

import { OandaApiContext, api } from "@/app/api/OandaApi";
import BoxModel from "@/app/components/BoxModel";
import MasterPosition from "@/app/components/MasterPosition";
import Stream from "@/app/components/Stream";
import ThreeDModel from "@/app/components/ThreeDModel";
import { useParams } from "next/navigation";
import React, { useContext, useEffect, useState } from "react";

import { fetchPairPositionSummary } from "@/app/api/rest";
import { closeWebSocket, connectWebSocket } from "@/app/api/websocket";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/app/components/ui/select";
import { BOX_SIZES } from "@/app/utils/constants";


const PairPage = () => {
	const { user } = useUser();

	const params = useParams();

	const pair = Array.isArray(params.pair) ? params.pair[0] : params.pair || "";
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [streamData, setStreamData] = useState<{ [pair: string]: any }>({});
	const [positionData, setPositionData] = useState(null);
	// State for selected box array type
	const [selectedBoxArrayType, setSelectedBoxArrayType] = useState<string>("d");

	// Function to handle change in selected box array type
	const handleBoxArrayTypeChange = (newType: string) => {
		setSelectedBoxArrayType(newType);
	};
	useEffect(() => {
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const handleWebSocketMessage = (message: any) => {
			const { data, pair } = message;
			if (data.type !== "HEARTBEAT") {
				setStreamData((prevData) => ({
					...prevData,
					[pair]: data,
				}));
			}
		};
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		const handleWebSocketError = (event: any) => {
			console.error("WebSocket Error:", event);
		};

		const handleWebSocketClose = () => {
			console.log("WebSocket Disconnected");
		};

		if (user) {
			connectWebSocket(
				user.id,
				handleWebSocketMessage,
				handleWebSocketError,
				handleWebSocketClose,
			);
		}

		return () => {
			closeWebSocket();
		};
	}, [user]);

	useEffect(() => {
		if (user) {
			const fetchPosition = async () => {
				const position = await fetchPairPositionSummary(user.id, pair);
				console.log(position);
				setPositionData(position);
			};

			fetchPosition();
			const intervalId = setInterval(fetchPosition, 60000);

			return () => {
				clearInterval(intervalId);
			};
		}
	}, [pair, user]);

	return (
		<OandaApiContext.Provider value={api}>
			<div className="w-full relative z-0">
				{/* Top component */}
				<div className="w-full top-20 fixed z-30 pl-6 pr-6">
					<Stream pair={pair} data={streamData[pair]} />
				</div>

				{/* 3D Model component */}
				<div className="w-full">
					<div id="three" className="w-full flex h-screen absolute z-10">
						<ThreeDModel
							pair={pair}
							streamData={streamData[pair]}
							selectedBoxArrayType={selectedBoxArrayType}
						/>
					</div>

					{/* Selection and Elixr Model component */}
					<div
						className="w-auto   flex-rows  gap-2 flex fixed left-0 top-40 p-4"
						style={{ zIndex: 1001 }}
					>
						<Select
							value={selectedBoxArrayType}
							onValueChange={handleBoxArrayTypeChange}
						>
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
						<div id="elixr" className="w-full flex h-full">
							<BoxModel pair={pair} streamData={streamData[pair]} />
						</div>
					</div>
				</div>

				{/* Master Position component */}
				<div className="w-full fixed bottom-0 " style={{ zIndex: 1000 }}>
					<div className="w-full p-2 lg:p-4">
						{positionData && <MasterPosition positionData={[positionData]} />}
						{!positionData && <p>No position data available for {pair}</p>}
					</div>
				</div>
			</div>
		</OandaApiContext.Provider>
	);
};

export default PairPage;
