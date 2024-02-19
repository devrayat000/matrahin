"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { Suspense } from "react";
import Spinner from "~/components/common/Spinner";
import PendulumCalculator from "./component/calculator";
import PendulumSimulation from "./component/simulation";
import Animated from "../../Animated";

function PendulumTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();

  return (
    <Tabs
      defaultValue="calculator"
      className="mt-5"
      value={searchParams.get("tab") || "calculator"}
      onValueChange={(val) => router.push(`?tab=${val}`)}
    >
      <TabsList className="grid w-3/4 mx-auto grid-cols-2">
        <TabsTrigger value="calculator">Calculator</TabsTrigger>
        <TabsTrigger value="simulation">3D Simulation</TabsTrigger>
      </TabsList>
      <TabsContent value="calculator">
        <PendulumCalculator />
      </TabsContent>
      <TabsContent value="simulation">
        <PendulumSimulation />
      </TabsContent>
    </Tabs>
  );
}

export default function PendulumPage() {
  return (
    <Animated>
      <div className="mt-4">
        <Suspense fallback={<Spinner />}>
          <PendulumTabs />
        </Suspense>
      </div>
    </Animated>
  );
}
