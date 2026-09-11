import type { Metadata } from "next"
import { Fraunces, Inter, DM_Mono } from "next/font/google"
import "./globals.css"

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-fraunces",
})
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
})
const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-dm-mono",
})

export const metadata: Metadata = {
  title: "Morning Map",
  description: "Turn your arrival time into a morning plan.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable} ${dmMono.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
