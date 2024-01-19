import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './globals.css';
import clsx from 'clsx';

const montserrat = Montserrat({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Test App',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={clsx(montserrat.className, 'bg-bg')}><main>{children}</main></body>
    </html>
  );
}
