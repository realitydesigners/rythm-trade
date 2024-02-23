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
			className={`${monomaniac.className} flex w-full items-center justify-center`}
		>
			<div
				className={`mt-6 w-full max-w-xl rounded-lg bg-black p-6 shadow-md ${monomaniac.className}`}
			>
				<div className="mb-4">
					<h2 className={`${monomaniac.className} mb-2 text-lg text-white`}>
						Oanda Credentials
					</h2>
					{existingCredentials.apiKey && (
						<p className="text-gray-400">
							Current API Key: ****{existingCredentials.apiKey}
						</p>
					)}
					{existingCredentials.accountId && (
						<p className="mb-4 text-gray-400">
							Account ID: {existingCredentials.accountId}
						</p>
					)}
				</div>
				<form onSubmit={handleSubmit}>
					<div className="mb-4">
						<label
							htmlFor="accountId"
							className={`${monomaniac.className} mb-2 block text-sm font-bold text-gray-600`}
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
							className={`${monomaniac.className} focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none`}
						/>
					</div>
					<div className="mb-6">
						<label
							htmlFor="apiKey"
							className={`${monomaniac.className} mb-2 block text-sm font-bold text-gray-600`}
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
							className={`${monomaniac.className} focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none`}
						/>
					</div>
					<button
						type="submit"
						className={`${monomaniac.className} inline-block w-full transform rounded-lg border border-gray-600/50 bg-black px-8 py-4 text-xl font-bold uppercase text-white transition duration-300 hover:scale-105 hover:bg-gray-200 hover:text-black`}
					>
						Update Credentials
					</button>
				</form>
			</div>
		</div>
	);
}
