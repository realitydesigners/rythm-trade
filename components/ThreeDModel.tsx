import LoadingSkeleton from "@/components/loading/LoadingSkeleton";
import { StreamData } from "@/types";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import useFetchBoxes from "./hooks/useFetchBoxes";
import { ResoBox, ThreeDBox } from "./index";

interface ThreeDModelProps {
    pair: string;
    streamData: StreamData | null;
    selectedBoxArrayType: string;
}

const ThreeDModel: React.FC<ThreeDModelProps> = ({
    pair,
    streamData,
    selectedBoxArrayType,
}) => {
    const [boxView, setBoxView] = useState("3D");
    const { user } = useUser();

    const [currentClosePrice, setCurrentClosePrice] = useState<number | null>(
        null,
    );
    const { boxArrays, initializationComplete } = useFetchBoxes(
        user ?? undefined,
        pair,
        selectedBoxArrayType,
    );

    useEffect(() => {
        if (streamData) {
            const bidPrice = streamData.bids?.[0]?.price
                ? parseFloat(streamData.bids[0].price)
                : null;
            const askPrice = streamData.asks?.[0]?.price
                ? parseFloat(streamData.asks[0].price)
                : null;

            if (bidPrice !== null && askPrice !== null) {
                const currentPrice = (bidPrice + askPrice) / 2;
                setCurrentClosePrice(currentPrice);
            }
        }
    }, [streamData]);

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
        <div className="absolute h-full w-full rounded-xl border border-gray-600/50 bg-black">
            {initializationComplete ? (
                <div className="flex h-full flex-col p-2 lg:flex-row">
                    <div className="relative flex h-full w-full w-full  flex-col items-center p-1 lg:p-4 ">
                        <div className="relative flex h-full w-full overflow-hidden rounded-xl  border border-gray-600/50">
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
                </div>
            ) : (
                <LoadingSkeleton width="50" height="50" />
            )}
        </div>
    );
};

export default ThreeDModel;
