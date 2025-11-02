export function ClientOnlyBgWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-navy-gradient w-full h-screen flex">{children}</div>
  );
}
