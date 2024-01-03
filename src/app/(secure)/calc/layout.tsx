import CalcContext from "./Context";

export default function CalcLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <CalcContext>{children}</CalcContext>;
}
