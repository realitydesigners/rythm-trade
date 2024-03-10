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
        <Sheet>
            <SheetTrigger asChild>
                <Button variant="default">Edit Oanda Credentials</Button>
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Edit Oanda Credentials</SheetTitle>
                </SheetHeader>
                <div>
                    Update your Oanda account credentials here. Click save when
                    you're done.
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
                </div>
            </SheetContent>
        </Sheet>
    );
}
