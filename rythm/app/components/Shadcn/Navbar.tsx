'use client';
import React, { useState } from 'react';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import { Button, buttonVariants } from '@/app/components/Shadcn/button';

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
      const icons: { [key in IconName]: JSX.Element } = {
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
      <nav role="navigation" id="navbar" className="flex items-center justify-between bg-black fixed w-full h-auto" style={{ zIndex: 1000 }}>
         <div className="ml-2 relative flex items-center logo" style={{ zIndex: 1001 }}>
            <a href="/" className="p-2 items-center flex">
               {getIcon('logo')}
            </a>

            <a href="/" className="text-white pt-2 pb-2 flex-col">
               <span className="text-lg font-bold tracking-wide leading-none">RYTHM</span>
            </a>
         </div>
         <div className="flex relative">
            <button id="nav-toggle" className="flex items-center justify-center items-center relative pl-2 pt-3 pr-2 z-20" aria-label="Toggle Menu" onClick={toggleNav}>
               <svg className="w-8 h-8" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d={getMenuIconPath()} stroke="#fff" strokeWidth="2"></path>
               </svg>
            </button>
         </div>

         <div id="nav-content" role="menu" className={`absolute top-0 left-0 bg-black w-full h-screen overflow-y-auto transition-transform duration-300 ease-in-out ${isNavOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col justify-center p-8`}>
            <SignedOut>
               <Link href="/sign-up" className="flex items-center space-x-2 text-white text-xl font-mono font-bold uppercase mb-4 hover:bg-gray-600/30 hover:text-gray-300 hover:scale-105 p-3 rounded-lg transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-gray-300" onClick={closeNav}>
                  <div className="flex items-center space-x-2">
                     <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        {getIcon('dashboard')}
                     </svg>
                     <span>Sign-In</span>
                  </div>
               </Link>
            </SignedOut>

            <SignedIn>
               <div className="w-full p-4  flex items-center p-2">
                  <div className="flex justify-center rounded-full  p-[2px] bg-white">
                     <UserButton afterSignOutUrl="/" />
                  </div>
               </div>
            </SignedIn>

            <ul className="space-y-4">
               {['Dashboard', 'About', 'Contact'].map(text => (
                  <li key={text}>
                     <Link href={`/${text.toLowerCase()}`} className="flex items-center text-xl text-white uppercase font-mono font-bold hover:bg-gray-600/30 hover:text-gray-300 hover:scale-105 p-3 rounded-lg transition-all duration-200 ease-in-out" onClick={closeNav}>
                        <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                           {getIcon('dashboard')}
                        </svg>
                        {text}
                     </Link>
                  </li>
               ))}
            </ul>
         </div>
      </nav>
   );
}
