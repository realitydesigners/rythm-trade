import LoadingPulse from "@/components/loading/LoadingPulse";
import { StreamData } from "@/types";
import { SymbolsToDigits, symbolsToDigits } from "@/utils/constants";
import React from "react";

interface StreamProps {
	pair: string;
	data: StreamData | null;
}

const Stream: React.FC<StreamProps> = ({ pair, data }) => {
	const bid = data?.bids?.[0]?.price;
	const ask = data?.asks?.[0]?.price;

	const spreadInPoints =
		bid !== undefined && ask !== undefined
			? parseFloat(ask) - parseFloat(bid)
			: NaN;

	const currencyPairDetails: SymbolsToDigits[keyof SymbolsToDigits] = pair
		? symbolsToDigits[pair]
		: { point: 0, digits: 0 };
	const pipFactor = 10 ** currencyPairDetails.digits;

	const spread = Number.isNaN(spreadInPoints) ? (
		<LoadingPulse className=" w-[50px] h-[38px] " />
	) : (
		(spreadInPoints * pipFactor).toFixed(1)
	);

	const isLoading = Number.isNaN(spreadInPoints);

	return (
		<div className="flex w-full flex-col">
			<div>
				{isLoading ? (
					<LoadingPulse className="mb-2 w-[100px] h-[23px] " />
				) : (
					<span className="text-xl font-bold text-gray-200">{pair}</span>
				)}
				<div className="flex-end flex w-full flex-row flex-wrap items-end leading-none">
					{isLoading && <LoadingPulse className=" w-[150px] h-[38px] " />}
					<div className="mr-2 flex flex-row items-end gap-2">
						<div className="flex">
							<div className="text-4xl font-bold text-gray-300">{bid}</div>
						</div>
						<div className="flex flex-col">
							<span className="text-xs font-bold uppercase text-red-300">
								{spread}
							</span>
							<span className="text-xs font-bold text-gray-400">{ask}</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Stream;
