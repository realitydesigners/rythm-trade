import {
	Roboto,
	Saira_Stencil_One,
	Sirin_Stencil,
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

export const space = Space_Grotesk({
	weight: ["400", "600"],
	style: ["normal"],
	subsets: ["latin"],
});

export const saira = Saira_Stencil_One({
	weight: ["400"],
	style: ["normal"],
	subsets: ["latin"],
});

export const sirin = Sirin_Stencil({
	weight: ["400"],
	style: ["normal"],
	subsets: ["latin"],
});
