import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

export default function FAQ() {
  return (
    <section id="faq" className="container">
      <h3 className="text-center text-3xl font-bold py-10">
        Frequently Asked Questions
      </h3>

      <Accordion
        type="single"
        collapsible
        className="w-full mt-4 flex flex-col gap-2"
      >
        <AccordionItem
          value="item-1"
          className="px-8 rounded-xl border border-border"
        >
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>
            Yes. It adheres to the WAI-ARIA design pattern.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="item-2"
          className="px-8 rounded-xl border border-border"
        >
          <AccordionTrigger>Is it styled?</AccordionTrigger>
          <AccordionContent>
            Yes. It comes with default styles that matches the other
            components&apos; aesthetic.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem
          value="item-3"
          className="px-8 rounded-xl border border-border"
        >
          <AccordionTrigger>Is it animated?</AccordionTrigger>
          <AccordionContent>
            Yes. It&apos;s animated by default, but you can disable it if you
            prefer.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </section>
  );
}
