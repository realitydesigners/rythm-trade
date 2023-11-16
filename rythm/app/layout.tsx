import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RYTHM - High Precision Algorithmic Trading',
  description:
    'A geometrical trading model inspired by fractal mathematics and multi-dimensional time series.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="bg-black p-2 ">{children}</div>
      </body>
    </html>
  );
}
