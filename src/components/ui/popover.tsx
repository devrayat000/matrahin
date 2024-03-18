"use client";

import * as PopoverPrimitive from "@radix-ui/react-popover";
import { X } from "lucide-react";
import { ComponentPropsWithoutRef, ElementRef, forwardRef } from "react";
import { cn } from "~/lib/utils";

const Popover = PopoverPrimitive.Root;

const PopoverPortal = PopoverPrimitive.Portal;

const PopoverTrigger = forwardRef<
  ElementRef<typeof PopoverPrimitive.Trigger>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <PopoverPrimitive.Trigger
    asChild
    ref={ref}
    {...props}
    className={cn(
      "w-[35px] h-[35px] inline-flex items-center justify-center text-violet11 bg-white hover:bg-slate-200 focus:shadow-[0_0_0_2px] focus:shadow-black cursor-pointer outline-none",
      className
    )}
  >
    {children}
  </PopoverPrimitive.Trigger>
));

PopoverTrigger.displayName = PopoverPrimitive.Trigger.displayName;

const PopoverClose = forwardRef<
  ElementRef<typeof PopoverPrimitive.Close>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Close>
>(({ className, children, ...props }, ref) => (
  <PopoverPrimitive.Close
    ref={ref}
    className="rounded-full h-[25px] w-[25px] inline-flex items-center justify-center  absolute top-[5px] right-[5px] hover:bg-red-200 focus:shadow-[0_0_0_2px] focus:shadow-violet7 outline-none cursor-pointer"
    aria-label="Close"
    {...props}
  >
    {children ?? <X />}
  </PopoverPrimitive.Close>
));

PopoverClose.displayName = PopoverPrimitive.Close.displayName;

const PopoverArrow = forwardRef<
  ElementRef<typeof PopoverPrimitive.Arrow>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Arrow>
>(({ className, ...props }, ref) => (
  <PopoverPrimitive.Arrow
    ref={ref}
    className={cn("fill-white", className)}
    {...props}
  />
));

PopoverArrow.displayName = PopoverPrimitive.Arrow.displayName;

const PopoverContent = forwardRef<
  ElementRef<typeof PopoverPrimitive.Content>,
  ComponentPropsWithoutRef<typeof PopoverPrimitive.Content>
>(({ children, className, ...props }, ref) => (
  <PopoverPrimitive.Content
    ref={ref}
    className={cn(
      "rounded mt-5 p-5 w-[260px] bg-popover shadow-[0_10px_38px_-10px_hsla(206,22%,7%,.35),0_10px_20px_-15px_hsla(206,22%,7%,.2)]  will-change-[transform,opacity] data-[state=open]:data-[side=top]:animate-slide-down-and-fade data-[state=open]:data-[side=right]:animate-slide-left-and-fade data-[state=open]:data-[side=bottom]:animate-slide-up-and-fade data-[state=open]:data-[side=left]:animate-slide-right-and-fade",
      className
    )}
    sideOffset={5}
    {...props}
  >
    {children}
  </PopoverPrimitive.Content>
));

PopoverContent.displayName = PopoverPrimitive.Content.displayName;

export {
  Popover,
  PopoverArrow,
  PopoverClose,
  PopoverContent,
  PopoverPortal,
  PopoverTrigger,
};
