"use client";
import { fetchOandaCredentials, updateOandaCredentials } from "@/app/api/rest";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { useUser } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";

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
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Edit Your Credentials</SheetTitle>
                        <SheetDescription>
                            Update your Oanda account credentials here. Click
                            save when you're done.
                        </SheetDescription>
                    </SheetHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 p-8">
                        <h2 className="text-xl font-semibold">
                            Oanda Credentials
                        </h2>
                        {existingCredentials.apiKey && (
                            <p className="mt-4">
                                <span className="font-semibold">
                                    Current API Key:
                                </span>{" "}
                                {existingCredentials.apiKey}
                            </p>
                        )}
                        {existingCredentials.accountId && (
                            <p>
                                <span className="font-semibold">
                                    Account ID:
                                </span>{" "}
                                {existingCredentials.accountId}
                            </p>
                        )}
                        <Input
                            id="accountId"
                            name="accountId"
                            type="text"
                            value={accountId}
                            onChange={(e) => setAccountId(e.target.value)}
                            placeholder="Your Oanda Account ID"
                        />
                        <Input
                            id="apiKey"
                            name="apiKey"
                            type="text"
                            value={apiKey}
                            onChange={(e) => setApiKey(e.target.value)}
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
                </SheetContent>
            </Sheet>
        </>
    );
}
