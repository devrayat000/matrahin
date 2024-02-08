import { useAtomValue } from "jotai";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { resultSchema } from "./schema";
import { projectileAtom } from "./store";

export default function ResultTable() {
  const projectileParams = useAtomValue(projectileAtom);

  if (!projectileParams) {
    return null;
  }

  return (
    <div className="w-5/6 lg:w-[32rem] p-5 rounded-lg border-slate-200 border">
      <Table>
        <caption className="caption-top text-2xl border-b-2 pb-2">
          Results
        </caption>
        {/* <TableCaption>A list of your recent invoices.</TableCaption> */}
        <TableHeader>
          <TableRow>
            <TableHead className="w-full">Parameters</TableHead>
            <TableHead className="text-right">Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {resultSchema.map(({ name, label }) => (
            <TableRow key={name}>
              <TableCell
                className="font-medium"
                dangerouslySetInnerHTML={{
                  __html: label,
                }}
              />
              <TableCell className="text-right">
                {projectileParams[name].toPrecision(4)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
