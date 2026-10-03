import type { Metadata, Viewport } from "next";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import PWAInstallPrompt from "@/components/PWAInstallPrompt";
import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import NotificationSubscriber from "@/components/NotificationSubscriber";

const fredoka = Fredoka({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-fredoka",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-nunito",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "DAAN IITG — Dakshana Alumni Network",
    template: "%s | DAAN IITG",
  },
  description:
    "DAAN IITG is the official alumni network of Dakshana Scholars at IIT Guwahati. Connect with fellow scholars, explore achievements, events, and stay updated with the DAAN community.",
  keywords: [
    "DAAN IITG",
    "Dakshana Alumni Network",
    "IIT Guwahati",
    "Dakshana Foundation",
    "Dakshana Scholars",
    "DAAN",
    "alumni network",
    "IIT alumni",
    "JEE scholars",
  ],
  authors: [{ name: "DAAN IITG" }],
  creator: "DAAN IITG",
  publisher: "DAAN IITG",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://daaniitg.com"
  ),
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "/",
    siteName: "DAAN IITG",
    title: "DAAN IITG — Dakshana Alumni Network",
    description:
      "Official alumni network of Dakshana Scholars at IIT Guwahati.",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "DAAN IITG" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "DAAN IITG — Dakshana Alumni Network",
    description: "Official alumni network of Dakshana Scholars at IIT Guwahati.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#FF6B35",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable}`}>
      <body className="bg-cream font-nunito antialiased">
        {children}
        <Toaster
          position="top-right"
          toastOptions={{
            className:
              "!bg-white !border-2 !border-navy !shadow-cartoon !font-nunito !text-navy",
            duration: 4000,
          }}
        />
        <PWAInstallPrompt />
        <ServiceWorkerRegistration />
        <NotificationSubscriber />
      </body>
    </html>
  );
}
