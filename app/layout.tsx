import "./globals.css";

export const metadata = {
  title: "E&G Finanças",
  description: "Controle de gastos do casal",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  );
}