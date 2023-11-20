'use client';
import React, { useState } from 'react';

type IconName = 'logo' | 'dashboard';

export default function Navbar() {
   const [isNavOpen, setIsNavOpen] = useState(false);

   const toggleNav = () => {
      setIsNavOpen(!isNavOpen);
      document.body.style.overflow = isNavOpen ? 'auto' : 'hidden';
   };

   const getMenuIconPath = () => {
      return isNavOpen ? 'M3 3l18 18M3 21L21 3' : 'M3 12h18M3 6h18M3 18h18';
   };

   const getIcon = (name: IconName) => {
      const icons: { [key in IconName]: JSX.Element } = {
         logo: (
            <svg width="40" height="40" viewBox="0 0 53 53" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M3.75 20.2357L24.25 30.9032L24.25 44.7318L3.75 33.4605L3.75 20.2357Z" stroke="white" stroke-width="1.5" />
               <path d="M49.25 20.1887L26.75 30.9212L26.75 44.7821L49.25 33.4421L49.25 20.1887Z" stroke="white" stroke-width="1.5" />
               <path d="M49.25 32.7923L26.75 21.6623L26.75 7.23826L49.25 18.9983L49.25 32.7923Z" stroke="white" stroke-width="1.5" />
               <path d="M3.75 32.743L24.25 21.6805L24.25 7.29099L3.75 18.9797L3.75 32.743Z" stroke="white" stroke-width="1.5" />
            </svg>
         ),
         dashboard: (
            <svg viewBox="0 0 53 53" fill="none" xmlns="http://www.w3.org/2000/svg">
               <path d="M3.75 20.2357L24.25 30.9032L24.25 44.7318L3.75 33.4605L3.75 20.2357Z" stroke="white" stroke-width="1.5" />
               <path d="M49.25 20.1887L26.75 30.9212L26.75 44.7821L49.25 33.4421L49.25 20.1887Z" stroke="white" stroke-width="1.5" />
               <path d="M49.25 32.7923L26.75 21.6623L26.75 7.23826L49.25 18.9983L49.25 32.7923Z" stroke="white" stroke-width="1.5" />
               <path d="M3.75 32.743L24.25 21.6805L24.25 7.29099L3.75 18.9797L3.75 32.743Z" stroke="white" stroke-width="1.5" />
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

         <div id="nav-content" role="menu" className={`absolute  top-0   bg-black w-full h-screen overflow-y-auto flex-grow flex items-center ${isNavOpen ? 'flex' : 'hidden'}`}>
            <div className="w-full h-full p-2 relative ">
               <div className="w-full h-[250px]"></div>

               <ul className="flex font-bold relative  p-2 gap-2 h-auto lg:h-auto flex-col  lg:justify-end uppercase text-black text-3xl lg:text-4xl">
                  <li>
                     <a href="/dashboard" className="block font-mono tracking-wide flex items-center px-3 py-1 text-white hover:bg-gray-200/10 rounded-lg">
                        <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                           {getIcon('dashboard')}
                        </svg>
                        Dashboard
                     </a>
                  </li>
                  <li>
                     <a href="/sign-in" className="block font-mono tracking-wide flex items-center px-3 py-1 text-white  hover:bg-gray-200/10 rounded-lg">
                        <svg className="w-6 h-6 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                           {getIcon('dashboard')}
                        </svg>
                        Sign In
                     </a>
                  </li>
               </ul>
            </div>
         </div>
      </nav>
   );
}
