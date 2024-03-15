"use client";
import { space } from "@/app/fonts";
import React from "react";

const EmailForm = () => {
	const handleSubmit = async (event) => {
		event.preventDefault();
		const email = event.target.email.value;
		const name = event.target.name.value;

		try {
			const response = await fetch("/api/send", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ email, name }),
			});

			const result = await response.json();
			// Handle the response...
		} catch (error) {
			// Handle errors...
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			id="rythmForm"
			className={`${space.className} flex flex-col space-y-4 w-11/12 md:w-1/2 lg:w-1/3`}
		>
			<h2 className="text-4xl uppercase  bg-gradient-to-r text-center from-purple-200 via-purple-100 to-indigo-200 text-transparent bg-clip-text text-center">
				Reach Out
			</h2>

			<input
				type="text"
				name="name"
				id="name"
				required
				placeholder="name"
				className="p-2 bg-gray-200/50 border border-gray-600/50 rounded-md"
			/>

			<input
				type="email"
				name="email"
				id="email"
				required
				placeholder="email"
				className="p-2 bg-gray-20/50 border border-gray-600/50 rounded-md"
			/>

			<button
				type="submit"
				className="border uppercase bg-black tracking-wide bg-black  border-gray-600/50 text-white py-2 px-4 rounded-md hover:bg-black/70 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
			>
				Send
			</button>
		</form>
	);
};

export default EmailForm;
