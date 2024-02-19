"use client";

import dynamic from "next/dynamic";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

const BasicVectorCalcultor = dynamic(() => import("./comonents/basic"), {
  ssr: false,
});
// import BasicVectorCalcultor from "./comonents/basic";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Spinner from "~/components/common/Spinner";
import AdvancedVectorCalculator from "./comonents/advanced";
import Animated from "../../Animated";

function VectorTabs() {
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
        <BasicVectorCalcultor />
      </TabsContent>
      <TabsContent value="advanced">
        <AdvancedVectorCalculator />
      </TabsContent>
    </Tabs>
  );
}

export default function VectorPage() {
  return (
    <Animated>
      <h1 className="text-center text-4xl py-3 mt-3 text-primary font-bold leading-8 text-gray-900 ">
        Vector Calculation
      </h1>
      <div className="mt-4">
        <Suspense fallback={<Spinner />}>
          <VectorTabs />
        </Suspense>
      </div>
    </Animated>
  );
}
