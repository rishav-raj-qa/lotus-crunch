import { Syne, Fraunces, DM_Mono } from 'next/font/google';
import { Toaster } from 'react-hot-toast';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import './globals.css';

const syne = Syne({ subsets: ['latin'], variable: '--font-syne', weight: ['400', '500', '600', '700', '800'] });
const fraunces = Fraunces({ subsets: ['latin'], variable: '--font-fraunces', weight: ['300', '400', '500', '600'] });
const dmMono = DM_Mono({ subsets: ['latin'], variable: '--font-dm-mono', weight: ['300', '400', '500'] });

export const metadata = {
  title:       'Lotus Crunch — Premium Makhana',
  description: 'Premium roasted makhana crafted for modern lifestyles — light, nutritious, and irresistibly crunchy.',
  keywords:    'makhana, foxnut, healthy snacks, roasted makhana, lotus crunch',
  openGraph: {
    title:       'Lotus Crunch — Premium Makhana',
    description: 'Clean snacking starts here.',
    type:        'website'
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${syne.variable} ${fraunces.variable} ${dmMono.variable}`}>
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body className="bg-cream text-ink antialiased">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster
          position="top-right"
          toastOptions={{ style: { fontFamily: 'var(--font-syne)', fontSize: '14px', borderRadius: '12px' } }}
        />
      </body>
    </html>
  );
}
