"use client";
import { fetchOandaCredentials, updateOandaCredentials } from "@/app/api/rest";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { toast } from "sonner";

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
                .catch((error) =>
                    console.error("Error fetching credentials:", error),
                );
        }
    }, [user]);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!user) {
            console.error("User not found");
            return;
        }
        if (
            accountId === existingCredentials.accountId &&
            apiKey === existingCredentials.apiKey
        ) {
            console.log(
                "No changes to save, the provided credentials are the same as the existing ones.",
            );
            return;
        }
        try {
            const response = await updateOandaCredentials(
                user.id,
                apiKey,
                accountId,
            );
            toast.success("Credentials updated successfully");
            console.log("Credentials updated:", response);
        } catch (error) {
            console.error("Error updating credentials:", error);
        }
    };

    return (
        <>
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="default">Edit Oanda Credentials</Button>
                </SheetTrigger>
                <SheetContent className="p-8">
                    <div className="text-center">
                        <h1 className="text-3xl font-semibold text-gray-900">
                            Edit Your Credentials
                        </h1>
                        <p className="mt-2 text-sm text-gray-600">
                            Update your Oanda account credentials here. Click
                            save when you're done.
                        </p>
                    </div>

                    <div className="mt-8">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Oanda Credentials
                        </h2>
                        <div className="mb-6">
                            {existingCredentials.apiKey && (
                                <p className="mt-4">
                                    <span className="font-semibold">
                                        Current API Key:
                                    </span>
                                    <span className="ml-2 text-gray-700">
                                        {existingCredentials.apiKey}
                                    </span>
                                </p>
                            )}
                            {existingCredentials.accountId && (
                                <p className="mt-4">
                                    <span className="font-semibold">
                                        Account ID:
                                    </span>
                                    <span className="ml-2 text-gray-700">
                                        {existingCredentials.accountId}
                                    </span>
                                </p>
                            )}
                        </div>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <Input
                                id="accountId"
                                name="accountId"
                                type="text"
                                value={accountId}
                                onChange={(e) => setAccountId(e.target.value)}
                                className="w-full"
                                placeholder="Your Oanda Account ID"
                            />
                            <Input
                                id="apiKey"
                                name="apiKey"
                                type="text"
                                value={apiKey}
                                onChange={(e) => setApiKey(e.target.value)}
                                className="w-full"
                                placeholder="Your Oanda API Key"
                            />
                            <SheetFooter>
                                <SheetClose asChild>
                                    <Button variant="secondary" type="submit">
                                        Save changes
                                    </Button>
                                </SheetClose>
                            </SheetFooter>
                        </form>
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
}
