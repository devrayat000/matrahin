import Image from "next/image";
import { use } from "react";

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

      <div className="mt-2">
        <h4 className="text-3xl font-medium">Examples</h4>
        <ul className="flex flex-col gap-y-3">
          {product.examples.map((example) => (
            <li key={example.id}>
              <Image
                src={example.question.src}
                width={320}
                height={480}
                alt="Question"
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
