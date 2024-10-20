import "./globals.css";

import Header from "@src/components/header/Header";
import { Inter } from "next/font/google";

import Providers from "./providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "EpiQ App",
  description: "Empower your staff. Delight your customers.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex h-screen flex-col`}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  );
}
