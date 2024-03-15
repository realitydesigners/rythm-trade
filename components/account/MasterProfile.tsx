"use client";
import LoadingSkeleton from "@/components/loading/LoadingSkeleton";
import { Label } from "@/components/ui/label";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";

const MasterProfile: React.FC = () => {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	const [accountSummary, setAccountSummary] = useState<any>(null);
	const { user } = useUser();

	useEffect(() => {
		const fetchAccountSummary = async () => {
			if (user) {
				const serverBaseUrl = process.env.NEXT_PUBLIC_SERVER_URL;
				try {
					const response = await fetch(
						`${serverBaseUrl}/account/summary/${user.id}`,
					);
					if (!response.ok) {
						throw new Error("Failed to fetch account summary");
					}
					const summary = await response.json();
					setAccountSummary(summary);
				} catch (error) {
					console.error("Error fetching account summary:", error);
				}
			}
		};

		fetchAccountSummary();
	}, [user]);

	return (
		<div>
			{accountSummary ? (
				<div>
					<h2 className="title mb-4 font-mono font-bold uppercase text-gray-200">
						Account Summary
					</h2>
					<div className="flex flex-col flex-wrap gap-2">
						<Label>
							ID: <span>{accountSummary.id}</span>
						</Label>
						<Label>
							Balance: <span>{accountSummary.balance}</span>
						</Label>
						<Label>
							Currency: <span>{accountSummary.currency}</span>
						</Label>
						<Label>
							Unrealized Profit: <span>{accountSummary.unrealizedPL}</span>
						</Label>
						<Label>
							NAV: <span>{accountSummary.NAV}</span>
						</Label>
						<Label>
							Financing: <span>{accountSummary.financing}</span>
						</Label>
						<Label>
							Margin Available: <span>{accountSummary.marginAvailable}</span>
						</Label>
						<Label>
							Margin Closeout Percent:{" "}
							<span>{accountSummary.marginCloseoutPercent}</span>
						</Label>
						<Label>
							Open Position Count:{" "}
							<span>{accountSummary.openPositionCount}</span>
						</Label>
						<Label>
							Open Trade Count: <span>{accountSummary.openTradeCount}</span>
						</Label>
						<Label>
							PL (Profit/Loss): <span>{accountSummary.pl}</span>
						</Label>
					</div>
				</div>
			) : (
				<div className="flex h-full w-full items-center justify-center">
					<LoadingSkeleton width="50" height="50" />
				</div>
			)}
		</div>
	);
};

export default MasterProfile;
