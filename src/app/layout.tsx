import type { Metadata } from "next";
import localFont from "next/font/local";
import { ThemeProvider } from "next-themes";
import { Header } from "../modules/header/ui/Header";
import "./globals.css";
import Script from "next/script";
import { useId } from "react";
import { Toaster } from "sonner";
import QueryProvider from "../shared/providers/theme/QueryProvider";

const font = localFont({
	src: "./fonts/Galmuri9.woff2",
	display: "swap",
});

export const metadata: Metadata = {
	metadataBase: new URL("https://sephiria.wiki"),
	title: "세피리아 위키",
	description: "세피리아 정보 사이트",
	keywords: [
		"세피리아",
		"세피리아위키",
		"세피리아 기적",
		"세피리아 아티팩트",
		"세피리아 아이템",
		"세피리아 코스튬",
		"세피리아 무기",
		"세피리아 석판",
		"세피리아 시뮬레이터",
		"세피리아 공략",
	],
	creator: "WolfDog",
	icons: {
		icon: "/favicon.ico",
	},
	openGraph: {
		title: "세피리아 위키",
		description: "세피리아의 모든 것",
		url: "https://sephiria.wiki",
		siteName: "세피리아위키",
		locale: "ko_KR",
		type: "website",
		images: [
			{
				url: "https://sephiria.wiki/thumbnail.png",
				width: 400,
				height: 220,
				alt: "세피리아 메인 이미지",
			},
		],
	},
	alternates: {
		canonical: "/",
	},
	other: {
		"google-adsense-account": "ca-pub-3851224465271826",
		"naver-site-verification": "86fdf6f8f06302154e669f26d571f603adfa70fb",
		"google-site-verification": "fA9mrqAmKoNPLkgu1Ac1G3TlW3HnsmKlJ_qClW2MRXM",
	},
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const id = useId();
	return (
		<html lang="ko" className={font.className} suppressHydrationWarning>
			<head>
				<link
					rel="preconnect"
					as="image"
					href="https://sephiria.wiki/sephiria.webp"
					crossOrigin="anonymous"
				/>
				<script type="application/ld+json">
					{`
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "세피리아 위키",
              "url": "https://sephiria.wiki"
            }
          `}
				</script>
			</head>
			<body>
				<QueryProvider>
					<ThemeProvider
						attribute="class"
						defaultTheme="dark"
						enableSystem
						disableTransitionOnChange
					>
						<Header />
						{children}
						<Toaster />
					</ThemeProvider>
				</QueryProvider>

				<Script
					async
					src="https://www.googletagmanager.com/gtag/js?id=G-4NXKD5DESM"
				></Script>
				<Script id={id}>
					{`
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
					
						gtag('config', 'G-4NXKD5DESM');
					`}
				</Script>
			</body>
		</html>
	);
}
