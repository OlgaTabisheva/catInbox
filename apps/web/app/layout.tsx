import type { Metadata } from 'next';
import './globals.css';
import Header from '../components/Header';
import MobileBottomNav from '../components/MobileBottomNav';
import { auth } from '../auth';
export const metadata: Metadata = {
  title: 'Кото-Учёт',
  description: 'Fridge and Pantry Tracker',
};
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  return (
    <html lang="ru">
      <body className="bg-slate-50 min-h-screen font-sans text-slate-800 pb-20 md:pb-0">
        <Header user={session?.user} />
        <main className="max-w-4xl mx-auto p-4 md:p-8">
          {children}
        </main>
        <MobileBottomNav />
      </body>
    </html>
  );
}
