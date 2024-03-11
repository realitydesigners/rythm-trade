import {
	Monomaniac_One,
	Roboto,
	Space_Grotesk,
	Staatliches,
} from "next/font/google";

export const roboto = Roboto({
	weight: ["400", "700"],
	style: ["normal", "italic"],
	subsets: ["latin"],
	display: "swap",
});

export const staatliches = Staatliches({
	weight: "400",
	subsets: ["latin"],
	display: "swap",
});

export const monomaniac = Monomaniac_One({
	weight: ["400"],
	subsets: ["latin"],
	display: "swap",
});
export const space = Space_Grotesk({
	weight: ["400", "600"],
	style: ["normal"],
	subsets: ["latin"],
});
