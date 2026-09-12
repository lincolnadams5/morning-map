'use client';

import { useEffect, useRef, type ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Footer from './Footer';

export default function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const screen = pathname === '/' ? 'home' : pathname.slice(1);
  const mainRef = useRef<HTMLElement>(null);

  useEffect(() => {
    mainRef.current?.focus({ preventScroll: true });
    window.scrollTo(0, 0);
  }, [screen]);

  return (
    <div className="morning-map" data-screen={screen}>
      <Header />
      <main ref={mainRef} tabIndex={-1}>{children}</main>
      <Footer />
    </div>
  );
}
