"use client";
import { User } from "@/types";
import React, { useEffect, useState } from "react";
import { BoxArrays } from "../../types";
import { fetchBoxArrays } from "../api/rest";

const useFetchBoxes = (
    user: User | undefined,
    pair: string,
    selectedBoxArrayType: string,
) => {
    const [boxArrays, setBoxArrays] = useState<BoxArrays>({});
    const [initializationComplete, setInitializationComplete] = useState(false);

    useEffect(() => {
        // biome-ignore lint/style/useConst: <explanation>
        let intervalId: NodeJS.Timeout;

        const fetchAndSetBoxes = async () => {
            if (user?.id) {
                console.log("Fetching boxes...");
                try {
                    const newBoxArrays = await fetchBoxArrays(
                        user.id,
                        pair,
                        selectedBoxArrayType,
                    );
                    setBoxArrays(newBoxArrays);
                    setInitializationComplete(true);
                } catch (error) {
                    console.error("Error fetching box arrays:", error);
                }
            }
        };

        fetchAndSetBoxes();
        intervalId = setInterval(fetchAndSetBoxes, 60000);

        return () => clearInterval(intervalId);
    }, [user, pair, selectedBoxArrayType]);

    return { boxArrays, initializationComplete };
};

export default useFetchBoxes;
