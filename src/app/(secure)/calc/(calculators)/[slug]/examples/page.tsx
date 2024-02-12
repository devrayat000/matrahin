import { YouTubeEmbed } from "@next/third-parties/google";
import Image from "next/image";
import { use } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

import { getExamples } from "~/services/graphql/example";

export default function ExamplePage({
  params: { slug },
}: {
  params: { slug: string };
}) {
  const { product } = use(getExamples({ slug }));

  return (
    <div className="container">
      <h1 className="text-5xl text-center font-bold">{product.name}</h1>

      <div className="mt-2 container max-w-4xl mx-auto">
        {product.tutorial && (
          <div>
            <h4 className="text-3xl font-medium">Theory</h4>
            <div className="mt-3">
              <YouTubeEmbed
                videoid={new URL(product.tutorial).searchParams.get("v")}
              />
            </div>
          </div>
        )}

        <div className="mt-6">
          <h4 className="text-3xl font-medium">Examples</h4>
          <Accordion
            type="multiple"
            className="mt-5 list-image-check-circle flex flex-col gap-2"
          >
            {product.examples.map((example) => {
              return (
                <AccordionItem
                  key={example.id}
                  value={example.id}
                  className="px-8 rounded-xl border-2 border-border"
                >
                  <AccordionTrigger>
                    <Image
                      src={example.question.src}
                      width={320 * 2}
                      height={480 * 2}
                      alt="Question"
                    />
                  </AccordionTrigger>
                  <AccordionContent className="flex gap-1 items-start">
                    {example.answers.map((answer) => {
                      return (
                        <article
                          key={answer.src}
                          className="p-1 bg-slate-300 w-fit"
                        >
                          <Image
                            src={answer.src}
                            width={320 * 2}
                            height={480 * 2}
                            alt="Question"
                          />
                        </article>
                      );
                    })}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        </div>
      </div>
    </div>
  );
}
