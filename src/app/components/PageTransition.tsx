"use client";

import { usePathname } from 'next/navigation';
import React from 'react';

type Props = {
  children: React.ReactNode;
};

export default function PageTransition({ children }: Props) {
  const pathname = usePathname();
  return (
    <div key={pathname} className="page-transition">
      {children}
    </div>
  );
}


