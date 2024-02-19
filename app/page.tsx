"use client";
import Newsletter from "@/app/api/send/Newsletter";
import { jura, monomaniac } from "@/app/fonts";
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
			<section className="bg-black w-full h-[90vh] lg:h-screen overflow-hidden">
				<div className="w-full h-full relative flex justify-center items-center">
					<Spline
						scene="https://prod.spline.design/uQqsIlKDLCsRAAK8/scene.splinecode"
						className="absolute w-full h-full z-0"
					/>
					<div className="w-full h-40 bottom-0 absolute bg-gradient-to-t from-black to-transparent" />

					<div className="p-8 flex w-full lg:w-11/12 flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 z-20 ">
						<div className="w-full lg:w-1/2 flex flex-col lg:items-start items-center rounded-lg   ">
							<h1
								className={`${monomaniac.className}  uppercase bg-gradient-to-r from-purple-200 via-purple-100 to-indigo-200 inline-block text-transparent bg-clip-text leading-[.8em] text-6xl lg:leading-[.8em]  lg:text-9xl`}
							>
								TRADING IN
								<br /> ANOTHER
								<br />
								DIMENSION
							</h1>

							<p className="p-2  lg:block bg-gradient-to-r from-purple-200/75 via-purple-100/75 to-indigo-200/75 text-transparent bg-clip-text capitalize text-center lg:text-left font-bold text-md lg:text-lg mt-4">
								The next generation of high frequency trading models.
								<br /> Fully automated. Designed to find fractals.
							</p>
							<div className="py-12 lg:py-6 flex gap-4">
								<Link
									href="#"
									className="text-xl uppercase inline-block bg-gradient-to-r from-purple-400/50 to-blue-400/50 hover:bg-gradient-to-r hover:from-blue-400/75 hover:to-purple-400/75 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 ease-in-out transform hover:-translate-y-1 hover:scale-105 shadow-md hover:shadow-lg"
								>
									Join Beta v1.0
								</Link>

								<Link
									href="#"
									className="text-xl hidden uppercase inline-block bg-gradient-to-bl from-purple-300/20 to-blue-300/20 hover:bg-gradient-to-bl hover:from-purple-400/75 hover:to-blue-400/75 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 ease-in-out transform hover:-translate-y-1 hover:scale-110 shadow-md hover:shadow-xl"
								>
									Pricing
								</Link>
							</div>
						</div>
						<div className="w-full md:w-1/2  hidden lg:flex h-40 lg:h-96 bg-black/0 p-6 rounded-lg " />
					</div>
				</div>
			</section>

			<section className="bg-black pt-20 py-12 lg:px-20 ">
				<div className="w-full px-4 md:px-20 ">
					<h2
						className={`${monomaniac.className} uppercase bg-gradient-to-r text-center from-purple-200 via-purple-100 to-indigo-200 text-transparent bg-clip-text leading-[.8em] text-6xl lg:leading-[.8em]  lg:text-6xl py-20 `}
					>
						A New Kind Of
						<br /> Trading Algorithm
					</h2>

					<div className="grid grid-cols-2   lg:grid-cols-3 gap-2 lg:gap-8 ">
						{featureData.map((feature, index) => (
							<div
								// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
								key={index}
								className="p-4 rounded-lg space-y-4 transition duration-500 ease-in-out transform hover:-translate-y-1  "
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
									className={`${monomaniac.className} uppercase bg-gradient-to-r text-center from-purple-200 via-purple-100 to-indigo-200 text-transparent bg-clip-text font-bold text-2xl`}
								>
									{feature.title}
								</h3>
								<p
									className={`${jura.className} text-md  bg-gradient-to-r from-purple-200/75 via-purple-100/75 to-indigo-200/75 text-transparent bg-clip-text`}
								>
									{feature.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="bg-black pt-20 py-12 px-4 lg:px-20">
				<div className="flex flex-col justify-center items-center w-full p-6 text-center">
					<h2
						className={`${monomaniac.className} w-full lg:w-1/2 uppercase bg-gradient-to-r text-center from-purple-200 via-purple-100 to-indigo-200 text-transparent bg-clip-text uppercase text-5xl lg:text-6xl font-bold mb-8`}
					>
						a geometrical pattern recognition tool from the future!
					</h2>
					<p
						className={`${jura.className}   bg-gradient-to-r from-purple-200/75 via-purple-100/75 to-indigo-200/75 text-transparent bg-clip-text text-lg max-w-2xl mx-auto`}
					>
						Rythm was born from the idea that the financial markets are a series
						of repeating patterns that can be identified and quantified. Our
						proprietary algorithms are designed to identify and trade these
						patterns with high precision and accuracy.
					</p>
				</div>
			</section>
			<section className="w-full p-4 pb-12 lg:pl-12 lg:pr-12 justify-center gap-12 flex flex-wrap lg:flex-row flex-col">
				<h3
					className={` ${monomaniac.className} uppercase  w-full text-center  bg-gradient-to-r text-center from-purple-200 via-purple-100 to-indigo-200 text-transparent bg-clip-text p-4 text-3xl`}
				>
					Development Team
				</h3>
				<div className="w-full lg:w-1/3  flex  items-center flex-row p-4 ">
					<div className="w-1/2 h-[333px]">
						<Spline scene="https://prod.spline.design/enLBj2rztquUGmgp/scene.splinecode" />
					</div>

					<div className="w-1/2 flex flex-col items-start p-2">
						<p
							className={` ${monomaniac.className} text-xl tracking-wide uppercase bg-gradient-to-r text-center from-purple-200 via-purple-100 to-indigo-200 text-transparent bg-clip-text`}
						>
							Raymond
						</p>
						<p
							className={` ${jura.className} py-2  bg-gradient-to-r from-purple-200/75 via-purple-100/75 to-indigo-200/75 text-transparent bg-clip-text text-sm uppercase tracking-widest	`}
						>
							Co-Founder
						</p>
						<p
							className={` ${jura.className} } text-xs  bg-gradient-to-r from-purple-200/75 via-purple-100/75 to-indigo-200/75 text-transparent bg-clip-text pb-4`}
						>
							Raymond is a designer and developer currently located in Mountain
							View, CA. He has been brainstorming and developing the Rythm
							trading system and philospophy since 2019.
						</p>
						<p
							className={`${jura.className}   bg-gradient-to-r from-purple-200/75 via-purple-100/75 to-indigo-200/75 text-transparent bg-clip-text text-center text-xs underline `}
						>
							raymond@rythm.capital
						</p>
					</div>
				</div>
				<div className="w-full lg:w-1/3 flex  items-center flex-row p-4">
					<div className="w-1/2 h-[333px]">
						<Spline scene="https://prod.spline.design/SBXn5bUCrycaaZrE/scene.splinecode" />
					</div>

					<div className="w-1/2 flex flex-col items-start p-2">
						<p
							className={` ${monomaniac.className} text-xl tracking-wide uppercase bg-gradient-to-r text-center from-purple-200 via-purple-100 to-indigo-200 text-transparent bg-clip-text`}
						>
							Mitch
						</p>
						<p
							className={` ${jura.className} py-2  bg-gradient-to-r from-purple-200/75 via-purple-100/75 to-indigo-200/75 text-transparent bg-clip-text text-sm uppercase tracking-widest	`}
						>
							Co-Founder
						</p>
						<p className={` ${jura.className} } text-xs text-gray-400 pb-4`}>
							Mitch is a fullstack developer currently located in North PA, and
							has extensive experience in quantiative financial modeling and has
							been building trading algorithms for several years.
						</p>

						<p
							className={`${jura.className}  text-gray-400  text-center text-xs underline `}
						>
							mitch@rythm.capital
						</p>
					</div>
				</div>
			</section>
			<div className="w-full flex justify-center h-auto py-20">
				<Newsletter />
			</div>
		</>
	);
};

export default AppPage;
