/* FIXED: Optimized fonts and global state management (Problem 4, 12) */
import { Syne, DM_Sans, DM_Mono } from "next/font/google";
import "./globals.css";
import { UserProvider } from "@/context/UserContext";
import { ProgressProvider } from "@/app/Providers";
import { SWRConfig } from 'swr';

const syne = Syne({
  subsets: ["latin"],
  weight: ['400','500','600','700','800'],
  variable: '--font-syne',
  display: 'swap',
  preload: true,
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ['300','400','500'],
  variable: '--font-dm',
  display: 'swap',
  preload: true,
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ['400','500'],
  variable: '--font-dm-mono',
  display: 'swap',
  preload: false,
});

export const metadata = {
  title: "JEE Sprint Dashboard",
  description: "Track your JEE preparation progress",
};

/* FIXED: Removed unnecessary BackgroundEffects for maximum performance (Cleanup) */
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${syne.variable} ${dmSans.variable} ${dmMono.variable}`}>
      <body className="font-dm min-height-screen">
        {/* FIXED: Refined SWR config for better reliability (Bug fix) */}
        <SWRConfig value={{
          revalidateOnFocus: false,
          dedupingInterval: 60000,
        }}>
          <ProgressProvider>
            <UserProvider>
              {children}
            </UserProvider>
          </ProgressProvider>
        </SWRConfig>
      </body>
    </html>
  );
}
