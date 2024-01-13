"use client";
"use client";
import { fetchOandaCredentials, updateOandaCredentials } from "@/app/api/rest";
import { jura, monomaniac } from "@/app/fonts";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";

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
		<div
			className={`${monomaniac.className} flex justify-center items-center w-full`}
		>
			<div
				className={`w-full max-w-xl bg-black rounded-lg shadow-md p-6 mt-6 ${monomaniac.className}`}
			>
				<div className="mb-4">
					<h2 className={`${monomaniac.className} text-lg text-white mb-2`}>
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
							className={`${monomaniac.className} block text-gray-600 text-sm font-bold mb-2`}
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
							className={`${monomaniac.className} shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
						/>
					</div>
					<div className="mb-6">
						<label
							htmlFor="apiKey"
							className={`${monomaniac.className} block text-gray-600 text-sm font-bold mb-2`}
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
							className={`${monomaniac.className} shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline`}
						/>
					</div>
					<button
						type="submit"
						className={`${monomaniac.className} w-full text-xl uppercase inline-block bg-black hover:bg-gray-200 hover:text-black text-white font-bold py-4 px-8 border border-gray-600/50 rounded-lg transition duration-300 transform hover:scale-105`}
					>
						Update Credentials
					</button>
				</form>
			</div>
		</div>
	);
}
