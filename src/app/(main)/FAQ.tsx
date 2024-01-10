import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

const faqs = [
  {
    question: "Is it free?",
    answer:
      "1. Is it free? Yes, Our initial version is free of cost but in future we may offer paid services.",
  },
  {
    question: "How can I login?",
    answer:
      'You can login by using the access code given  to you by ASG shop after purchase. Use "code" for 100% off on our product on ASG shop page.',
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="container py-12 sm:py-16">
      <h3 className="text-center text-3xl font-bold py-10">
        Frequently Asked Questions
      </h3>

      <Accordion
        type="single"
        collapsible
        className="w-full mt-4 flex flex-col gap-2"
      >
        {faqs.map((faq) => (
          <AccordionItem
            key={faq.question}
            value={faq.question}
            className="px-8 rounded-xl border border-border"
          >
            <AccordionTrigger>{faq.question}</AccordionTrigger>
            <AccordionContent>{faq.answer}</AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}
