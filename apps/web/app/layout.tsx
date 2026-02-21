import type { Metadata } from 'next';
import './globals.css';
import Header from '../components/Header';
import MobileBottomNav from '../components/MobileBottomNav';
import { auth } from '../auth';
import { cookies } from 'next/headers';
import { TranslationProvider } from './TranslationProvider';
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
  const cookieStore = await cookies();
  const lang = cookieStore.get('lang')?.value === 'en' ? 'en' : 'ru';

  return (
    <html lang={lang}>
      <body className="bg-sand10 min-h-screen font-sans text-slate-800 pb-20 md:pb-0">
        <TranslationProvider lang={lang}>
          <Header user={session?.user} />
          <main className="max-w-4xl mx-auto p-4 md:p-8">
            {children}
          </main>
          <MobileBottomNav />
        </TranslationProvider>
      </body>
    </html>
  );
}
