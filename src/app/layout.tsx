import "../index.css";
import { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import logo from "~/assets/logo.png";
import Link from "next/link";
import Image from "next/image";
import MainNav from "./(main)/MainNav";
import UserNav from "./(main)/UserNav";
import MainDrawer from "./(main)/MainDrawer";

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
  category: "EdTech",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const session = await auth();

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        {/* <Session session={session}>{children}</Session> */}
        <header className="border-b w-full sticky top-0 z-50 bg-background/80 backdrop-blur-md">
          <div className="flex h-16 justify-between items-center px-8">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image src={logo} alt="Matrahin" width={44} height={44} />
            </Link>
            <div className="hidden sm:flex">
              <MainNav className="mx-6" />
            </div>
            <div className="hidden sm:flex items-center">
              <UserNav />
            </div>
            <MainDrawer />
          </div>
        </header>
        {children}
        <GoogleAnalytics gaId={process.env.GOOGLE_TAG} />
      </body>
    </html>
  );
}
