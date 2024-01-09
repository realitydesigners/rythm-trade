"use client";
import { CandleData } from "@/types";
import React, { Context, useContext, useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { fetchCandles } from "../api/rest";

interface DataTableProps {
	pair: string;
}

function DataTable({ pair }: DataTableProps) {
	const [data, setData] = useState<CandleData[]>([]);
	const [loading, setLoading] = useState(true);
	const { user } = useUser();

	useEffect(() => {
		const getData = async () => {
			if (user && user.id) {
				try {
					const candles = await fetchCandles(user.id, pair, 300, "M1");
					setData(candles || []);
					setLoading(false);
				} catch (error) {
					console.error("Error fetching data for pair", pair, error);
					setLoading(false);
				}
			}
		};

		getData();
	}, [user, pair]);

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
