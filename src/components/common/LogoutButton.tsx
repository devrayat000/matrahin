"use client";

import { forwardRef } from "react";
import { Button, ButtonProps } from "../ui/button";
import { signOut } from "next-auth/react";

const LogOutButton = forwardRef<
  HTMLButtonElement,
  ButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ onClick, ...props }, ref) => {
  function clickHandler(e: React.MouseEvent<HTMLButtonElement>) {
    onClick?.(e);
    return signOut({ callbackUrl: "/login", redirect: true });
  }

  return (
    <Button variant="destructive" {...props} ref={ref} onClick={clickHandler} />
  );
});

export default LogOutButton;
