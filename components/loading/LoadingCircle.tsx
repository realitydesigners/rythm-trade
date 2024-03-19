import React from "react";

interface LoadingCircleProps {
	width?: string;
	height?: string;
	className?: string;
}

const LoadingCirle: React.FC<LoadingCircleProps> = ({
	width = "100",
	height = "100",
	className = "",
}) => {
	return (
		<div
			className={`flex h-auto w-auto items-center justify-center bg-black ${className}`}
		>
			<div className="flex h-auto w-full animate-pulse justify-center p-2">
				{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
				<svg
					width={width}
					height={height}
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
		</div>
	);
};

export default LoadingCirle;
