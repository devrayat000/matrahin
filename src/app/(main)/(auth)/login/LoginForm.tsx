"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button, buttonVariants } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { cn } from "~/lib/utils";
import Spinner from "~/components/common/Spinner";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export default function LoginForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const error = searchParams.has("error") && searchParams.get("error");

  async function getAccess(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);
    const tran_id = formData.get("tran_id");
    if (!tran_id) return;

    await signIn("access_code", {
      tran_id,
      redirect: true,
      callbackUrl: "/profile",
    });
    setIsLoading(false);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <form onSubmit={getAccess}>
        <div className="grid gap-2">
          <div className="grid gap-1">
            <Label className="sr-only" htmlFor="tran_id">
              Access Code
            </Label>
            <Input
              id="tran_id"
              placeholder="h3tduwtyewuqur*****"
              type="text"
              autoCapitalize="none"
              autoComplete="tran_id"
              autoCorrect="off"
              name="tran_id"
              disabled={isLoading}
            />
            {!!error && <p className="text-destructive text-sm">{error}</p>}
          </div>
          <Button disabled={isLoading}>
            {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
            Log In
          </Button>
        </div>
      </form>
    </div>
  );
}
