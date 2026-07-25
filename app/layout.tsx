import type { Metadata } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const body = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://pikecodash.vercel.app"),
  title: "Pike County Dashboard — Kentucky's Largest County, Live",
  description:
    "An open civic dashboard for Pike County, Kentucky — live air, river, and weather feeds, schools, health, watersheds, and an interactive map of the whole county.",
  openGraph: {
    title: "Pike County Dashboard",
    description:
      "Kentucky's largest county, live — air, river, weather, schools, health, watersheds, and an interactive map.",
    url: "https://pikecodash.vercel.app",
    siteName: "Pike County Dashboard",
    images: [{ url: "/og.png", width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Pike County Dashboard",
    description:
      "Kentucky's largest county, live — an open civic data dashboard.",
    images: ["/og.png"],
  },
};

// Applies the saved theme before first paint to avoid a flash.
const themeInit = `try{var t=localStorage.getItem("pike-theme");if(t)document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
