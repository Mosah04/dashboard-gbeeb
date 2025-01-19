import { Montserrat } from "next/font/google";
import "./globals.css";

const montSerrat = Montserrat({ subsets: ["latin"] });

export const metadata = {
  title: "GBEEB",
  description: "Gestion du camp GBEEB",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className={`${montSerrat.className}`}>{children}</body>
    </html>
  );
}
