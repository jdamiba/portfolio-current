import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import "@/app/styles/prism-custom.css";
import { Header } from "./components/Header";
const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export const metadata: Metadata = {
  title: "Joseph Damiba | Senior Full-Stack Engineer",
  description:
    "Senior software engineer with 6 years of experience specializing in full-stack development with Next.js, React, and Node.js.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} antialiased`}
    >
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
