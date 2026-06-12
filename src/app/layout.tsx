import type { Metadata } from "next";
import { Space_Grotesk, IBM_Plex_Mono, Newsreader } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import GridOverlay from "@/components/GridOverlay";
import { themeInitScript } from "@/lib/themes";

const grotesk = Space_Grotesk({
  variable: "--font-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const plex = IBM_Plex_Mono({
  variable: "--font-plex",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["italic"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Neeraj Kulkarni - Digital Workshop",
  description:
    "The workshop, lab notebook, and digital garden of Neeraj Kulkarni - a fullstack engineer who builds things to understand them.",
  keywords: [
    "Neeraj Kulkarni",
    "fullstack engineer",
    "portfolio",
    "digital garden",
    "lab notebook",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${grotesk.variable} ${plex.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        {/* applies the saved console theme before first paint */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript() }} />
        <SmoothScroll>
          {children}
          <Cursor />
          <GridOverlay />
        </SmoothScroll>
      </body>
    </html>
  );
}
