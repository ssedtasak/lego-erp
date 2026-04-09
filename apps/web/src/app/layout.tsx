import type { Metadata } from 'next';
import './globals.css';
import { ErrorBoundaryClient } from '@/components/ErrorBoundaryClient';

export const metadata: Metadata = {
  title: 'LEGO ERP - Stock Dashboard',
  description: 'Restaurant ingredient stock management system',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className="bg-gray-50 text-gray-900">
        <ErrorBoundaryClient>
          {children}
        </ErrorBoundaryClient>
      </body>
    </html>
  );
}
