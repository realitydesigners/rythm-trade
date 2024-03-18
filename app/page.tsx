"use client";
import Newsletter from "@/app/api/send/Newsletter";
import { saira, space } from "@/app/fonts";
import Prop from "@/public/icons/prop.svg";
import Quant from "@/public/icons/quant.svg";
import Repeat from "@/public/icons/repeat.svg";
import Scale from "@/public/icons/scale.svg";
import Secure from "@/public/icons/secure.svg";
import Image from "next/image";
import Link from "next/link";
import React from "react";

import Spline from "@splinetool/react-spline";

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

const AppPage = () => {
	return (
		<>
			{/* Hero */}
			<section className=" h-[90vh] w-full overflow-hidden bg-black lg:h-screen lg:h-screen">
				<div className="relative flex h-full w-full items-center justify-center">
					<Spline
						scene="https://prod.spline.design/xSKIvrYdS-sBwPhA/scene.splinecode"
						className="absolute z-0 h-full w-full"
					/>
					<div className="absolute bottom-2 flex w-full flex-wrap items-center  justify-center lg:bottom-32  lg:items-start   ">
						<p className="w-full py-4 text-center text-xs tracking-wide text-gray-400 shadow-lg">
							Want an early accesss preview? Send us an email.
						</p>
						<div className="flex flex-col gap-2  md:flex-row">
							<Link
								href="#"
								className="inline-block transform items-center justify-center rounded-lg border border-gray-700/75 bg-black/50 px-6 py-4 text-xl font-bold uppercase text-gray-200 transition-all duration-200  ease-in-out hover:-translate-y-1 hover:bg-black"
							>
								Join Beta v1.0
							</Link>
							<Link
								href="#"
								className="inline-block transform items-center justify-center rounded-lg border border-gray-700/75 bg-black/50 px-6 py-4 text-xl font-bold uppercase text-gray-200 transition-all duration-200  ease-in-out hover:-translate-y-1 hover:bg-black"
							>
								Learn More
							</Link>
						</div>
					</div>
				</div>
			</section>

			<section className="bg-black py-12 pt-20 lg:px-20 ">
				<div className="w-full px-4 md:px-20 ">
					<h2
						className={`${saira.className} bg-gradient-to-r from-purple-200 via-purple-100 to-indigo-200 bg-clip-text py-20 text-center text-4xl uppercase leading-[.8em] text-transparent  lg:text-6xl lg:leading-[.8em] `}
					>
						A New Kind Of
						<br /> Trading Algorithm
					</h2>

					<div className="grid grid-cols-2   gap-2 lg:grid-cols-3 lg:gap-8 ">
						{featureData.map((feature, index) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={index}
								className="transform space-y-4 rounded-lg p-4 transition duration-500 ease-in-out hover:-translate-y-1  "
							>
								<div className="mx-auto h-24 w-24 transform rounded-full transition duration-500 ease-in-out hover:scale-110">
									<Image
										src={feature.icon}
										width={80}
										height={80}
										alt={feature.title}
									/>
								</div>
								<h3
									className={`${space.className} bg-gradient-to-r from-purple-200 via-purple-100 to-indigo-200 bg-clip-text text-center text-2xl font-bold uppercase text-transparent`}
								>
									{feature.title}
								</h3>
								<p
									className={`${space.className} text-md  bg-gradient-to-r from-purple-200/75 via-purple-100/75 to-indigo-200/75 bg-clip-text text-transparent`}
								>
									{feature.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="bg-black px-4 py-12 pt-20 lg:px-20">
				<div className="flex w-full flex-col items-center justify-center p-6 text-center">
					<h2
						className={`${space.className} mb-8 w-full bg-gradient-to-r from-purple-200 via-purple-100 to-indigo-200 bg-clip-text text-center text-5xl font-bold uppercase uppercase text-transparent lg:w-1/2 lg:text-6xl`}
					>
						a geometrical pattern recognition tool from the future!
					</h2>
					<p className=" mx-auto max-w-2xl bg-gradient-to-r from-purple-200/75 via-purple-100/75 to-indigo-200/75 bg-clip-text text-lg text-transparent">
						Rythm was born from the idea that the financial markets are a series
						of repeating patterns that can be identified and quantified. Our
						proprietary algorithms are designed to identify and trade these
						patterns with high precision and accuracy.
					</p>
				</div>
			</section>
			<section className="flex w-full flex-col flex-wrap justify-center gap-12 p-4 pb-12 lg:flex-row lg:pl-12 lg:pr-12">
				<h3
					className={` ${space.className} w-full  bg-gradient-to-r from-purple-200  via-purple-100 to-indigo-200 bg-clip-text p-4 text-center text-center text-3xl uppercase text-transparent`}
				>
					Development Team
				</h3>
				<div className="flex w-full  flex-row  items-center p-4 lg:w-1/3 ">
					<div className="h-[333px] w-1/2">
						<Spline scene="https://prod.spline.design/enLBj2rztquUGmgp/scene.splinecode" />
					</div>

					<div className="flex w-1/2 flex-col items-start p-2">
						<p
							className={` ${space.className} bg-gradient-to-r from-purple-200 via-purple-100 to-indigo-200 bg-clip-text text-center text-xl uppercase tracking-wide text-transparent`}
						>
							Raymond
						</p>
						<p
							className={` ${space.className} bg-gradient-to-r  from-purple-200/75 via-purple-100/75 to-indigo-200/75 bg-clip-text py-2 text-sm uppercase tracking-widest text-transparent	`}
						>
							Co-Founder
						</p>
						<p
							className={` ${space.className} } bg-gradient-to-r  from-purple-200/75 via-purple-100/75 to-indigo-200/75 bg-clip-text pb-4 text-xs text-transparent`}
						>
							Raymond is a designer and developer currently located in Mountain
							View, CA. He has been brainstorming and developing the Rythm
							trading system and philospophy since 2019.
						</p>
						<p
							className={`${space.className}   bg-gradient-to-r from-purple-200/75 via-purple-100/75 to-indigo-200/75 bg-clip-text text-center text-xs text-transparent underline `}
						>
							raymond@rythm.capital
						</p>
					</div>
				</div>
				<div className="flex w-full flex-row  items-center p-4 lg:w-1/3">
					<div className="h-[333px] w-1/2">
						<Spline scene="https://prod.spline.design/SBXn5bUCrycaaZrE/scene.splinecode" />
					</div>

					<div className="flex w-1/2 flex-col items-start p-2">
						<p
							className={` ${space.className} bg-gradient-to-r from-purple-200 via-purple-100 to-indigo-200 bg-clip-text text-center text-xl uppercase tracking-wide text-transparent`}
						>
							Mitch
						</p>
						<p
							className={` ${space.className} bg-gradient-to-r  from-purple-200/75 via-purple-100/75 to-indigo-200/75 bg-clip-text py-2 text-sm uppercase tracking-widest text-transparent	`}
						>
							Co-Founder
						</p>
						<p className={` ${space.className} } pb-4 text-xs text-gray-400`}>
							Mitch is a fullstack developer currently located in North PA, and
							has extensive experience in quantiative financial modeling and has
							been building trading algorithms for several years.
						</p>

						<p
							className={`${space.className}  text-center  text-xs text-gray-400 underline `}
						>
							mitch@rythm.capital
						</p>
					</div>
				</div>
			</section>
			<div className="flex h-auto w-full justify-center py-20">
				<Newsletter />
			</div>
		</>
	);
};

export default AppPage;
