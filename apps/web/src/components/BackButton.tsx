'use client';

import Link from 'next/link';

type BackButtonProps = {
  href?: string;
  children?: React.ReactNode;
};

export default function BackButton({ href = '/', children = '← กลับ' }: BackButtonProps) {
  return (
    <Link
      href={href}
      className="inline-flex items-center px-4 py-2 text-primary-600 hover:text-primary-700 font-medium"
    >
      {children}
    </Link>
  );
}
