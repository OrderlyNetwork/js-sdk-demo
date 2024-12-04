import type { Metadata } from "next";
import OrderlyProvider from "@/components/orderlyProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Orderly SDK template",
  description: "Orderly SDK template",
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
        <OrderlyProvider>{children}</OrderlyProvider>
      </body>
    </html>
  );
}
