"use client";
import React, { useCallback, useEffect } from "react";
import { SignIn, useUser } from "@clerk/nextjs";

export default function Page() {
	const { user } = useUser();

	const handleSignIn = useCallback(async () => {
		const serverBaseUrl = process.env.NEXT_PUBLIC_SERVER_URL;
		console.log("sign in");
		if (!user) return;

		try {
			const response = await fetch(`${serverBaseUrl}/user/${user.id}`);
			if (!response.ok) {
				throw new Error("Failed to verify user");
			}
			const userData = await response.json();
			if (userData) {
				console.log("User verified:", userData);
			} else {
				console.log("User not found in the database");
			}
		} catch (error) {
			console.error("Error:", error);
		}
	}, [user]);

	useEffect(() => {
		if (user) {
			handleSignIn();
		}
	}, [user, handleSignIn]);

	return <SignIn />;
}
