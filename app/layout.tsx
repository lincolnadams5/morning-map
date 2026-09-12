import type { Metadata } from "next"
import { Fraunces, Inter } from "next/font/google"
import "./globals.css"
import { MorningMapProvider } from "./context/morning-map-context"
import AppShell from "./components/AppShell"

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

export const metadata: Metadata = {
  title: "Morning Map — Take control of your morning",
  description: "Turn your arrival time into a morning plan.",
  icons: { icon: "/morning-map/logo.svg" },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${inter.variable}`}
    >
      <body>
        <MorningMapProvider>
          <AppShell>{children}</AppShell>
        </MorningMapProvider>
      </body>
    </html>
  )
}
