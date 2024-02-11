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
        <h4 className="text-3xl font-medium">Examples</h4>
        <Accordion
          type="multiple"
          className="mt-5 list-image-check-circle"
          asChild
        >
          <ul>
            {product.examples.map((example) => {
              return (
                <AccordionItem key={example.id} value={example.id} asChild>
                  <li>
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
                  </li>
                </AccordionItem>
              );
            })}
          </ul>
        </Accordion>
      </div>
    </div>
  );
}
