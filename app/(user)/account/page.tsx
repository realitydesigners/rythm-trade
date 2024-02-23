import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import AccountForm from "./AccountForm";

export default async function AccountPage() {
	const user = await currentUser();

	if (!user)
		return (
			<div className="flex h-screen items-center justify-center bg-gray-900 text-white">
				<p className="text-xl">Not logged in</p>
			</div>
		);

	return (
		<div className="flex h-screen items-center justify-center  p-4">
			<div className="w-full max-w-2xl overflow-hidden rounded-lg border border-gray-600/50 shadow-xl">
				<div className="bg-black p-8 text-center text-white">
					{user?.imageUrl && (
						<Image
							src={user.imageUrl}
							alt="Profile"
							width="100"
							height="100"
							className=" mx-auto mb-6 rounded-full border object-cover"
						/>
					)}
					<h1 className="mb-4 text-4xl font-bold">
						Welcome, {user?.firstName}!
					</h1>
				</div>

				<AccountForm />
			</div>
		</div>
	);
}
