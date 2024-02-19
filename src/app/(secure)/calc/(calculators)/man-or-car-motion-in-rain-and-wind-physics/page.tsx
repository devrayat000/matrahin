"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import AdvancedRainCalculator from "./component/advanced";
import BasicRainCalculator from "./component/basic";
import { Suspense } from "react";
import Spinner from "~/components/common/Spinner";
import Animated from "../../Animated";
import { textAppear } from "~/lib/animations";

function RainManTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Tabs
      defaultValue="basic"
      className="mt-5"
      value={searchParams.get("tab") || "basic"}
      onValueChange={(val) => router.push(`?tab=${val}`)}
    >
      <TabsList className="grid w-3/4 mx-auto grid-cols-2">
        <TabsTrigger value="basic">Basic</TabsTrigger>
        <TabsTrigger value="advanced">Advanced</TabsTrigger>
      </TabsList>
      <TabsContent value="basic">
        <BasicRainCalculator />
      </TabsContent>
      <TabsContent value="advanced">
        <AdvancedRainCalculator />
      </TabsContent>
    </Tabs>
  );
}

export default function RainManPage() {
  return (
    <Animated>
      <motion.h1
        variants={textAppear}
        className="text-center text-4xl py-3 mt-3 text-primary font-bold leading-8 text-gray-900 "
      >
        Rain Umbrella Problem
      </motion.h1>
      <div className="mt-4">
        <Suspense fallback={<Spinner />}>
          <RainManTabs />
        </Suspense>
      </div>
    </Animated>
  );
}
