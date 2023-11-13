import { useAtomValue } from "jotai";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { projectileAtom } from "./store";
import { resultSchema } from "./schema";

export default function ResultTable() {
  const projectileParams = useAtomValue(projectileAtom);

  if (!projectileParams) {
    return null;
  }

  return (
    <div className="w-[32rem] p-5 rounded-lg border-slate-200 border">
      <Table>
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
