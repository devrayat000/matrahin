"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import AdvancedRainCalculator from "./component/advanced";
import BasicRainCalculator from "./component/basic";

export default function RainManPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <div>
      <h1 className="text-center text-4xl py-3 mt-3 text-primary font-bold leading-8 text-gray-900 ">
        Rain Umbrella Problem
      </h1>
      <div className="mt-4">
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
      </div>
    </div>
  );
}
