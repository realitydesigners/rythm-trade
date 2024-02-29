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
			<div className="w-full max-w-xl overflow-hidden rounded-lg border border-gray-600/50 shadow-xl">
				<div className="flex items-center  bg-black p-6 text-center text-white">
					<div className="w-50 pr-6">
						{user?.imageUrl && (
							<Image
								src={user.imageUrl}
								alt="Profile"
								width="100"
								height="100"
								className=" mx-auto mb-6 rounded-full border object-cover"
							/>
						)}
					</div>
					<h1 className="mb-4 text-xl font-bold lg:text-3xl">
						Hey, {user?.firstName}!
					</h1>
				</div>
				<div className="w-full items-center justify-center p-6">
					<AccountForm />
				</div>
			</div>
		</div>
	);
}
