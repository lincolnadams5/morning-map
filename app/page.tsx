import type { Metadata } from 'next';
import MorningMap from './MorningMap';

export const metadata: Metadata = {
  title: 'Morning Map — Take control of your morning',
  description: 'Turn your arrival time into a morning plan.',
  icons: { icon: '/morning-map/logo.svg' },
};

export default function Page() {
  return <MorningMap />;
}
