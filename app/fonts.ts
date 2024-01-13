import {
	Inter,
	Jura,
	Monomaniac_One,
	Play,
	Roboto,
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

export const inter = Inter({
	subsets: ["latin"],
	display: "swap",
});

export const jura = Jura({
	weight: ["400", "600", "700"],
	subsets: ["latin"],
	display: "swap",
});

export const play = Play({
	weight: ["400", "700"],
	subsets: ["latin"],
	display: "swap",
});
export const monomaniac = Monomaniac_One({
	weight: ["400"],
	subsets: ["latin"],
	display: "swap",
});
