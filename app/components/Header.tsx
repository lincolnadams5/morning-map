'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  return (
    <header>
      <Link className="brand" href="/" aria-label="Morning Map home">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.15" strokeLinecap="round" strokeLinejoin="round"><path d="M20 15.57V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 1.414-.586" /><path d="M8 4v16M12 4v16M16 4v16M4 8h16M4 12h16M4 16h16" /></svg>
        Morning Map
      </Link>
      {pathname !== '/' && (
        <Link className="home-link" href="/">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true"><path d="m3 10 9-7 9 7M5 9v12h5v-7h4v7h5V9" /></svg>
          Home
        </Link>
      )}
    </header>
  );
}
