import './globals.css';
import type { Metadata } from 'next';
import Navigation from '@/components/navigation/Navigation';
import BohoDecorations from '@/components/ui/BohoDecorations';

export const metadata: Metadata = {
  title: 'Inner Compass - Boho Journal',
  description: 'A beautiful boho-inspired journaling experience for mindful living and personal growth',
  viewport: 'width=device-width, initial-scale=1.0, viewport-fit=cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* Animated Boho Decorations */}
        <BohoDecorations />
        
        <div className="flex flex-col md:flex-row min-h-screen relative z-10">
          <Navigation />
          <div className="flex-1 w-full pt-16 md:pt-0">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
