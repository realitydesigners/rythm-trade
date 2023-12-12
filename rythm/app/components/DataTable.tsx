"use client";
import React, { useEffect, useState, useContext } from "react";
import { OandaApiContext } from "../api/OandaApi";
import { CandleData } from "@/types";

interface DataTableProps {
	pair: string;
}

function DataTable({ pair }: DataTableProps) {
	const [data, setData] = useState<CandleData[]>([]);
	const [loading, setLoading] = useState(true);
	const api = useContext(OandaApiContext);

	useEffect(() => {
		const getData = async () => {
			try {
				const candles = await api?.fetchCandles(pair, 300, "M1");
				setData(candles || []);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching data for pair", pair, error);
				setLoading(false);
			}
		};

		getData();
	}, [api, pair]);

	return (
		<div className="overflow-auto">
			<table className="min-w-full table-auto">
				<thead className="bg-gray-200">
					<tr>
						<th className="px-4 py-2">Time</th>
						<th className="px-4 py-2">Open</th>
						<th className="px-4 py-2">Close</th>
						<th className="px-4 py-2">High</th>
						<th className="px-4 py-2">Low</th>
					</tr>
				</thead>
				<tbody>
					{loading ? (
						<tr>
							<td colSpan={5} className="text-center px-4 py-2">
								Loading...
							</td>
						</tr>
					) : (
						data.map((candle, index) => (
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							<tr key={index}>
								<td className="px-4 py-2">
									{new Date(candle.time).toLocaleString()}
								</td>
								<td className="px-4 py-2">{candle.mid.o}</td>
								<td className="px-4 py-2">{candle.mid.c}</td>
								<td className="px-4 py-2">{candle.mid.h}</td>
								<td className="px-4 py-2">{candle.mid.l}</td>
							</tr>
						))
					)}
				</tbody>
			</table>
		</div>
	);
}

export default DataTable;
