"use client";
import { fetchOandaCredentials, updateOandaCredentials } from "@/app/api/rest";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import {
	Sheet,
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/app/components/ui/sheet";
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
	</div>;

	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button variant="default">Edit Oanda Credentials</Button>
			</SheetTrigger>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>Edit Oanda Credentials</SheetTitle>
					<SheetDescription>
						Update your Oanda account credentials here. Click save when you're
						done.
					</SheetDescription>
				</SheetHeader>
				<SheetDescription>
					<div className="py-6">
						<SheetTitle>Edit Oanda Credentials</SheetTitle>
						{existingCredentials.apiKey && (
							<p className="text-gray-400">
								Current API Key: ****
								{existingCredentials.apiKey}
							</p>
						)}
						{existingCredentials.accountId && (
							<p className="mb-4 text-gray-400">
								Account ID: {existingCredentials.accountId}
							</p>
						)}
					</div>
				</SheetDescription>
				<form onSubmit={handleSubmit} className="grid gap-4 p-4">
					<Input
						id="accountId"
						name="accountId"
						type="text"
						value={accountId}
						onChange={(e) => setAccountId(e.target.value)}
						className="col-span-3"
						placeholder="Your Oanda Account ID"
					/>
					<Input
						id="apiKey"
						name="apiKey"
						type="text"
						value={apiKey}
						onChange={(e) => setApiKey(e.target.value)}
						className="col-span-3"
						placeholder="Your Oanda API Key"
					/>
					<SheetFooter>
						<SheetClose asChild>
							<Button type="submit">Save changes</Button>
						</SheetClose>
					</SheetFooter>
				</form>
			</SheetContent>
		</Sheet>
	);
}
