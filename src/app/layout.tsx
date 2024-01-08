import "../index.css";
import "~/lib/globals";
import Session from "./Session";
import { auth } from "~/lib/auth";

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
