"use client";
import LoadingSkeleton from "@/components/loading/LoadingSkeleton";
import { StreamData } from "@/types";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import ResoBox from "./ResoBox";
import useFetchBoxes from "./hooks/useFetchBoxes";

interface ResoModelProps {
    pair: string;
    streamData: StreamData | null;
    selectedBoxArrayType: string;
}

const ResoModel: React.FC<ResoModelProps> = ({
    pair,
    streamData,
    selectedBoxArrayType,
}) => {
    const { user } = useUser();

    const { boxArrays, initializationComplete } = useFetchBoxes(
        user ?? undefined,
        pair,
        selectedBoxArrayType,
    );

    const [currentClosePrice, setCurrentClosePrice] = useState<number | null>(
        null,
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

    if (!initializationComplete) {
        return (
            <div className="flex h-full w-full items-center  justify-center">
                <LoadingSkeleton width="50" height="50" />
            </div>
        );
    }

    return (
        <div className="flex h-auto w-auto  flex-col font-bold">
            <ResoBox boxArrays={boxArrays} />
        </div>
    );
};

export default ResoModel;
