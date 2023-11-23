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
import { boatRiverAtom } from "./store";

export default function ResultTable() {
  const boatRiverParams = useAtomValue(boatRiverAtom);

  if (!boatRiverParams) {
    return null;
  }

  return (
    <div className="w-[32rem] p-5 rounded-lg border-slate-200 border">
      <Table>
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
                {boatRiverParams[name].toPrecision(4)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
