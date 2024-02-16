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
		<div className="w-full justify-center flex">
			<div className="w-full ">
				<div>
					<span className="text-lg font-bold text-gray-200 ">{pair}</span>:
					{data ? (
						<div className="flex-row flex flex-wrap leading-none ">
							<div className="mr-2 flex flex-row py-1">
								<div className="text-teal-400 uppercase font-bold pr-1">
									Bid:
								</div>
								<div className="text-gray-400">{bid}</div>
							</div>
							<div className="mr-2 flex flex-row py-1">
								<div className="text-red-400 uppercase font-bold pr-1">
									Ask:
								</div>
								<div className="text-gray-400">{ask}</div>
							</div>
						</div>
					) : (
						<div className="w-full h-full flex p-2">
							{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
							<svg
								width="15"
								height="15"
								viewBox="0 0 50 50"
								xmlns="http://www.w3.org/2000/svg"
							>
								<circle
									cx="25"
									cy="25"
									r="20"
									stroke="#333"
									strokeWidth="5"
									fill="none"
									strokeDasharray="31.415, 31.415"
									strokeDashoffset="0"
								>
									<animateTransform
										attributeName="transform"
										type="rotate"
										from="0 25 25"
										to="360 25 25"
										dur="1s"
										repeatCount="indefinite"
									/>
								</circle>
							</svg>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default Stream;
