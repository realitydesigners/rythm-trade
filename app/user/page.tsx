"use client";
import { useWebSocket } from "@/components/context/WebSocketContext";
import useFavorites from "@/components/hooks/useFavorites";
import { Container, Text } from "@/components/ui-ux/index";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import SolarSystem from "./SolarSystem";

const UserPage = () => {
    const { user } = useUser();
    const { streamData } = useWebSocket();
    const { favoritePairs } = useFavorites(user);

    return (
        <div className="flex h-screen min-h-screen w-full flex-wrap bg-black ">
            <SolarSystem favoritePairs={favoritePairs} />
        </div>
    );
};

export default UserPage;
