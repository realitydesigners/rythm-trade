import Link from "next/link";
import React from "react";

const StreamLink: React.FC<{ pair: string }> = ({ pair }) => (
    <div className="relative flex items-center space-x-2">
        <Link
            href={`/pairs/${pair}`}
            className="flex h-8 w-16 items-center justify-center rounded-lg bg-gray-700/50 px-2 text-white shadow-md transition-transform hover:scale-105 hover:brightness-110"
        >
            <span className="text-[10px] font-bold uppercase ">Chart</span>
            <div className="absolute inset-0 bg-gray-600/25 opacity-0 transition-opacity group-hover:opacity-100" />
            {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
            <svg
                className="h-4 w-4 -scale-x-100 transform text-gray-200/75 transition-transform duration-300 ease-in-out group-hover:scale-x-100"
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

export default StreamLink;
