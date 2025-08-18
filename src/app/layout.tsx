import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import { Header } from "../modules/header/ui/Header";
import "./globals.css";

export const metadata: Metadata = {
	title: "Sephiria",
	description: "Sephiria wiki",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="ko" suppressHydrationWarning>
			<body>
				<ThemeProvider
					attribute="class"
					defaultTheme="dark"
					enableSystem
					disableTransitionOnChange
				>
					<Header />
					{children}
				</ThemeProvider>
			</body>
		</html>
	);
}
