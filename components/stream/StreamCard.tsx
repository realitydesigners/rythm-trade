import LoadingSkeleton from "@/components/loading/LoadingSkeleton";
import { StreamData } from "@/types";
import React from "react";
import Stream from "./Stream";

interface StreamLinkCardProps {
	pair: string;
	streamData: StreamData | null; // Update the type to allow null for streamData
}

const StreamCard: React.FC<StreamLinkCardProps> = ({ pair, streamData }) => {
	return (
		<>
			<div className="flex items-center justify-between">
				<div className="p-2">
					{streamData ? (
						<Stream pair={pair} data={streamData} />
					) : (
						<div className="flex h-full w-full p-2">
							<LoadingSkeleton width="25" height="25" className="w-full h-full bg-gray-200" />
						</div>
					)}
				</div>
			</div>
		</>
	);
};

export default StreamCard;
