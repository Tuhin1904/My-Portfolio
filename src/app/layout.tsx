import type { Metadata } from "next";
import { Montserrat, Geist } from "next/font/google";
import "./global.css";
import Header from "@/components/common/Header";
import dynamic from 'next/dynamic';
import { cn } from "@/lib/utils";
import StorePersistProvider from "@/providers/StorePersistProvider";

const Footer = dynamic(() => import("@/components/common/Footer"));
import ThemeSync from "@/components/common/ThemeSync";

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });
const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Tuhin Ghosh | Portfolio",
  description: "Portfolio website built with Next.js",
  openGraph: {
    title: "Designing and developing with purpose",
    description: "Hi, I'm Tuhin, a frontend developer crafting interactive and engaging web experiences.",
    url: "https://tuhindev.me",
    siteName: "Tuhin Ghosh Portfolio",
    images: [{ url: "https://tuhindev.me/images/dynamic-portfolio.png", width: 1200, height: 630, alt: "Tuhin Ghosh Portfolio Preview" }],
    locale: "en_US",
    type: "website",
  }
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)} data-theme="dark">
      <body className={montserrat.variable}>
        <StorePersistProvider>
          <ThemeSync />
          <Header />
          <main>{children}</main>
          <Footer />
        </StorePersistProvider>
      </body>
    </html>
  );
}
