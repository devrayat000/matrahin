import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";
interface ResultsTableProps {
  firstColumn: string[];
  secondColumn: string[];
}
const ResultsTable: React.FC<ResultsTableProps> = ({
  firstColumn,
  secondColumn,
}) => {
  return (
    <Table>
      <caption className="caption-top text-2xl border-b-2 pb-2">
        Results
      </caption>

      <TableHeader>
        <TableRow>
          <TableCell align="center" className="font-bold text-lg font-sans">
            Axis
          </TableCell>

          <TableCell align="center" className="font-bold text-lg font-sans">
            Moment of Inertia
          </TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {secondColumn.map(
          (item, index) =>
            firstColumn[index] &&
            !Number.isNaN(item) && (
              <TableRow
                key={index}
                className={cn(index & 1 ? "bg-inherit" : "bg-slate-100")}
              >
                <TableCell align="center">
                  <p className="py-2 text-lg tracking-wide">
                    {firstColumn[index]}
                  </p>
                </TableCell>
                <TableCell align="center" className="px-10">
                  <p className="bg-green-300 py-2 font-semibold rounded-2xl  tracking-wider">
                    {item}
                  </p>
                </TableCell>
              </TableRow>
            )
        )}
      </TableBody>
    </Table>
  );
};

export default ResultsTable;
