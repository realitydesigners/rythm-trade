import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navbar from '@/components/ui/Navbar';
import { ClerkProvider } from '@clerk/nextjs';

export const metadata: Metadata = {
   title: 'RYTHM - High Precision Algorithmic Trading',
   description: 'A geometrical trading model inspired by fractal mathematics and multi-dimensional time series.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
   return (
      <ClerkProvider>
         <html lang="en">
            <body className="bg-black">
               <Navbar />
               <div className="pt-12">{children}</div>
            </body>
         </html>
      </ClerkProvider>
   );
}
