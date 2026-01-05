import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Navigation from '@/components/navigation/Navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Intelligent Journal - Your Personal Growth Companion',
  description: 'A premium journaling application for mindful living and personal growth',
  viewport: 'width=device-width, initial-scale=1.0, viewport-fit=cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col md:flex-row min-h-screen">
          <Navigation />
          <div className="flex-1 w-full pt-16 md:pt-0">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
