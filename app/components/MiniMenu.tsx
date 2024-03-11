"use client";

import { MasterProfile } from "@/app/components/index";
import {
    Button,
    Dialog,
    DialogContent,
    DialogTrigger,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/app/components/ui/index";

import React, { useEffect, useState } from "react";

const MiniMenu = ({
    toggleProfile,
    addToFavorites,
    currencyPairs,
    favoritePairs,
}: {
    toggleProfile: () => void;
    addToFavorites: (pair: string) => void;
    currencyPairs: string[];
    favoritePairs: string[];
}) => (
    <div className="mb-4 flex w-full flex-wrap gap-2">
        <Dialog>
            <DialogTrigger asChild>
                <Button onClick={toggleProfile}>Account Summary</Button>
            </DialogTrigger>
            <DialogContent>
                <MasterProfile />
            </DialogContent>
        </Dialog>
        <Select
            onValueChange={(pairToAdd) => addToFavorites(pairToAdd)}
            value=""
        >
            <SelectTrigger>
                <p className="w-full p-2 text-left text-xs text-gray-200">
                    Add Pair
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
        </Select>
    </div>
);
export default MiniMenu;
