import type { Metadata } from "next";
import { Montserrat, Geist } from "next/font/google";
import "./globals.css";
import Header from "./components/Header";
import Footer from "./components/Footer";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"], // choose weights as needed
});

export const metadata: Metadata = {
  title: "Tuhin Ghosh | Portfolio",
  description: "Portfolio website built with Next.js",
  openGraph: {
    title: "Designing and developing with purpose",
    description:
      "Hi, I'm Tuhin, a frontend developer crafting interactive and engaging web experiences.",
    url: "https://tuhindev.me",
    siteName: "Tuhin Ghosh Portfolio",
    images: [
      {
        url: "https://tuhindev.me/images/generated-image.png",
        width: 1200,
        height: 630,
        alt: "Tuhin Ghosh Portfolio Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
      <body
        className={montserrat.variable}
      >
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
