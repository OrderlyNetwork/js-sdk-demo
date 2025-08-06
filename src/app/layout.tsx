import type { Metadata } from "next";
import "./globals.css";
import { AppProvider } from "@/components/orderlyProvider/appProvider";
import { ClientRoute } from "@/components/ClientRoute";

export const metadata: Metadata = {
  title: "Orderly SDK Demo",
  description: "Orderly SDK Demo",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/img/favicon.png" />
      </head>
      <body>
        <ClientRoute>
          <AppProvider>{children}</AppProvider>
        </ClientRoute>
      </body>
    </html>
  );
}
