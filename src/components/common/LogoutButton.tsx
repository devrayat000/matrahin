"use client";

import { forwardRef } from "react";
import { Button, ButtonProps } from "../ui/button";
import { signOut } from "next-auth/react";
import { revalidateTag } from "next/cache";

const LogOutButton = forwardRef<
  HTMLButtonElement,
  ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ onClick, ...props }, ref) => {
  function clickHandler(e: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(e);
    // revalidateTag("login");
    return signOut({ callbackUrl: "/login", redirect: true });
  }

  return (
    <Button variant="destructive" {...props} ref={ref} onClick={clickHandler} />
  );
});

export default LogOutButton;
