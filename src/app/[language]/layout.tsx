import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { getLocale, type LocaleParams } from "@/i18n/server";
import { I18nProvider } from "@/i18n/context";
import Script from 'next/script';

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

const domain = process.env.NEXT_PUBLIC_SITE_DOMAIN || "";

export const metadata: Metadata = {
	metadataBase: domain ? new URL(`https://${domain}`) : undefined,
	title: {
		template: "%s",
		default: "Personal Homepage",
	},
};

export function generateStaticParams() {
	return locales.map((locale) => ({ language: locale }));
}

export default async function RootLayout({
	children,
	params,
}: Readonly<{
	children: React.ReactNode;
	params: LocaleParams;
}>) {
	const locale = await getLocale(params);
	const dict = getDictionary(locale);

	return (
		<html
			lang={locale}
			className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
			<body className='relative'>
				<I18nProvider
					locale={locale}
					dictionary={dict}>
					{children}
				</I18nProvider>

				<Script
					//umami分析脚本
					src='https://uliezier-umami.hf.space/script.js'
					data-website-id='c5abd88b-1f55-4490-9325-569ee690c5c8'
					strategy='afterInteractive'
				/>
			</body>
		</html>
	);
}
