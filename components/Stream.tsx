import LoadingSkeleton from "@/components/loading/LoadingSkeleton";
import { StreamData } from "@/types";
import React from "react";

interface StreamProps {
    pair: string;
    data: StreamData | null;
}

const Stream: React.FC<StreamProps> = ({ pair, data }) => {
    const bid = data?.bids?.[0]?.price ?? "N/A";
    const ask = data?.asks?.[0]?.price ?? "N/A";

    return (
        <div className="flex w-full justify-center">
            <div className="w-full ">
                <div>
                    <span className="text-lg font-bold text-gray-200 ">
                        {pair}
                    </span>
                    :
                    {data ? (
                        <div className="flex flex-row flex-wrap leading-none ">
                            <div className="mr-2 flex flex-row py-1">
                                <div className="pr-1 font-bold uppercase text-teal-400">
                                    Bid:
                                </div>
                                <div className="text-gray-400">{bid}</div>
                            </div>
                            <div className="mr-2 flex flex-row py-1">
                                <div className="pr-1 font-bold uppercase text-red-400">
                                    Ask:
                                </div>
                                <div className="text-gray-400">{ask}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex h-full w-full p-2">
                            <LoadingSkeleton width="50" height="50" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Stream;
