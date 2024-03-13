import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";

/**
 * Renders the Results component.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {React.MutableRefObject<HTMLParagraphElement>[][]} props.refs - The references to the HTML paragraph elements.
 * @param {React.MutableRefObject<HTMLParagraphElement>} props.totalKETextRef - The reference to the total KE text element.
 * @param {React.MutableRefObject<HTMLParagraphElement>} props.totalPETextRef - The reference to the total PE text element.
 * @param {Function} props.updateAllTexts - The function to update all texts.
 * @returns {JSX.Element} The rendered Results component.
 */

const Results = ({
  refs, // as m,v,p,kE
  totalKETextRef,
  totalPETextRef,
  updateAllTexts,
}: {
  refs: React.MutableRefObject<HTMLParagraphElement>[][];

  totalKETextRef: React.MutableRefObject<HTMLParagraphElement>;
  totalPETextRef: React.MutableRefObject<HTMLParagraphElement>;
  updateAllTexts: (count: number) => void;
}): JSX.Element => {
  const params = (i: number) => [
    { label: `M`, ref: refs[i - 1][0], unit: "kg" },
    { label: `V`, ref: refs[i - 1][1], unit: "m/s" },
    { label: `P`, ref: refs[i - 1][2], unit: "kgm/s" },
    { label: `KE`, ref: refs[i - 1][3], unit: "J" },
  ];

  return (
    <div
      style={{
        fontFamily: "consolas",
      }}
      className="flex flex-col justify-between items-center    "
    >
      <div className="flex flex-row sm:flex-col  justify-between items-start  w-full gap-2 m-1   ">
        {/* Object 1 */}
        <Accordion
          onValueChange={(value) => {
            if (value === "Object 1") updateAllTexts(1);
          }}
          defaultValue="Object 1"
          type="single"
          collapsible={true}
          onPointerDown={(e) => e.stopPropagation()}
          className=" backdrop-blur-[1px] backdrop-brightness-75 text-white border-none overflow-auto resize-x  "
        >
          <AccordionItem
            value="Object 1"
            className="px-2 rounded-xl border-2 border-border"
          >
            <AccordionTrigger className="lg:text-xl py-1  font-bold w-full">
              Object 1
            </AccordionTrigger>
            <AccordionContent className="text-xs lg:text-lg">
              {
                params(1).map((param) => (
                  <div
                    key={param.label}
                    className="flex flex-row w-full items-center"
                  >
                    <p className="text-left w-[3ch]">
                      {param.label}
                      <sub>1</sub>
                    </p>
                    :<p className="text-right  min-w-[8ch]" ref={param.ref}></p>
                    <p className="text-left ml-1">{param.unit}</p>
                  </div>
                )) // m,v,p,KE
              }
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Object 2 */}

        <Accordion
          onValueChange={(value) => {
            if (value === "Object 2") updateAllTexts(2);
          }}
          defaultValue="Object 2"
          type="single"
          collapsible={true}
          onPointerDown={(e) => e.stopPropagation()}
          className=" backdrop-blur-[1px] backdrop-brightness-75 text-white border-none  overflow-auto resize-x "
        >
          <AccordionItem
            value="Object 2"
            className="px-2 rounded-xl border-2 border-border"
          >
            <AccordionTrigger className="lg:text-xl py-1  font-bold w-full">
              Object 2
            </AccordionTrigger>
            <AccordionContent className="text-xs lg:text-lg">
              {
                params(2).map((param) => (
                  <div
                    key={param.label}
                    className="flex  flex-row w-full items-center"
                  >
                    <p className="text-left w-[3ch]">
                      {param.label}
                      <sub>2</sub>
                    </p>
                    :<p className="text-right  min-w-[8ch]" ref={param.ref}></p>
                    <p className="text-left ml-1">{param.unit}</p>
                  </div>
                )) // m,v,p,KE
              }
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
      {/* Total */}
      <Accordion
        defaultValue="Total"
        type="single"
        collapsible={true}
        onPointerDown={(e) => e.stopPropagation()}
        className="self-start backdrop-blur-[1px] backdrop-brightness-75 text-white border-none  overflow-auto resize-x "
        onValueChange={(value) => {
          if (value === "Total") updateAllTexts(0);
        }}
      >
        <AccordionItem
          value="Total"
          className="px-2 rounded-xl border-2 border-border"
        >
          <AccordionTrigger className="lg:text-xl py-1  font-bold w-full">
            Total
          </AccordionTrigger>
          <AccordionContent className="text-xs lg:text-lg">
            <div className="flex  flex-row w-full items-center">
              <p className="text-left w-[3ch]">KE:</p>
              <p className="text-right  min-w-[8ch]" ref={totalKETextRef}></p>
              <p className="text-left ml-1">J</p>
            </div>
            <div className="flex  flex-row w-full items-center">
              <p className="text-left w-[3ch]">P:</p>
              <p className="text-right  min-w-[8ch]" ref={totalPETextRef}></p>
              <p className="text-left ml-1">kgm/s</p>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default Results;
