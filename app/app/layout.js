export const metadata = {
  title: 'E&G FINANÇAS',
  description: 'Gestão de Mordomia',
}

export default function RootLayout({ children }) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  )
}
