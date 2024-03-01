import CalcContext from "./Context";
import "~/lib/globals";

export default function CalcLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CalcContext>{children}</CalcContext>;
}
