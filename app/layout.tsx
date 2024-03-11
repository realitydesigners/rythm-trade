import { space } from "@/app/fonts";
import Navbar from "@/components/ui/Navbar";
import { ClerkProvider } from "@clerk/nextjs";
import { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
    title: "RYTHM - High Precision Algorithmic Trading",
    description:
        "A geometrical trading model inspired by fractal mathematics and multi-dimensional time series.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ClerkProvider>
            <html lang="en" className={`${space.className} `}>
                <head>
                    <link rel="icon" href="/favicon.ico" sizes="any" />
                </head>
                <body className="bg-black">
                    <Navbar />
                    {children}
                </body>
            </html>
        </ClerkProvider>
    );
}
