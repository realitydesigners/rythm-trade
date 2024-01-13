export default function LoadingSkeleton() {
	return (
		<div className="w-full bg-black h-screen z-[1000] flex justify-center items-center">
			<div className="w-full p-2 h-auto flex justify-center">
				{/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
				<svg
					width="100"
					height="100"
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
}
