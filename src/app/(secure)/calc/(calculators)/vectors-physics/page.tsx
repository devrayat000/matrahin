"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import VectorDisplay from "~/components/project/vector/VectorDisplay";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import Vector from "~/lib/vector";
import BasicVectorCalcultor from "./comonents/basic";
import AdvancedVectorCalculator from "./comonents/advanced";

const vectorSchema = z.object({
  a: z.tuple([
    z.string().transform(Number),
    z.string().transform(Number),
    z.string().transform(Number),
  ]),
  b: z.tuple([
    z.string().transform(Number),
    z.string().transform(Number),
    z.string().transform(Number),
  ]),
});

interface VectorResults {
  angle: number;
  resultantA: number;
  resultantB: number;
  dot: number;
  cross: Vector;
  add: Vector;
  sub: Vector;
}

export default function VectorPage() {
  const [result, setResult] = useState<VectorResults>();
  const form = useForm({
    defaultValues: {
      a: [0, 0, 0],
      b: [0, 0, 0],
    },
    resolver: zodResolver(vectorSchema),
  });

  function calculate(data: { a: number[]; b: number[] }) {
    const vecA = new Vector(data.a),
      vecB = new Vector(data.b);

    const dot = Vector.dot(vecA, vecB);
    const cross = Vector.cross(vecA, vecB);
    const add = Vector.add(vecA, vecB);
    const sub = Vector.sub(vecA, vecB);
    const resultantA = Vector.len(vecA);
    const resultantB = Vector.len(vecB);
    const angle = Math.acos(dot / (resultantA * resultantB));

    setResult({
      add,
      sub,
      dot,
      cross,
      resultantA,
      resultantB,
      angle: angle * (180 / Math.PI),
    });
  }

  useEffect(() => {
    console.log(result);
  }, [result]);

  return (
    <div>
      <h1 className="text-center text-4xl py-3 mt-3 text-primary font-bold leading-8 text-gray-900 ">
        Vector Calculation
      </h1>
      <div className="mt-4">
        <Tabs defaultValue="basic" className="mt-5">
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
      </div>
    </div>
  );
}
