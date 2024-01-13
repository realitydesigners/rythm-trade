import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import AccountForm from "./AccountForm";

export default async function AccountPage() {
	const user = await currentUser();

	if (!user)
		return (
			<div className="flex justify-center items-center h-screen bg-gray-900 text-white">
				<p className="text-xl">Not logged in</p>
			</div>
		);

	return (
		<div className="flex justify-center items-center h-screen  p-4">
			<div className="max-w-2xl w-full rounded-lg shadow-xl border border-gray-600/50 overflow-hidden">
				<div className="p-8 bg-black text-white text-center">
					{user?.imageUrl && (
						<Image
							src={user.imageUrl}
							alt="Profile"
							width="100"
							height="100"
							className=" border rounded-full object-cover mx-auto mb-6"
						/>
					)}
					<h1 className="text-4xl font-bold mb-4">
						Welcome, {user?.firstName}!
					</h1>
				</div>

				<AccountForm />
			</div>
		</div>
	);
}
