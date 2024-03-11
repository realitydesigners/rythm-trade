import { PositionData } from "@/types";
import React from "react";

interface MasterPositionProps {
	positionData: PositionData[];
}

function MasterPosition({ positionData }: MasterPositionProps) {
	if (!Array.isArray(positionData) || positionData.length === 0) {
		return <div className="text-white">No position data available.</div>;
	}
	return (
		<div className="w-full overflow-x-auto  rounded-lg border border-gray-600/50 shadow-2xl ">
			<table className="min-w-full table-auto border-collapse bg-black shadow-lg">
				<thead className="border-b border-gray-600/50">
					<tr>
						<th className="px-4 py-4 text-left font-mono text-xs font-bold uppercase tracking-wider text-gray-300">
							ID
						</th>
						<th className="px-4 py-4 text-left font-mono text-xs font-bold uppercase tracking-wider text-gray-300">
							Pair
						</th>
						<th className="px-4 py-4 text-left font-mono text-xs font-bold uppercase tracking-wider text-gray-300">
							Position
						</th>
						<th className="px-4 py-4 text-right font-mono text-xs font-bold uppercase tracking-wider text-gray-300">
							Units
						</th>
						<th className="px-4 py-4 text-right font-mono text-xs font-bold uppercase tracking-wider text-gray-300">
							Price
						</th>
						<th className="px-4 py-4 text-right font-mono text-xs font-bold uppercase tracking-wider text-gray-300">
							P&L
						</th>
					</tr>
				</thead>
				<tbody className="font-mono text-xs">
					{positionData.map((position, index) => (
						<tr
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							key={index}
							className={`${
								index % 2 === 0 ? "bg-black" : "bg-black"
							} text-gray-200 hover:bg-gray-600/50`}
						>
							<td className="border-b border-gray-600/50 px-4 py-2 text-left">
								{position.long.units !== "0"
									? position.long.tradeIDs?.join(", ") ?? "N/A"
									: position.short.units !== "0"
									  ? position.short.tradeIDs?.join(", ") ?? "N/A"
									  : "N/A"}
							</td>
							<td className="border-b border-gray-600/50 px-4 py-2 text-left">
								{position.instrument}
							</td>
							<td className="border-b border-gray-600/50 px-4 py-2 text-left">
								{position.long.units !== "0"
									? "Long"
									: position.short.units !== "0"
									  ? "Short"
									  : "N/A"}
							</td>
							<td className="border-b border-gray-600/50 px-4 py-2 text-right">
								{position.long.units !== "0"
									? position.long.units
									: position.short.units !== "0"
									  ? position.short.units
									  : "N/A"}
							</td>
							<td className="border-b border-gray-600/50 px-4 py-2 text-right">
								{position.long.units !== "0"
									? position.long.averagePrice
									: position.short.units !== "0"
									  ? position.short.averagePrice
									  : "N/A"}
							</td>
							<td className="border-b border-gray-600/50 px-4 py-2 text-right">
								{position.unrealizedPL}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default MasterPosition;
