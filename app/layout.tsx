import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Image from "next/image";
import Logo_pokedex from "./images/pokedex_logo.png";
import "./styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pokedex",
  description: "Colección de pokemones",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Image className="mx-auto p-2 hover:scale-105 transform transition-all duration-500" src={Logo_pokedex} alt="Pikachu" />
        {children} 
        <footer className="bg-gray-800 text-white pt-1 p-1 text-center static bottom-0 w-full">
          <p>Hecho por Anubis</p>
        </footer>
        </body>
    </html>
  );
}
