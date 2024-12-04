import "./globals.css";

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
      <body className={`${inter.className} bg-darkBg`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
