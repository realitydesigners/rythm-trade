'use client';
import React from 'react';
import Link from 'next/link';
import { staatliches, inter, jura } from './fonts';
import Secure from '@/public/icons/secure.svg';
import Scale from '@/public/icons/scale.svg';
import Repeat from '@/public/icons/repeat.svg';
import Quant from '@/public/icons/quant.svg';
import Prop from '@/public/icons/prop.svg';

import Image from 'next/image';

const AppPage = () => {
   return (
      <>
         {/* Hero */}
         <section className="bg-black w-full h-[90vh] lg:h-screen overflow-hidden">
            <div className="w-full h-full relative flex justify-center items-center">
               <iframe title="Spline Design" src="https://my.spline.design/untitled-9d19aefa4825eeefc5f2dc0a720c01f5/" className="absolute w-full h-full z-0"></iframe>
               <div className="w-full h-40 bottom-0 absolute bg-gradient-to-t from-black to-transparent"></div>

               <div className="p-8 flex w-full lg:w-11/12 flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4 z-20 ">
                  <div className="w-full lg:w-1/2 flex flex-col lg:items-start items-center rounded-lg shadow-lg ">
                     <h1 className={`${staatliches.className} drop-shadow-md text-gray-200 uppercase font-bold  text-6xl lg:text-9xl`}>
                        The Future
                        <br /> Of Trading
                     </h1>
                     <p className={`${jura.className} drop-shadow-md p-2 hidden lg:block text-gray-300 w-3/4 text-center lg:text-left font-bold  text-md lg:text-lg mt-4`}>Next Generation High Frequency Trading Models</p>
                     <div className="pt-8 ">
                        <Link href="/about" className={`${staatliches.className} text-xl uppercase inline-block bg-black hover:bg-gray-200 hover:text-black text-white font-bold py-2 px-8 border border-gray-600 rounded-lg transition duration-300 transform hover:scale-105`}>
                           Join Beta v1.0
                        </Link>
                     </div>
                     <p className={`${jura.className} drop-shadow-md p-2 absolute bottom-6 lg:hidden text-gray-300 w-1/2 text-center lg:text-left font-bold  text-sm mt-4`}>Next Generation High Frequency Trading Models</p>
                  </div>
                  <div className="w-full md:w-1/2  hidden lg:flex h-40 lg:h-96 bg-black/0 p-6 rounded-lg shadow-lg"></div>
               </div>
            </div>
         </section>

         {/* Features Section */}
         <section className="bg-black lg:p-20 p-0 mb-40 ">
            <div className="container gap-8">
               <h2 className={`${staatliches.className} py-20 lg:p-32  text-center text-gray-200 uppercase font-bold text-4xl lg:text-6xl`}>
                  A New Kind Of
                  <br /> Trading Algorithm
               </h2>
               <div className="grid grid-cols-2 md:grid-cols-5 gap-12 ">
                  {/* Feature 1 - Secure */}
                  <div className="p-2 rounded-lg shadow-lg space-y-2 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl">
                     <div className="h-20 w-20 rounded-full mx-auto transition duration-500 ease-in-out transform hover:scale-110">
                        <Image src={Secure} width={500} height={500} alt="Secure" />
                     </div>
                     <h3 className={`${staatliches.className} text-gray-200 text-center uppercase font-bold text-2xl`}>Secure</h3>
                     <p className={`${jura.className} text-gray-400 text-sm text-center`}>Our robust security features protect your data and maintain privacy.</p>
                  </div>
                  {/* Feature 2 - Scalable */}
                  <div className="p-2 rounded-lg shadow-lg space-y-2 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl">
                     <div className="h-20 w-20 rounded-full mx-auto transition duration-500 ease-in-out transform hover:scale-110">
                        <Image src={Scale} width={500} height={500} alt="Scalable" />
                     </div>
                     <h3 className={`${staatliches.className} text-gray-200 text-center uppercase font-bold text-2xl`}>Scalable</h3>
                     <p className={`${jura.className} text-gray-400 text-sm text-center`}>Our infrastructure is designed to scale regardless of volume.</p>
                  </div>
                  {/* Feature 3 - Repeatable */}
                  <div className="p-2 rounded-lg shadow-lg space-y-2 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl">
                     <div className="h-20 w-20 rounded-full mx-auto transition duration-500 ease-in-out transform hover:scale-110">
                        <Image src={Repeat} width={500} height={500} alt="Repeatable" />
                     </div>
                     <h3 className={`${staatliches.className} text-gray-200 text-center uppercase font-bold text-2xl`}>Repeatable</h3>
                     <p className={`${jura.className} text-gray-400 text-sm text-center`}>Rely on our algorithms for consistent and repeatable success.</p>
                  </div>
                  {/* Feature 4 - Proprietary */}
                  <div className="p-2 rounded-lg shadow-lg space-y-2 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl">
                     <div className="h-20 w-20 rounded-full mx-auto transition duration-500 ease-in-out transform hover:scale-110">
                        <Image src={Prop} width={500} height={500} alt="Proprietary" />
                     </div>
                     <h3 className={`${staatliches.className} text-gray-200 text-center uppercase font-bold text-2xl`}>Automated</h3>
                     <p className={`${jura.className} text-gray-400 text-sm text-center`}>Benefit from our proprietary technology that trades for you.</p>
                  </div>
                  {/* Feature 5 - Quantitative */}
                  <div className="p-2 rounded-lg shadow-lg space-y-2 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:shadow-2xl">
                     <div className="h-20 w-20 rounded-full mx-auto transition duration-500 ease-in-out transform hover:scale-110">
                        <Image src={Quant} width={500} height={500} alt="Quantitative" />
                     </div>
                     <h3 className={`${staatliches.className} text-gray-200 text-center uppercase font-bold text-2xl`}>Quantitative</h3>
                     <p className={`${jura.className} text-gray-400 text-sm text-center`}>Access quantitative analytics for data-driven decisions.</p>
                  </div>
               </div>
            </div>
         </section>
      </>
   );
};

export default AppPage;
