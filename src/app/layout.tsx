import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TasKing - O Jogo de Estratégia e Dedução',
  description: 'Um jogo de estratégia, dedução e trabalho em equipe onde os jogadores buscam a Coroa perdida enquanto tentam identificar os Impostores.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR">
      <body className={`${inter.className} bg-gradient-to-b from-gray-900 to-black min-h-screen`}>
        {children}
      </body>
    </html>
  );
}


