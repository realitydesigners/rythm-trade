import React from "react";

interface LoadingPulseProps {
	width?: number;
	height?: number;
	className?: string;
}

const LoadingPulse: React.FC<LoadingPulseProps> = ({ className = "" }) => {
	return (
		<div className={`bg-gray-600/25 rounded-md animate-pulse  ${className}`} />
	);
};

export default LoadingPulse;
