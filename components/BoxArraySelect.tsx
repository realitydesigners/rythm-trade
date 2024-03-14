import {
    Button,
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/index";
import { BOX_SIZES } from "@/utils/constants";
import React from "react";
import StreamLink from "./StreamLink";

interface BoxArraySelectProps {
    selectedBoxArrayTypes: { [key: string]: string };
    handleBoxArrayChange: (pair: string, newValue: string) => void;
    pair: string;
    handleReplaceFavorite: (newValue: string, index: number) => void;
    index: number;
    currencyPairs: string[];
    deleteFavoritePair: (pair: string) => void;
}

const BoxArraySelect: React.FC<BoxArraySelectProps> = ({
    selectedBoxArrayTypes,
    handleBoxArrayChange,
    pair,
    handleReplaceFavorite,
    index,
    currencyPairs,
    deleteFavoritePair,
}) => (
    <div className="flex flex-col  items-center justify-center space-x-2">
        <div className="flex py-2">
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
            <Button variant="default" onClick={() => deleteFavoritePair(pair)}>
                Delete
            </Button>
        </div>
        <div className="flex-end flex w-full ">
            <StreamLink pair={pair} />
        </div>
    </div>
);

export default BoxArraySelect;
