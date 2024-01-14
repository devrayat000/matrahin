import "../index.css";
import "~/lib/globals";
import Session from "./Session";
import { auth } from "~/lib/auth";
import { Metadata } from "next";
import logo from "~/assets/logo.png";

export const metadata: Metadata = {
  appleWebApp: { capable: true, title: "Matrahin" },
  applicationName: "Matrahin",
  authors: [{ name: "Matrahin Team" }],
  formatDetection: { email: true },
  generator: "Next.js",
  icons: logo.src,
  keywords: [
    "matrahin",
    "matrahin.com",
    "calculator",
    "physics",
    "simulation",
    "education",
    "learning",
    "edu",
  ],
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <Session session={session}>{children}</Session>
      </body>
    </html>
  );
}
