import type {Metadata} from "next";
import {Inter} from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
	title: "nrush",
	description: "A speedy way to update all packages in a Node/Bun project, written in Rust.",
	authors: [
		{
			name: "Omar Zunic",
			url: "https://omarzunic.com?utm_source=nrush"
		}
	]
};

export default function RootLayout({
	                                   children,
                                   }: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
		<body className={inter.className}>
		<Script defer data-domain="nrush.omarzunic.com" src="https://analytics.omarzunic.com/js/script.js"></Script>
		<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet"/>
		{children}
		</body>
		</html>
	);
}

