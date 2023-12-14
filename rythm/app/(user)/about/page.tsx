"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import Secure from "@/public/icons/secure.svg";
import Scale from "@/public/icons/scale.svg";
import Repeat from "@/public/icons/repeat.svg";
import Quant from "@/public/icons/quant.svg";
import Prop from "@/public/icons/prop.svg";
import Newsletter from "@/app/components/email/Newsletter";
import { staatliches, inter, jura } from "@/app/fonts";

const featureData = [
	{
		icon: Secure,
		title: "Secure",
		description:
			"Our robust security features protect your data and maintain privacy.",
	},
	{
		icon: Scale,
		title: "Scalable",
		description:
			"Our infrastructure is designed to scale regardless of volume.",
	},
	{
		icon: Repeat,
		title: "Repeatable",
		description:
			"Rely on our algorithms for consistent and repeatable success.",
	},
	{
		icon: Prop,
		title: "Automated",
		description: "Benefit from our proprietary technology that trades for you.",
	},
	{
		icon: Quant,
		title: "Quantitative",
		description: "Access quantitative analytics for data-driven decisions.",
	},
];

const AboutPage = () => {
	return (
		<>
			<div className="flex flex-col justify-center items-center w-full min-h-screen p-6 text-center">
				<h1
					className={`${staatliches.className}  text-white text-5xl lg:text-6xl font-bold mb-8`}
				>
					Welcome to Rythm
				</h1>
				<p
					className={`${jura.className}  text-gray-300 text-lg max-w-2xl mx-auto`}
				>
					Rythm is a cutting-edge trading algorithm designed to revolutionize
					the way you interact with the financial markets. Using
					state-of-the-art technology, Rythm analyzes market patterns to help
					make informed decisions that propel you towards a profitable future.
				</p>
			</div>
			<div className="w-full flex justify-center h-auto pb-20">
				<Newsletter />
			</div>

			<section className="bg-black pt-20 pb-40 px-4 lg:px-20">
				<div className="container mx-auto">
					<h2
						className={`${staatliches.className} text-center text-gray-200 uppercase font-bold text-4xl lg:text-6xl mb-20`}
					>
						A New Kind Of
						<br /> Trading Algorithm
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
						{featureData.map((feature, index) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={index}
								className="p-4 rounded-lg shadow-lg space-y-4 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl "
							>
								<div className="h-24 w-24 rounded-full mx-auto transition duration-500 ease-in-out transform hover:scale-110">
									<Image
										src={feature.icon}
										width={80}
										height={80}
										alt={feature.title}
									/>
								</div>
								<h3
									className={`${staatliches.className} text-gray-200 text-center uppercase font-bold text-2xl`}
								>
									{feature.title}
								</h3>
								<p className={`${jura.className} text-gray-400 text-center`}>
									{feature.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>
		</>
	);
};

export default AboutPage;
