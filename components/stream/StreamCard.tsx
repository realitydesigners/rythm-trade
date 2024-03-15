import { StreamLink } from "@/components/index";
import Link from "next/link";
import React from "react";
import Stream from "./Stream";

interface StreamLinkCardProps {
	pair: string;
	streamData: any;
}

const StreamCard: React.FC<StreamLinkCardProps> = ({ pair, streamData }) => {
	return (
		<>
			<div className="flex items-center justify-between">
				<div className="p-2">
					<Stream pair={pair} data={streamData[pair]} />
				</div>
			</div>
		</>
	);
};

export default StreamCard;
