"use client";
import React, { useState, useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { fetchOandaCredentials, updateOandaCredentials } from "@/app/api/rest";

export default function AccountForm() {
	const { user } = useUser();
	const [accountId, setAccountId] = useState("");
	const [apiKey, setApiKey] = useState("");
	const [existingCredentials, setExistingCredentials] = useState({
		apiKey: "",
		accountId: "",
	});

	useEffect(() => {
		if (user) {
			fetchOandaCredentials(user.id)
				.then((credentials) => {
					setExistingCredentials({
						apiKey: credentials.apiKey,
						accountId: credentials.accountId,
					});
				})
				.catch((error) => console.error("Error fetching credentials:", error));
		}
	}, [user]);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		if (!user) {
			console.error("User not found");
			return;
		}
		try {
			const response = await updateOandaCredentials(user.id, apiKey, accountId);
			console.log("Credentials updated:", response);
		} catch (error) {
			console.error("Error updating credentials:", error);
		}
	};

	return (
		<div className="flex justify-center items-center w-full">
			<div className="w-full max-w-xl bg-black rounded-lg shadow-md p-6 mt-6">
				<div className="mb-4">
					<h2 className="font-mono text-lg text-white mb-2">
						Oanda Credentials
					</h2>
					{existingCredentials.apiKey && (
						<p className="text-gray-400">
							Current API Key: ****{existingCredentials.apiKey}
						</p>
					)}
					{existingCredentials.accountId && (
						<p className="text-gray-400 mb-4">
							Account ID: {existingCredentials.accountId}
						</p>
					)}
				</div>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label
							htmlFor="accountId"
							className="block font-mono text-gray-600 text-sm font-bold mb-2"
						>
							New Account ID
						</label>
						<input
							id="accountId"
							name="accountId"
							type="text"
							value={accountId}
							onChange={(e) => setAccountId(e.target.value)}
							placeholder="Enter new Account ID"
							className="font-mono shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						/>
					</div>
					<div className="mb-6">
						<label
							htmlFor="apiKey"
							className="block font-mono text-gray-600 text-sm font-bold mb-2"
						>
							New API Key
						</label>
						<input
							id="apiKey"
							name="apiKey"
							type="text"
							value={apiKey}
							onChange={(e) => setApiKey(e.target.value)}
							placeholder="Enter new API Key"
							className="font-mono shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
						/>
					</div>
					<button
						type="submit"
						className="w-full font-mono bg-white hover:bg-gray-200/50 text-black font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
					>
						Update Credentials
					</button>
				</form>
			</div>
		</div>
	);
}
