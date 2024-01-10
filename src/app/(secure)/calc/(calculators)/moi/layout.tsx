export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="m-4">
      <h1 className="text-center text-4xl py-3 text-primary font-bold leading-8 text-gray-900 ">
        Moment of Inertia
      </h1>
      <main className="flex-1">{children}</main>
    </div>
  );
}
