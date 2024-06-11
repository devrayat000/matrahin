import { Suspense } from "react";
import Link from "next/link";
import { Metadata } from "next";

import LoginForm from "./LoginForm";
import login from "~/assets/seo/login.jpeg";

const title = "Login - Matrahin";
const description =
  "Login wth matrahin to get started. Enter your ACS HSC 25 physics cycle's access code to gain access to this website.";
const url = new URL("https://matrahin.com/login");

export const metadata: Metadata = {
  title: title,
  description: description,
  openGraph: {
    type: "website",
    description: description,
    images: [
      {
        url: login.src,
        alt: title,
      },
    ],
    title: title,
    url: url,
  },
  alternates: { canonical: url },
  metadataBase: url,
};

export default function LoginPage() {
  return (
    <div className="container relative lg:h-[calc(100vh-10rem)] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 mt-auto">
          {/* <blockquote className="gap-y-2">
            <p className="text-lg">
              &ldquo;This library has saved me countless hours of work and
              helped me deliver stunning designs to my clients faster than ever
              before.&rdquo;
            </p>
            <footer className="text-sm">Sofia Davis</footer>
          </blockquote> */}
        </div>
      </div>
      <div className="lg:p-8 pt-36 lg:pt-12">
        <div className="mx-auto flex w-full flex-col justify-center gap-y-6 sm:w-[350px]">
          <div className="flex flex-col gap-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome Back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your ACS HSC 25 physics cycle's access code to gain access
              to this website.
            </p>
          </div>
          <Suspense>
            <LoginForm />
          </Suspense>
          <p className="px-8 text-center text-sm text-muted-foreground">
            By clicking continue, you agree to our{" "}
            <Link
              href="/terms"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
