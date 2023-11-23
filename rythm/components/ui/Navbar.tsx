'use client';
import React, { useState } from 'react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import '@/app/globals.css';

type IconName = 'logo' | 'dashboard';

export default function Navbar() {
   const [isNavOpen, setIsNavOpen] = useState(false);

   const toggleNav = () => {
      setIsNavOpen(!isNavOpen);
      document.body.style.overflow = isNavOpen ? 'auto' : 'hidden';
   };
   const closeNav = () => {
      setIsNavOpen(false); // Close the navigation
      document.body.style.overflow = 'auto'; // Enable scrolling
   };

   const getMenuIconPath = () => {
      return isNavOpen ? 'M3 3l18 18M3 21L21 3' : 'M3 12h18M3 6h18M3 18h18';
   };

   const getIcon = (name: IconName) => {
      const icons = {
         logo: (
            <svg width="40" height="40" viewBox="0 0 53 53" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M3.75 20.2357L24.25 30.9032L24.25 44.7318L3.75 33.4605L3.75 20.2357Z" stroke="white" strokeWidth="1.5" />
               <path d="M49.25 20.1887L26.75 30.9212L26.75 44.7821L49.25 33.4421L49.25 20.1887Z" stroke="white" strokeWidth="1.5" />
               <path d="M49.25 32.7923L26.75 21.6623L26.75 7.23826L49.25 18.9983L49.25 32.7923Z" stroke="white" strokeWidth="1.5" />
               <path d="M3.75 32.743L24.25 21.6805L24.25 7.29099L3.75 18.9797L3.75 32.743Z" stroke="white" strokeWidth="1.5" />
            </svg>
         ),
         dashboard: (
            <svg viewBox="0 0 53 53" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M3.75 20.2357L24.25 30.9032L24.25 44.7318L3.75 33.4605L3.75 20.2357Z" stroke="white" strokeWidth="1.5" />
               <path d="M49.25 20.1887L26.75 30.9212L26.75 44.7821L49.25 33.4421L49.25 20.1887Z" stroke="white" strokeWidth="1.5" />
               <path d="M49.25 32.7923L26.75 21.6623L26.75 7.23826L49.25 18.9983L49.25 32.7923Z" stroke="white" strokeWidth="1.5" />
               <path d="M3.75 32.743L24.25 21.6805L24.25 7.29099L3.75 18.9797L3.75 32.743Z" stroke="white" strokeWidth="1.5" />
            </svg>
         ),
      };
      return icons[name] || <path />;
   };

   return (
      <nav role="navigation" id="navbar" className="flex items-center justify-between   fixed w-full h-auto z-50">
         <div className="ml-2 relative flex items-center logo" style={{ zIndex: 1001 }}>
            <Link href="/">
               <div className="p-2 items-center flex cursor-pointer">{getIcon('logo')}</div>
            </Link>
            <Link href="/">
               <div className="text-gray-200 pt-2 pb-2 flex-col cursor-pointer">
                  <span className="text-lg font-bold tracking-wide leading-none">RYTHM</span>
               </div>
            </Link>
         </div>

         <div className="flex relative">
            <button id="nav-toggle" className="flex items-center justify-center relative pl-2 pt-3 pr-2 z-20 lg:hidden" aria-label="Toggle Menu" onClick={toggleNav}>
               <svg className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d={getMenuIconPath()} stroke="#fff" strokeWidth="2"></path>
               </svg>
            </button>
         </div>

         {/* Navigation Links */}
         <div id="nav-content" role="menu" className={`absolute lg:relative top-0 left-0 bg-black w-full lg:w-full  h-screen lg:h-auto items-center overflow-y-auto lg:overflow-y-visible  transition-transform duration-300 ease-in-out ${isNavOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 flex flex-col lg:flex-row lg:justify-between justify-center p-8 lg:p-0`}>
            <div className="w-auto  flex m-0 lg:ml-12">
               <p className="text-gray-400  text-center text-xs font-mono">
                  {' '}
                  Pattern Recognition<br></br>In Another Dimension
               </p>
            </div>

            <ul className="lg:flex lg:space-evenly items-center  mt-4 lg:mt-0">
               <li className="block">
                  <Link href="/dashboard" className="flex items-center text-md lg:text-xs text-gray-200  font-mono font-semibold hover:bg-gray-600/30 hover:text-gray-200 hover:scale-105 p-3 rounded-lg transition-all duration-200 ease-in-out" onClick={closeNav}>
                     <svg className="w-4 h-4">{getIcon('dashboard')}</svg>
                     <span className="ml-2">Dashboard</span>
                  </Link>
               </li>
               <li className="block">
                  <Link href="/about" className="flex items-center text-md lg:text-xs text-gray-200  font-mono font-semibold hover:bg-gray-600/30 hover:text-gray-200 hover:scale-105 p-3 rounded-lg transition-all duration-200 ease-in-out" onClick={closeNav}>
                     <svg className="w-4 h-4">{getIcon('dashboard')}</svg>
                     <span className="ml-2">About</span>
                  </Link>
               </li>
               <li className="w-full">
                  <Link href="/contact" className="flex items-center text-md lg:text-xs text-gray-200  font-mono font-semibold hover:bg-gray-600/30 hover:text-gray-200 hover:scale-105 p-3 rounded-lg transition-all duration-200 ease-in-out" onClick={closeNav}>
                     <svg className="w-4 h-4">{getIcon('dashboard')}</svg>
                     <span className="ml-2">Contact</span>
                  </Link>
               </li>
            </ul>
            <div className="w-auto  lg:flex  hidden ">
               <p className="text-gray-400  text-center text-xs font-mono">rythm.capital</p>
            </div>
            <SignedOut>
               <Link href="/sign-up" className="mb-4 lg:mb-0 lg:ml-6 flex items-center space-x-2 text-gray-200  text-md lg:text-smfont-mono font-bold uppercase hover:bg-gray-600/30 hover:text-gray-200 hover:scale-105 p-3 rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-300" onClick={closeNav}>
                  <svg className="w-4 h-4">{getIcon('dashboard')}</svg>
                  <span>Sign-In</span>
               </Link>
            </SignedOut>

            <SignedIn>
               <div className="w-full lg:w-auto p-4 lg:p-2 flex items-center justify-center lg:justify-end">
                  <UserButton afterSignOutUrl="/" />
               </div>
            </SignedIn>
         </div>
      </nav>
   );
}
