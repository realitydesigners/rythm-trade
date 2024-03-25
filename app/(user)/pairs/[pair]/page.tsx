"use client";
import { fetchPairPosition } from "@/app/api/actions/fetchPositionData";
import { fetchBoxArrays } from "@/app/api/rest";
import { fetchCandles } from "@/app/api/rest";
import { updateBoxArraysWithCurrentPrice } from "@/app/api/services/boxCalcs";
import LineChart from "@/components/charts/LineChart";
import StreamChart from "@/components/charts/StreamChart";
import { useWebSocket } from "@/components/context/WebSocketContext";
import { ResoBox, Stream, ThreeDBox } from "@/components/index";
import LoadingCircle from "@/components/loading/LoadingCircle";
import { CandleData, StreamData } from "@/types";
import { useUser } from "@clerk/nextjs";
import { useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

const PairPage = () => {
    const { user } = useUser();
    const { streamData } = useWebSocket();
    const params = useParams();
    const pair = Array.isArray(params.pair)
        ? params.pair[0]
        : params.pair || "";
    const [positionData, setPositionData] = useState(null);
    const [boxArrays, setBoxArrays] = useState({});
    const [selectedBoxArrayType, setSelectedBoxArrayType] = useState("d");
    const [boxView, setBoxView] = useState("2D");
    const [initializationComplete, setInitializationComplete] = useState(false);
    const [candles, setCandles] = useState<CandleData[]>([]);
    const [s5Candles, setS5Candles] = useState<CandleData[]>([]);

    useEffect(() => {
        if (user?.id) {
            fetchPairPosition(user.id, pair).then(setPositionData);
            const fetchAndUpdateBoxes = async () => {
                const initialBoxArrays = await fetchBoxArrays(
                    user.id,
                    pair,
                    selectedBoxArrayType,
                );
                setBoxArrays(initialBoxArrays);
                setInitializationComplete(true);
            };
            fetchAndUpdateBoxes();
        }
    }, [user?.id, pair, selectedBoxArrayType]);

    useEffect(() => {
        if (initializationComplete && streamData[pair]) {
            console.log("Updating boxes with new stream data for pair:", pair);
            const currentPrice = parseFloat(streamData[pair].closeoutBid);
            console.log(`Current price for ${pair}:`, currentPrice);
            const updatedBoxArrays = updateBoxArraysWithCurrentPrice(
                currentPrice,
                boxArrays,
                pair,
                selectedBoxArrayType,
            );
            console.log(
                `Updated box arrays for ${pair} with type ${selectedBoxArrayType}:`,
                updatedBoxArrays,
            );
            setBoxArrays(updatedBoxArrays);
        }
    }, [
        streamData,
        pair,
        boxArrays,
        selectedBoxArrayType,
        initializationComplete,
    ]);

    useEffect(() => {
        if (user?.id && pair) {
            fetchCandles(user.id, pair, 300, "S5")
                .then((candleData) => {
                    setCandles(candleData);
                    console.log(
                        "Candle data fetched successfully:",
                        candleData,
                    );
                })
                .catch((error) => {
                    console.error("Failed to fetch candle data:", error);
                });
        }
    }, [user?.id, pair]);

    const fetchNewS5Candles = () => {
        if (user?.id && pair) {
            fetchCandles(user.id, pair, 1, "S5")
                .then((newCandles) => {
                    setS5Candles((prevCandles: CandleData[]) => [
                        ...prevCandles,
                        ...newCandles,
                    ]);
                })
                .catch((error) => {
                    console.error("Failed to fetch new S5 candle:", error);
                });
        }
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        fetchCandles(user?.id, pair, 1500, "S5")
            .then((candleData) => {
                setS5Candles(candleData);
                console.log(
                    "Initial S5 candles fetched successfully:",
                    candleData,
                );
            })
            .catch((error) => {
                console.error("Failed to fetch initial S5 candles:", error);
            });

        const interval = setInterval(fetchNewS5Candles, 5000);

        return () => clearInterval(interval);
    }, [user?.id, pair]);

    const currentPairData: StreamData | null = streamData[pair] ?? null;

    return (
        <div className="h-full w-full rounded-xl bg-black">
            {initializationComplete ? (
                <div className="relative top-16 flex h-full flex-col flex-wrap p-2 lg:flex-row">
                    <div className="flex h-full w-full flex-col items-center justify-center gap-4 ">
                        <div className="flex h-full w-full p-6">
                            <StreamChart
                                s5Candles={candles}
                                streamingData={currentPairData}
                                boxArrays={boxArrays}
                            />
                        </div>
                        <div className="flex h-full w-full p-6">
                            <LineChart
                                s5Candles={s5Candles}
                                boxArrays={boxArrays}
                            />
                        </div>
                    </div>
                    <div className="relative flex h-full w-full flex-col items-center justify-center p-1 lg:w-1/2 lg:p-4 ">
                        <div className="relative flex h-[500px] w-full overflow-hidden rounded-xl border border-gray-600/25 lg:h-[800px] ">
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
                                <button
                                    type="button"
                                    onClick={() => setBoxView("3D")}
                                    className={`transform rounded-md px-4 py-2 transition-colors duration-300 ease-in-out focus:outline-none ${
                                        boxView === "3D"
                                            ? "bg-gray-200 text-gray-900"
                                            : "bg-gray-600/50 text-white hover:bg-gray-500"
                                    }`}
                                >
                                    3D
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setBoxView("2D")}
                                    className={`transform rounded-md px-4 py-2 transition-colors duration-300 ease-in-out focus:outline-none ${
                                        boxView === "2D"
                                            ? "bg-gray-200 text-gray-900"
                                            : "bg-gray-600/50 text-white hover:bg-gray-500"
                                    }`}
                                >
                                    2D
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex h-full w-full p-1 lg:w-1/2 lg:p-4">
                        <div className="h-full w-full rounded-xl border border-gray-600/25 p-6">
                            <Stream pair={pair} data={currentPairData} />
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex h-screen w-screen items-center  justify-center">
                    <LoadingCircle width="100" height="100" />
                </div>
            )}
        </div>
    );
};

export default PairPage;
