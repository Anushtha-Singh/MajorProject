import "./globals.css";

export const metadata = {
  title: "Yojna Saathi — Your Gateway to Government Schemes",
  description: "Discover, understand, and apply for 3500+ Indian government schemes in your own language. Multilingual AI chatbot assistant for citizens.",
  keywords: ["government schemes", "yojna saathi", "sarkari yojana", "PM schemes", "India", "multilingual"],
  manifest: "/manifest.json",

  icons: {
    icon: "/icons/icon-192.png",
    apple: "/icons/icon-192.png",
  },
  openGraph: {
    title: "Yojna Saathi — Your Gateway to Government Schemes",
    description: "Discover 3500+ Indian government schemes. Multilingual AI assistant.",
    type: "website",
    locale: "en_IN",
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0271BC',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0271BC" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="Yojna Saathi" />
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
