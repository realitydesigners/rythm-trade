import LoadingSkeleton from "@/components/loading/LoadingSkeleton";
import { StreamData } from "@/types";
import { SymbolsToDigits, symbolsToDigits } from "@/utils/constants";
import React from "react";

interface StreamProps {
    pair: string;
    data: StreamData | null;
}

const Stream: React.FC<StreamProps> = ({ pair, data }) => {
    const bid = data?.bids?.[0]?.price ?? "N/A";
    const ask = data?.asks?.[0]?.price ?? "N/A";
    const spreadInPoints = data ? parseFloat(ask) - parseFloat(bid) : NaN;

    const currencyPairDetails: SymbolsToDigits[keyof SymbolsToDigits] = pair
        ? symbolsToDigits[pair]
        : { point: 0, digits: 0 };
    const pipFactor = 10 ** currencyPairDetails.digits;

    const spread = Number.isNaN(spreadInPoints)
        ? "N/A"
        : (spreadInPoints * pipFactor).toFixed(1);

    return (
        <div className="flex w-full flex-col">
            <div>
                <span className="text-xl font-bold text-gray-200">{pair}</span>
                {data ? (
                    <div className="flex-end flex w-full flex-row flex-wrap items-end leading-none">
                        <div className="mr-2 flex flex-row items-end gap-2">
                            <div className="">
                                <div className="text-4xl font-bold text-gray-300">
                                    {bid}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold uppercase text-red-300">
                                    {spread}
                                </span>
                                <span className="text-xs font-bold text-gray-400">
                                    {ask}
                                </span>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex h-full w-full p-2">
                        <LoadingSkeleton width="50" height="50" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default Stream;
