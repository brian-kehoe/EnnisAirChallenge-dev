import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Ennis Air Challenge',
  description: 'Can you find a town with worse air than Ennis?',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
