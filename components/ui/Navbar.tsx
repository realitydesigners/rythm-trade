"use client";
import { monomaniac } from "@/app/fonts";
import "@/app/globals.css";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import React, { useState } from "react";

type IconName = "logo" | "dashboard";

export default function Navbar() {
    const [isNavOpen, setIsNavOpen] = useState(false);

    const toggleNav: () => void = () => {
        setIsNavOpen(!isNavOpen);
        document.body.style.overflow = isNavOpen ? "auto" : "hidden";
    };
    const closeNav = () => {
        setIsNavOpen(false);
        document.body.style.overflow = "auto";
    };

    const getMenuIconPath = () => {
        return isNavOpen ? "M3 3l18 18M3 21L21 3" : "M3 12h18M3 6h18M3 18h18";
    };

    const getIcon = (name: IconName) => {
        const icons = {
            logo: (
                // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
                <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M32.4444 69L32.4444 33.4444C32.4444 32.8922 32.8922 32.4444 33.4444 32.4444L66.3441 32.4445C66.9074 32.4445 67.3595 32.9094 67.3437 33.4724L66.8803 50.0401C66.8652 50.5813 66.4221 51.0121 65.8807 51.0121L51.4575 51.0121C50.5517 51.0121 50.1126 52.12 50.7724 52.7406L83.8627 83.8627M83.8627 83.8627L48.9346 83.8627L16.9542 83.8627C16.402 83.8627 15.9542 83.415 15.9542 82.8627L15.9542 16.9542C15.9542 16.4019 16.4019 15.9542 16.9542 15.9542L82.8627 15.9542C83.415 15.9542 83.8627 16.402 83.8627 16.9542L83.8627 83.8627Z"
                        stroke="white"
                        strokeWidth="8"
                    />
                    <clipPath id="clip0_804_82">
                        <rect width="100" height="100" fill="white" />
                    </clipPath>
                </svg>
            ),
            dashboard: (
                // biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
                <svg
                    viewBox="0 0 53 53"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M3.75 20.2357L24.25 30.9032L24.25 44.7318L3.75 33.4605L3.75 20.2357Z"
                        stroke="white"
                        strokeWidth="1.5"
                    />
                    <path
                        d="M49.25 20.1887L26.75 30.9212L26.75 44.7821L49.25 33.4421L49.25 20.1887Z"
                        stroke="white"
                        strokeWidth="1.5"
                    />
                    <path
                        d="M49.25 32.7923L26.75 21.6623L26.75 7.23826L49.25 18.9983L49.25 32.7923Z"
                        stroke="white"
                        strokeWidth="1.5"
                    />
                    <path
                        d="M3.75 32.743L24.25 21.6805L24.25 7.29099L3.75 18.9797L3.75 32.743Z"
                        stroke="white"
                        strokeWidth="1.5"
                    />
                </svg>
            ),
        };
        return icons[name] || <path />;
    };

    return (
        <nav
            id="navbar"
            className="fixed z-50 flex h-16  w-full items-center justify-between bg-gradient-to-t from-transparent to-black  p-2"
        >
            <div
                className="logo relative ml-2 flex items-center"
                style={{ zIndex: 1001 }}
            >
                <Link href="/">
                    <div className="flex items-center p-2 ">
                        {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                        <svg className="h-8 w-8 ">{getIcon("logo")}</svg>
                    </div>
                </Link>
                <Link href="/">
                    <div
                        className={`${monomaniac.className}  hidden flex-col pb-2 pt-2 text-gray-200 lg:flex `}
                    >
                        <span className="text-xl font-bold leading-none tracking-widest">
                            RYTHM
                        </span>
                    </div>
                </Link>
            </div>

            <div className="relative pl-2 lg:pl-0">
                {/* biome-ignore lint/a11y/useButtonType: <explanation> */}
                <button
                    id="nav-toggle"
                    className="relative z-20 flex items-center justify-center pl-2 pr-2 pt-3 lg:hidden"
                    aria-label="Toggle Menu"
                    onClick={toggleNav}
                >
                    {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
                    <svg
                        className="h-8 w-8"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d={getMenuIconPath()}
                            stroke="#fff"
                            strokeWidth="2"
                        />
                    </svg>
                </button>
            </div>

            {/* Navigation Links */}
            <div
                id="nav-content"
                role="menu"
                className={`absolute left-0 top-0 h-screen w-full items-center overflow-y-auto bg-black  transition-transform duration-300 ease-in-out lg:relative lg:h-auto  lg:w-full lg:overflow-y-visible lg:bg-transparent ${
                    isNavOpen ? "translate-x-0" : "-translate-x-full"
                } flex flex-col justify-center p-8 lg:translate-x-0 lg:flex-row lg:justify-evenly lg:p-0`}
            >
                <div className="flex  w-auto ">
                    <p className="text-center  text-[10px] text-gray-400">
                        The Future Of Trading
                    </p>
                </div>

                <ul className="lg:space-evenly flex-cols mt-4 gap-4  lg:mt-0 lg:flex">
                    <li className="block">
                        <Link
                            href="/dashboard"
                            className={`${monomaniac.className} flex  items-center rounded-lg  p-2 text-3xl font-semibold   uppercase  tracking-wide text-gray-200 transition-all duration-200 ease-in-out hover:scale-105 hover:bg-gray-600/10 hover:text-gray-200 lg:text-sm`}
                            onClick={closeNav}
                        >
                            <span className="ml-2">Dashboard</span>
                        </Link>
                    </li>
                    <li className="block">
                        <Link
                            href="/account"
                            className={`${monomaniac.className} flex  items-center rounded-lg p-2 text-3xl font-semibold   uppercase   tracking-wide text-gray-200 transition-all duration-200 ease-in-out hover:scale-105 hover:bg-gray-600/10 hover:text-gray-200 lg:text-sm`}
                            onClick={closeNav}
                        >
                            <span className="ml-2">My Account</span>
                        </Link>
                    </li>
                    <li className="block">
                        <Link
                            href="/"
                            className={`${monomaniac.className} flex   items-center rounded-lg  p-2 text-3xl font-semibold  uppercase   tracking-wide text-gray-200 transition-all duration-200 ease-in-out hover:scale-105 hover:bg-gray-600/10 hover:text-gray-200 lg:text-sm`}
                            onClick={closeNav}
                        >
                            <span className="ml-2">Tools</span>
                        </Link>
                    </li>
                </ul>
                <div className="hidden  w-auto  lg:flex ">
                    <p className="text-center  text-[10px] text-gray-400 underline">
                        rythm.capital
                    </p>
                </div>
            </div>
            <SignedOut>
                <div className="group mr-0  flex justify-center lg:mr-4 lg:mt-0 lg:h-8">
                    <Link
                        href="/sign-up"
                        onClick={closeNav}
                        className="border-1 relative mr-2 flex items-center items-center justify-center rounded-full border-black bg-white p-2 text-xs font-semibold text-black transition-all duration-200 ease-in-out hover:border-gray-300"
                    >
                        <span className="whitespace-nowrap">Sign-In</span>
                    </Link>
                </div>
            </SignedOut>

            <SignedIn>
                <div className=" mr-4 flex  lg:relative   lg:flex lg:p-2 ">
                    <UserButton afterSignOutUrl="/" />
                </div>
            </SignedIn>
        </nav>
    );
}
