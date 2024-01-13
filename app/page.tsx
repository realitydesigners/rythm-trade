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
						scene="https://prod.spline.design/XvwEOVWxuHPaKgsk/scene.splinecode"
						className="absolute w-full h-full z-0"
					/>
					<div className="w-full h-40 bottom-0 absolute bg-gradient-to-t from-black to-transparent" />

					<div className="p-8 flex w-full lg:w-11/12 flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 z-20 ">
						<div className="w-full lg:w-1/2 flex flex-col lg:items-start items-center rounded-lg shadow-lg ">
							<h1
								className={`${monomaniac.className} drop-shadow-md text-gray-200 uppercase font-bold  text-6xl lg:text-9xl`}
							>
								The Future
								<br /> Of Trading
							</h1>
							<p
								className={`${jura.className} drop-shadow-md p-2 hidden lg:block text-gray-400 w-3/4 text-center lg:text-left font-bold  text-md lg:text-lg mt-4`}
							>
								Next Generation High Frequency Trading Models
							</p>
							<div className="py-12 lg:py-6 ">
								<Link
									href="/about"
									className={`${monomaniac.className} text-xl uppercase inline-block bg-black hover:bg-gray-200 hover:text-black text-white font-bold py-4 px-8 border border-gray-600/50 rounded-lg transition duration-300 transform hover:scale-105`}
								>
									Join Beta v1.0
								</Link>
							</div>
							<p
								className={`${jura.className} drop-shadow-md p-2 absolute bottom-6 lg:hidden text-gray-400 w-1/2 text-center lg:text-left font-bold  text-md mt-4`}
							>
								Next Generation High Frequency Trading Models
							</p>
						</div>
						<div className="w-full md:w-1/2  hidden lg:flex h-40 lg:h-96 bg-black/0 p-6 rounded-lg shadow-lg" />
					</div>
				</div>
			</section>

			<section className="bg-black pt-20 py-12 lg:px-20 ">
				<div className="w-full px-4 md:px-20 ">
					<h2
						className={`${monomaniac.className} text-center text-gray-200 uppercase font-bold text-4xl lg:text-6xl mb-20`}
					>
						A New Kind Of
						<br /> Trading Algorithm
					</h2>
					<div className="grid grid-cols-2   lg:grid-cols-3 gap-2 lg:gap-8 ">
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
									className={`${monomaniac.className} text-gray-200 text-center uppercase font-bold text-2xl`}
								>
									{feature.title}
								</h3>
								<p
									className={`${jura.className} text-gray-400 text-xs text-center`}
								>
									{feature.description}
								</p>
							</div>
						))}
					</div>
				</div>
			</section>

			<section className="bg-black pt-20 py-12 px-4 lg:px-20">
				<div className="w-full h-[400px] lg:h-[30vw] pb-4">
					<Spline scene="https://prod.spline.design/wH23ygFEhlH5Gqvm/scene.splinecode" />
				</div>

				<div className="flex flex-col justify-center items-center w-full p-6 text-center">
					<h2
						className={`${monomaniac.className} w-full lg:w-1/2 text-white uppercase text-5xl lg:text-6xl font-bold mb-8`}
					>
						a geometrical pattern recognition tool from the future!
					</h2>
					<p
						className={`${jura.className}  text-gray-300 text-lg max-w-2xl mx-auto`}
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
					className={` ${monomaniac.className}  w-full text-center text-gray-200 p-4 text-3xl`}
				>
					Development Team
				</h3>
				<div className="w-full lg:w-1/3  flex  items-center flex-row p-4 border border-gray-600/50 rounded-[1em] ">
					<div className="w-1/2 h-[333px]">
						<Spline scene="https://prod.spline.design/enLBj2rztquUGmgp/scene.splinecode" />
					</div>

					<div className="w-1/2 flex flex-col items-start p-2">
						<p
							className={` ${monomaniac.className} text-xl tracking-wide text-gray-200`}
						>
							Raymond
						</p>
						<p
							className={` ${jura.className} py-2 text-gray-400 text-sm uppercase tracking-widest	`}
						>
							Co-Founder
						</p>
						<p className={` ${jura.className} } text-xs text-gray-400 pb-4`}>
							Raymond is a designer and developer currently located in Mountain
							View, CA. He has been brainstorming and developing the Rythm
							trading system and philospophy since 2019.
						</p>
						<p
							className={`${jura.className}  text-gray-400  text-center text-xs underline font-mono`}
						>
							raymond@rythm.capital
						</p>
					</div>
				</div>
				<div className="w-full lg:w-1/3 flex  items-center flex-row p-4 border border-gray-600/50 rounded-[1em] ">
					<div className="w-1/2 h-[333px]">
						<Spline scene="https://prod.spline.design/SBXn5bUCrycaaZrE/scene.splinecode" />
					</div>

					<div className="w-1/2 flex flex-col items-start p-2">
						<p
							className={` ${monomaniac.className} text-xl tracking-wide text-gray-200`}
						>
							Mitch
						</p>
						<p
							className={` ${jura.className} py-2 text-gray-400 text-sm uppercase tracking-widest	`}
						>
							Co-Founder
						</p>
						<p className={` ${jura.className} } text-xs text-gray-400 pb-4`}>
							Mitch is a fullstack developer currently located in North PA, and
							has extensive experience in quantiative financial modeling and has
							been building trading algorithms for several years.
						</p>

						<p
							className={`${jura.className}  text-gray-400  text-center text-xs underline font-mono`}
						>
							mitch@rythm.capital
						</p>
					</div>
				</div>
			</section>
			<div className="w-full flex justify-center h-auto pb-20">
				<Newsletter />
			</div>
		</>
	);
};

export default AppPage;
