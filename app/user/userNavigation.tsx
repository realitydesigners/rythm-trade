"use client";
import "@/app/globals.css";
import Link from "next/link";
import React, { useEffect, useState } from "react";

type IconName = "logo" | "dashboard" | "settings" | "user";

const playSound = (soundUrl: any) => {
    const audio = new Audio(soundUrl);
    audio.play();
};

export default function UserNavigation() {
    const getIcon = (name: IconName) => {
        const icons = {
            logo: (
                <svg
                    viewBox="0 0 100 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <title>Logo</title>
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
                <svg
                    width="40"
                    height="40"
                    viewBox="0 0 80 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <title>Dashboard</title>
                    <path
                        d="M30.4999 36.5832V64.3331M30.4999 36.5832H16.9321C15.2053 36.5832 14.3427 36.5832 13.6832 36.9193C13.103 37.2149 12.6317 37.6862 12.3361 38.2664C12 38.926 12 39.79 12 41.5168V64.3331H30.4999M30.4999 36.5832V19.9336C30.4999 18.2068 30.4999 17.3427 30.836 16.6832C31.1316 16.103 31.6029 15.6317 32.1831 15.3361C32.8426 15 33.7052 15 35.432 15H44.0653C45.7921 15 46.6573 15 47.3169 15.3361C47.8971 15.6317 48.367 16.103 48.6626 16.6832C48.9986 17.3427 48.9998 18.2068 48.9998 19.9336V27.3333M30.4999 64.3331H48.9998M48.9998 64.3331L67.4997 64.3334V32.2669C67.4997 30.5401 67.4985 29.676 67.1625 29.0164C66.8669 28.4363 66.3988 27.9649 65.8186 27.6693C65.159 27.3333 64.2932 27.3333 62.5664 27.3333H48.9998M48.9998 64.3331V27.3333"
                        stroke="#fff"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
            settings: (
                <svg
                    width="40"
                    height="40"
                    viewBox="0 0 80 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <title>Settings</title>
                    <path
                        d="M64.333 67.4996C64.333 58.9853 53.2894 52.0831 39.6665 52.0831C26.0436 52.0831 15 58.9853 15 67.4996M39.6665 42.8331C31.1522 42.8331 24.2499 35.9309 24.2499 27.4166C24.2499 18.9022 31.1522 12 39.6665 12C48.1808 12 55.0831 18.9022 55.0831 27.4166C55.0831 35.9309 48.1808 42.8331 39.6665 42.8331Z"
                        stroke="#fff"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
            user: (
                <svg
                    width="80"
                    height="80"
                    viewBox="0 0 80 80"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M64.7495 30.9521L63.6566 30.3441C63.4869 30.2497 63.4034 30.2023 63.3214 30.1532C62.5065 29.665 61.8196 28.9905 61.3183 28.1836C61.2678 28.1024 61.2203 28.0172 61.1231 27.8489C61.026 27.6809 60.9768 27.5957 60.9317 27.5114C60.482 26.6718 60.2388 25.7362 60.2243 24.784C60.2228 24.6883 60.2231 24.5904 60.2264 24.396L60.2478 23.1269C60.2819 21.096 60.2991 20.0774 60.0137 19.1633C59.7602 18.3513 59.3361 17.6034 58.7697 16.9688C58.1295 16.2513 57.2434 15.7395 55.4693 14.7172L53.9956 13.868C52.2264 12.8485 51.3415 12.3385 50.4022 12.1441C49.5713 11.9722 48.7137 11.9801 47.8858 12.166C46.9513 12.3758 46.0775 12.899 44.3309 13.9448L44.321 13.9496L43.2651 14.5818C43.0981 14.6818 43.0136 14.7322 42.9299 14.7787C42.0995 15.2404 41.1724 15.4957 40.2227 15.5262C40.127 15.5293 40.0296 15.5293 39.8349 15.5293C39.6414 15.5293 39.5399 15.5293 39.4444 15.5262C38.4926 15.4956 37.5636 15.2389 36.7319 14.7753C36.6481 14.7286 36.5651 14.6778 36.3978 14.5773L35.3352 13.9394C33.5767 12.8836 32.6961 12.355 31.7564 12.1441C30.9251 11.9576 30.0646 11.9525 29.2306 12.1267C28.2889 12.3233 27.4038 12.8371 25.6336 13.8645L25.6257 13.868L24.1704 14.7126L24.1543 14.7225C22.4 15.7406 21.5208 16.2509 20.886 16.9654C20.3227 17.5995 19.9016 18.3462 19.6496 19.156C19.3647 20.0714 19.3799 21.0922 19.4142 23.1326L19.4356 24.3999C19.4388 24.5918 19.4444 24.6872 19.443 24.7816C19.4289 25.7358 19.1824 26.6733 18.7315 27.5143C18.6869 27.5975 18.6388 27.6806 18.5429 27.8468C18.4468 28.013 18.4003 28.0957 18.3505 28.1759C17.847 28.9872 17.157 29.6656 16.3369 30.1547C16.2557 30.203 16.1703 30.2495 16.0023 30.3426L14.9233 30.9406C13.128 31.9354 12.2306 32.4333 11.5776 33.1418C11 33.7686 10.5636 34.5121 10.2972 35.3218C9.99607 36.237 9.99632 37.2634 10.001 39.3158L10.0048 40.9934C10.0094 43.0321 10.0158 44.0508 10.3176 44.9599C10.5846 45.7641 11.0178 46.5032 11.5922 47.1262C12.2415 47.8304 13.13 48.3252 14.9116 49.3163L15.981 49.9112C16.163 50.0125 16.2546 50.0625 16.3423 50.1153C17.155 50.6047 17.8396 51.2812 18.3389 52.0878C18.3928 52.175 18.4446 52.2654 18.5481 52.4463C18.6504 52.625 18.7027 52.7143 18.75 52.8038C19.1877 53.6325 19.422 54.5533 19.438 55.4903C19.4397 55.5916 19.4383 55.694 19.4348 55.8998L19.4142 57.1159C19.3797 59.1634 19.3646 60.1883 19.6512 61.1062C19.9047 61.9182 20.3284 62.666 20.8947 63.3007C21.5349 64.0182 22.4224 64.5296 24.1966 65.552L25.67 66.401C27.4392 67.4206 28.3235 67.9299 29.2628 68.1243C30.0937 68.2962 30.9518 68.2896 31.7797 68.1037C32.7155 67.8936 33.5923 67.3686 35.3439 66.3198L36.3998 65.6875C36.5669 65.5875 36.6515 65.5374 36.7352 65.4908C37.5656 65.0291 38.4918 64.7725 39.4415 64.742C39.5372 64.7389 39.6345 64.7389 39.8292 64.7389C40.0244 64.7389 40.1216 64.7389 40.2175 64.742C41.1693 64.7726 42.1011 65.0301 42.9328 65.4937C43.006 65.5345 43.0793 65.5786 43.2081 65.6559L44.3306 66.3299C46.0894 67.3857 46.9681 67.9128 47.9078 68.1237C48.7392 68.3102 49.6003 68.3178 50.4343 68.1436C51.3757 67.947 52.2626 67.4322 54.0318 66.4054L55.509 65.548C57.2644 64.5292 58.1447 64.0183 58.7797 63.3036C59.343 62.6696 59.7646 61.9232 60.0166 61.1134C60.2994 60.2047 60.2823 59.1917 60.2485 57.1807L60.2264 55.8692C60.2232 55.6773 60.2228 55.5818 60.2242 55.4874C60.2383 54.5332 60.4807 53.5951 60.9317 52.754C60.9762 52.671 61.0246 52.5872 61.1203 52.4215C61.2163 52.2553 61.266 52.1724 61.3158 52.0922C61.8193 51.2809 62.5101 50.6019 63.3302 50.1129C63.4103 50.0651 63.4928 50.0194 63.6568 49.9285L63.6624 49.9259L64.7414 49.328C66.5366 48.3331 67.4358 47.8347 68.0888 47.1262C68.6665 46.4994 69.1023 45.757 69.3686 44.9473C69.668 44.0374 69.6657 43.0171 69.6611 40.9886L69.6572 39.275C69.6525 37.2363 69.65 36.2177 69.3482 35.3086C69.0813 34.5044 68.6456 33.7653 68.0712 33.1423C67.4225 32.4388 66.5328 31.9438 64.7546 30.9546L64.7495 30.9521Z"
                        stroke="#fff"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                    <title>User</title>
                    <path
                        d="M27.8949 40.1348C27.8949 46.7274 33.2393 52.0718 39.832 52.0718C46.4247 52.0718 51.7691 46.7274 51.7691 40.1348C51.7691 33.5421 46.4247 28.1977 39.832 28.1977C33.2393 28.1977 27.8949 33.5421 27.8949 40.1348Z"
                        stroke="#fff"
                        strokeWidth="5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
        };
        return icons[name] || <path />;
    };
    const playHoverSound = () => {
        playSound("/sound/hover.mp3");
    };

    const playClickSound = () => {
        playSound("/sound/menu.mp3");
    };

    // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
    useEffect(() => {
        const handleHover = (event: any) => {
            playHoverSound();
        };

        const handleClick = (event: any) => {
            playClickSound();
        };

        const hoverElements = document.querySelectorAll(".sound");
        const clickElements = document.querySelectorAll(".sound");

        for (const element of hoverElements) {
            element.addEventListener("mouseenter", handleHover);
        }

        for (const element of clickElements) {
            element.addEventListener("click", handleClick);
        }

        return () => {
            for (const element of hoverElements) {
                element.removeEventListener("mouseenter", handleHover);
            }

            for (const element of clickElements) {
                element.removeEventListener("click", handleClick);
            }
        };
    }, []);
    return (
        <>
            <Link
                href="/user"
                className="z-80 sound absolute left-4 top-4 rounded-[.5em] border border-gray-700/25 bg-gray-700/10 p-1 lg:hidden"
            >
                <svg className="h-10 w-10 ">
                    <title>Logo</title>
                    {getIcon("logo")}
                </svg>
            </Link>
            <div
                id="navbar"
                className="fixed bottom-0 z-50 flex h-20 w-full flex-row items-center justify-between border-t border-gray-700/50 bg-black  p-0 lg:left-0 lg:h-screen  lg:w-20 lg:flex-col lg:border-r lg:border-t-0 lg:border-t-0 lg:p-4"
            >
                <Link
                    href="/user"
                    className="hidden  rounded-[.5em] border border-gray-700/25 bg-gray-700/10  lg:block"
                >
                    <svg className="h-10 w-10 ">
                        <title>Logo</title>
                        {getIcon("logo")}
                    </svg>
                </Link>
                <div
                    id="nav-content"
                    role="menu"
                    className="bottom-0 h-full w-full items-center  justify-center overflow-y-auto  bg-black transition-transform duration-300  ease-in-out lg:relative lg:left-0 lg:h-auto lg:h-screen  lg:w-full lg:overflow-y-visible lg:bg-transparent"
                >
                    <ul className="flex h-full w-full flex-row items-center  justify-center gap-4 lg:flex-col ">
                        <li className="block">
                            <Link
                                href="/user"
                                className="sound flex h-12 w-12 items-center justify-center rounded-full border border-gray-700/50 p-2 transition-all  duration-200 ease-in-out hover:scale-105 hover:bg-gray-700/25 "
                            >
                                {getIcon("settings")}
                            </Link>
                        </li>
                        <li className="block">
                            <Link
                                href="/user"
                                className="sound flex h-12 w-12 items-center justify-center rounded-full border border-gray-700/50 p-2 transition-all  duration-200 ease-in-out hover:scale-105 hover:bg-gray-700/25 "
                            >
                                {getIcon("dashboard")}
                            </Link>
                        </li>
                        <li className="block">
                            <Link
                                href="/user"
                                className=" sound flex h-12 w-12 items-center justify-center rounded-full border border-gray-700/50 p-2 transition-all  duration-200 ease-in-out hover:scale-105 hover:bg-gray-700/25 "
                            >
                                {getIcon("user")}
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    );
}
