import type { Metadata } from "next";
import { appTargetConfig } from "@/components/orderlyConfig/appTargetConfig";
import { AppProvider } from "@/components/orderlyProvider/appProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: appTargetConfig.title,
  description: appTargetConfig.description,
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
