import { MathJax } from "better-react-mathjax";
import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { cn } from "~/lib/utils";
import { formatNumber } from "~/lib/utils/formatNumber";
interface ResultsTableProps {
  firstColumn: string[];
  secondColumn: number[];
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
          <TableCell align="center" className=" font-bold text-lg font-sans">
            Axis
          </TableCell>

          <TableCell align="center" className="font-bold text-lg font-sans">
            <MathJax inline hideUntilTypeset={"first"}>
              Moment of Inertia ({`\\(kg \\ m^2\\)`})
            </MathJax>
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
                <td align="center" className="p-2">
                  <p className="text-lg ">{firstColumn[index]}</p>
                </td>
                <td align="center" className="p-0">
                  <p className="font-semibold text-lg   ">
                    <MathJax inline hideUntilTypeset={"first"}>
                      {`\\[${formatNumber(item)} \\]`}
                    </MathJax>
                  </p>
                </td>
              </TableRow>
            )
        )}
      </TableBody>
    </Table>
  );
};

export default ResultsTable;
