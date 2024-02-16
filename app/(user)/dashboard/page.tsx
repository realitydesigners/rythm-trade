"use client";
import { fetchAllPairPositions } from "@/app/api/actions/fetchPositionData";
import FavoritesList from "@/app/components/FavoritesList";
import {
	MasterPosition,
	MasterProfile,
	ResoModel,
	Stream,
} from "@/app/components/index";
import {
	Button,
	Dialog,
	DialogContent,
	DialogTrigger,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/app/components/ui/index";
import { PositionData } from "@/types";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import {
	fetchFavoritePairs,
	fetchInstruments,
	updateFavoritePairs,
} from "../../api/rest";
import {
	closeWebSocket,
	connectWebSocket,
	sendWebSocketMessage,
} from "../../api/websocket";
import { BOX_SIZES } from "../../utils/constants";

const initialFavorites = [
	"GBP_USD",
	"USD_JPY",
	"AUD_USD",
	"EUR_JPY",
	"EUR_USD",
	"USD_CAD",
	"NZD_USD",
	"GBP_JPY",
];
const DashboardPage = () => {
	const { user } = useUser();
	const [currencyPairs, setCurrencyPairs] = useState<string[]>([]);
	const [favoritePairs, setFavoritePairs] = useState<string[]>([]);
	const [draggedItem, setDraggedItem] = useState<string | null>(null);
	const [allPairs, setAllPairs] = useState<string[]>([]);
	const [showProfile, setShowProfile] = useState(false);
	const [numDisplayedFavorites, setNumDisplayedFavorites] = useState<number>(0);
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [streamData, setStreamData] = useState<{ [pair: string]: any }>({});
	const [selectedBoxArrayTypes, setSelectedBoxArrayTypes] = useState(
		Object.fromEntries(allPairs.map((pair) => [pair, "d"])),
	);
	const [positionData, setPositionData] = useState<PositionData[]>([]);
	const [ws, setWs] = useState<WebSocket | null>(null);

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
		const loadFavoritePairs = async () => {
			if (user) {
				try {
					const fetchedFavoritePairs = await fetchFavoritePairs(user.id);
					setFavoritePairs(fetchedFavoritePairs);
					setNumDisplayedFavorites(fetchedFavoritePairs.length);

					const newSelectedBoxArrayTypes = fetchedFavoritePairs.reduce(
						(acc: { [x: string]: string }, pair: string | number) => {
							acc[pair] = "d";
							return acc;
						},
						{},
					);
					setSelectedBoxArrayTypes(newSelectedBoxArrayTypes);
				} catch (error) {
					console.error("Error fetching favorite pairs:", error);
				}
			}
		};

		loadFavoritePairs();
	}, [user]);

	// Function to handle updating favorite pairs
	const handleUpdateFavoritePairs = async (newPairs: string[]) => {
		if (user) {
			try {
				await updateFavoritePairs(user.id, newPairs);
				setFavoritePairs(newPairs);

				// Send updated favorite pairs to the WebSocket server
				sendWebSocketMessage({
					userId: user.id,
					favoritePairs: newPairs,
				});
			} catch (error) {
				console.error("Error updating favorite pairs:", error);
			}
		}
		const updatedBoxArrayTypes = { ...selectedBoxArrayTypes };
		// biome-ignore lint/complexity/noForEach: <explanation>
		newPairs.forEach((pair) => {
			if (!updatedBoxArrayTypes[pair]) {
				updatedBoxArrayTypes[pair] = "d";
			}
		});
		setSelectedBoxArrayTypes(updatedBoxArrayTypes);
	};

	const handleBoxArrayChange = (pair: string, selectedKey: string) => {
		setSelectedBoxArrayTypes((prev) => ({
			...prev,
			[pair]: selectedKey,
		}));
	};

	const toggleProfile = () => {
		setShowProfile((prevShow) => !prevShow);
	};
	useEffect(() => {
		const loadInstruments = async () => {
			if (user) {
				try {
					const fetchedInstruments = await fetchInstruments(user.id);
					setAllPairs(fetchedInstruments);
					setCurrencyPairs(fetchedInstruments);
				} catch (error) {
					console.error("Error fetching instruments:", error);
				}
			}
		};

		loadInstruments();
	}, [user]);

	// Fetch position data periodically
	useEffect(() => {
		const getPositionData = async () => {
			if (user?.id) {
				const positions = await fetchAllPairPositions(user.id);
				setPositionData(positions);
			}
		};

		getPositionData();
	}, [user?.id]);

	useEffect(() => {
		const displayedFavorites = favoritePairs.slice(0, numDisplayedFavorites);
		const filteredPairs = allPairs.filter(
			(pair) => !displayedFavorites.includes(pair),
		);
		setCurrencyPairs(filteredPairs);
	}, [favoritePairs, allPairs, numDisplayedFavorites]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
	useEffect(() => {
		// Update favorite pairs on the server only when there's a change
		const updateFavoritePairsOnServer = async () => {
			if (JSON.stringify(favoritePairs) !== JSON.stringify(initialFavorites)) {
				await handleUpdateFavoritePairs(favoritePairs);
			}
		};

		if (favoritePairs.length > 0) {
			updateFavoritePairsOnServer();
		}
	}, [favoritePairs]);

	const handleReplaceFavorite = (selectedPair: string, index: number) => {
		setFavoritePairs((prev) => {
			const newFavorites = [...prev];
			newFavorites[index] = selectedPair;
			return newFavorites;
		});
	};

	const handleDragStart = (pair: string) => {
		setDraggedItem(pair);
	};

	const handleDragOver = (event: React.DragEvent<HTMLElement>) => {
		event.preventDefault();
	};

	const handleDrop = (
		event: React.DragEvent<HTMLElement>,
		dropZoneId: string,
		index = -1,
	) => {
		event.preventDefault();
		if (!draggedItem) return;

		if (dropZoneId === "favorites" && index !== -1) {
			setFavoritePairs((prev) => {
				const newFavorites = [...prev];
				const existingIndex = newFavorites.indexOf(draggedItem);

				if (existingIndex !== -1) {
					[newFavorites[index], newFavorites[existingIndex]] = [
						newFavorites[existingIndex],
						newFavorites[index],
					];
				} else {
					newFavorites[index] = draggedItem;
				}

				return newFavorites;
			});
		}

		setDraggedItem(null);
	};
	// Function to delete a favorite pair
	const deleteFavoritePair = async (pairToDelete: string) => {
		const updatedPairs = favoritePairs.filter((pair) => pair !== pairToDelete);
		await handleUpdateFavoritePairs(updatedPairs); // Update pairs on the server
		setFavoritePairs(updatedPairs); // Update local state
	};

	// Function to add a selected pair to favorites
	const addToFavorites = async (pairToAdd: string) => {
		if (!pairToAdd) return;
		if (favoritePairs.includes(pairToAdd)) {
			alert("This pair is already in your favorites!");
			return;
		}
		const updatedPairs = [...favoritePairs, pairToAdd];
		await handleUpdateFavoritePairs(updatedPairs);
		setFavoritePairs(updatedPairs);
		setNumDisplayedFavorites(updatedPairs.length);
	};

	return (
		<div>
			<div className="w-full flex pt-20 lg:pt-20 lg:p-6 p-4 flex-wrap ">
				<FavoritesList favoritePairs={favoritePairs} streamData={streamData} />
				<div className="w-full flex flex-wrap gap-2 mb-4">
					<Dialog>
						<DialogTrigger asChild>
							<Button onClick={toggleProfile}>Account Summary</Button>
						</DialogTrigger>
						<DialogContent>
							<MasterProfile />
						</DialogContent>
					</Dialog>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 lg:gap-4 w-full">
					{favoritePairs.slice(0, numDisplayedFavorites).map((pair, index) => (
						<div
							key={pair}
							className="w-full flex flex-col p-3 lg:p-6 border border-gray-600/50 h-[140vw] md:h-[70vw] lg:h-[45vw] rounded-lg"
							onDrop={(e) => handleDrop(e, "favorites", index)}
							onDragOver={handleDragOver}
							draggable
							onDragStart={() => handleDragStart(pair)}
						>
							<div className="w-full flex flex-row justify-evenly items-center gap-2">
								<div className="w-full p-2">
									<Stream pair={pair} data={streamData[pair]} />
								</div>

								<Link
									href={`/dashboard/pairs/${pair}`}
									className="relative bg-gray-600/25 w-10 flex items-center justify-center rounded-[1em] h-10 rounded-lg transition-transform hover:scale-105 hover:brightness-110 overflow-hidden"
								>
									<div className="absolute inset-0 bg-gray-600/25 transition-opacity opacity-0 hover:opacity-100" />
									{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
									<svg
										className="w-4 h-4 text-gray-200/75 transform scale-x-[-1] transition-transform duration-300 ease-in-out"
										xmlns="http://www.w3.org/2000/svg"
										viewBox="0 0 20 20"
										fill="currentColor"
										xlinkTitle="svg"
									>
										<path
											fillRule="evenodd"
											d="M10.707 2.293a1 1 0 010 1.414L4.414 10l6.293 6.293a1 1 0 11-1.414 1.414l-7-7a1 1 0 010-1.414l7-7a1 1 0 011.414 0z"
											clipRule="evenodd"
										/>
									</svg>
								</Link>
							</div>

							<ResoModel
								pair={pair}
								streamData={streamData[pair]}
								selectedBoxArrayType={selectedBoxArrayTypes[pair]}
							/>
							<div className="w-full  flex justify-center items-center gap-2">
								<Select
									value={selectedBoxArrayTypes[pair]}
									onValueChange={(newValue) =>
										handleBoxArrayChange(pair, newValue)
									}
								>
									<SelectTrigger>
										<SelectValue>{selectedBoxArrayTypes[pair]}</SelectValue>
									</SelectTrigger>
									<SelectContent>
										{Object.keys(BOX_SIZES).map((arrayKey) => (
											<SelectItem key={arrayKey} value={arrayKey}>
												{arrayKey}
											</SelectItem>
										))}
									</SelectContent>
								</Select>

								<Select
									value={pair}
									onValueChange={(newValue) =>
										handleReplaceFavorite(newValue, index)
									}
								>
									<SelectTrigger>
										<SelectValue>{pair}</SelectValue>
									</SelectTrigger>
									<SelectContent>
										{currencyPairs.map((p) => (
											<SelectItem key={p} value={p}>
												{p}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
								<Button onClick={() => deleteFavoritePair(pair)}>Delete</Button>
							</div>
						</div>
					))}
					<Select
						onValueChange={(pairToAdd) => addToFavorites(pairToAdd)}
						value=""
					>
						<div className="w-full border border-gray-600/50 rounded-lg flex flex-col justify-center   items-center p-4 space-y-4 relative">
							<div className="text-9xl text-gray-600/75 pb-4">+</div>
							<div className="w-full flex justify-center z-10 text-center">
								<SelectTrigger>
									<p className="text-gray-200 text-xs w-full text-left p-2">
										Select Pair
									</p>
								</SelectTrigger>

								<SelectContent>
									{currencyPairs
										.filter((pair) => !favoritePairs.includes(pair))
										.map((pair) => (
											<SelectItem key={pair} value={pair}>
												{pair}
											</SelectItem>
										))}
								</SelectContent>
							</div>
						</div>
					</Select>
				</div>
			</div>
			<div className="w-full p-2 lg:p-4">
				<MasterPosition positionData={positionData} />
			</div>
		</div>
	);
};

export default DashboardPage;
