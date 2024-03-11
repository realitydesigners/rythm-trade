import Link from "next/link";
import React from "react";
import Stream from "./Stream";

interface StreamLinkCardProps {
	pair: string;
	streamData: any;
}

const StreamCard: React.FC<StreamLinkCardProps> = ({ pair, streamData }) => {
	return (
		<div className="flex items-center justify-between">
			<div className="p-2">
				<Stream pair={pair} data={streamData[pair]} />
			</div>
			<Link
				href={`/pairs/${pair}`}
				className="relative flex h-10 w-10 items-center justify-center overflow-hidden rounded-[1em] rounded-lg bg-gray-600/25 transition-transform hover:scale-105 hover:brightness-110"
			>
				<div className="absolute inset-0 bg-gray-600/25 opacity-0 transition-opacity hover:opacity-100" />
				{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
				<svg
					className="h-4 w-4 scale-x-[-1] transform text-gray-200/75 transition-transform duration-300 ease-in-out"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
				>
					<path
						fillRule="evenodd"
						d="M10.707 2.293a1 1 0 010 1.414L4.414 10l6.293 6.293a1 1 0 11-1.414 1.414l-7-7a1 1 0 010-1.414l7-7a1 1 0 011.414 0z"
						clipRule="evenodd"
					/>
				</svg>
			</Link>
		</div>
	);
};

export default StreamCard;
