"use client";

import { useState } from "react";
import { z } from "zod";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Form,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
  FormField,
} from "~/components/ui/form";
import { cn } from "~/lib/utils";
import Spinner from "~/components/common/Spinner";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

const loginSchema = z.object({
  tran_id: z
    .string({
      required_error: "Access code is required",
      invalid_type_error: "Invalid access code",
    })
    .min(1, "Access code is required")
    .trim(),
});

export default function LoginForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const searchParams = useSearchParams();
  const error = searchParams.has("error") && searchParams.get("error");

  const form = useForm({
    defaultValues: {
      tran_id: "",
    },
    resolver: zodResolver(loginSchema),
  });

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
        <Form {...form}>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="tran_id"
              disabled={isLoading}
              render={({ field, fieldState }) => (
                <FormItem className="grid gap-1">
                  <FormLabel className="sr-only" htmlFor="tran_id">
                    Access Code
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="tran_id"
                      placeholder="abcdefghij*****"
                      type="text"
                      autoCapitalize="none"
                      autoComplete="tran_id"
                      autoCorrect="off"
                      name="tran_id"
                      {...field}
                    />
                  </FormControl>
                  {!!error ||
                    (fieldState.invalid && (
                      <FormMessage className="text-destructive text-sm">
                        {error || fieldState.error?.message}
                      </FormMessage>
                    ))}
                </FormItem>
              )}
            />
            <Button disabled={isLoading}>
              {isLoading && <Spinner className="mr-2 h-4 w-4 animate-spin" />}
              Log In
            </Button>
          </div>
        </Form>
      </form>
    </div>
  );
}
