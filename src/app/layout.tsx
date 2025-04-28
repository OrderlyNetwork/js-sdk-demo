import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/components/orderlyProvider/appProvider";

export const metadata: Metadata = {
  title: "Orderly SDK DMM",
  description: "Orderly SDK DMM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/favicon.png" />
      </head>
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
