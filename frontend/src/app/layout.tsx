import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { Providers } from '@/components/providers';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
});

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
});

export const metadata: Metadata = {
  title: 'Dulce Twilight - Tienda Online',
  description: 'Los mejores Dulce Twilight artesanales. Chocolates, trufas, bombones y más. Envío gratis en compras sobre $8.000.',
  keywords: 'dulce twilight, dulces, chocolates, trufas, bombones, galletas, pasteles, artesanal',
  authors: [{ name: 'Dulce Twilight' }],
  icons: {
    icon: '/favicon.svg',
  },
  openGraph: {
    title: 'Dulce Twilight - Tienda Online',
    description: 'Los mejores Dulce Twilight artesanales',
    type: 'website',
    locale: 'es_AR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <meta name="referrer" content="strict-origin-when-cross-origin" />
        <meta httpEquiv="Content-Security-Policy" content="frame-src 'self' https://www.google.com https://maps.google.com https://www.google.com/maps;" />
        <style>{`
          /* Animaciones suaves para los toasts */
          .toast-enter {
            transform: translateX(100%);
            opacity: 0;
          }
          
          .toast-enter-active {
            transform: translateX(0);
            opacity: 1;
            transition: all 0.3s ease-out;
          }
          
          .toast-exit {
            transform: translateX(0);
            opacity: 1;
          }
          
          .toast-exit-active {
            transform: translateX(100%);
            opacity: 0;
            transition: all 0.3s ease-in;
          }
        `}</style>
      </head>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        <Providers>
          {children}
          <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            containerClassName=""
            containerStyle={{}}
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                fontSize: '14px',
                maxWidth: '400px',
                padding: '12px 16px',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              },
              success: {
                duration: 3500,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
                style: {
                  background: '#10b981',
                  color: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
                style: {
                  background: '#ef4444',
                  color: '#fff',
                },
              },
              loading: {
                duration: 2000,
                style: {
                  background: '#f59e0b',
                  color: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
