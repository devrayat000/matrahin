"use client";

import * as React from "react";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "~/lib/utils";

const TabsContext = React.createContext(null);

const Tabs = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>
>(({ value, onValueChange, ...props }, ref) => {
  const [tab, setTab] = React.useState<string>(value);

  return (
    <TabsContext.Provider value={{ tab }}>
      <TabsPrimitive.Root
        value={value}
        onValueChange={(newTab) => {
          setTab(newTab);
          onValueChange?.(newTab);
        }}
        {...props}
        ref={ref}
      />
    </TabsContext.Provider>
  );
});

const useTabsScope = TabsPrimitive.createTabsScope();

export const useTabs = (): { tab: string } => {
  const val = useTabsScope({
    [TabsPrimitive.createTabsScope.scopeName]: [TabsContext],
  });
  return React.useContext(val["__scopeTabs"]["Tabs"][0]);
};

const TabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = TabsPrimitive.List.displayName;

const TabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger>
>(({ className, style, children, value, ...props }, ref) => {
  const { tab } = useTabs();

  return (
    <TabsPrimitive.Trigger
      ref={ref}
      className={cn(
        "relative inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:text-foreground",
        className
      )}
      style={{
        transformStyle: "preserve-3d",
        ...style,
      }}
      value={value}
      {...props}
    >
      {tab === value && (
        <motion.div
          layoutId="clickedbutton"
          transition={{ type: "spring", bounce: 0.3, duration: 0.6 }}
          className="absolute inset-0 bg-background shadow-sm rounded-sm"
        />
      )}
      <span className="relative block">{children}</span>
    </TabsPrimitive.Trigger>
  );
});
TabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

const TabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content>
>(({ className, ...props }, ref) => (
  <TabsPrimitive.Content
    ref={ref}
    className={cn(
      "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
      className
    )}
    {...props}
  />
));
TabsContent.displayName = TabsPrimitive.Content.displayName;

export { Tabs, TabsList, TabsTrigger, TabsContent };
