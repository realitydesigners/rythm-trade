import { Metadata } from "next";

export const metadata: Metadata = {
    title: "RYTHM - Dashboard",
    description:
        "A geometrical trading model inspired by fractal mathematics and multi-dimensional time series.",
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-black">
            {children}
        </div>
    );
}
