import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Inner Sanctuary',
  description: 'A space for reflection, release, and renewal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isPreview = process.env.NODE_ENV !== 'production';

  return (
    <html lang="en">
      <head>
        {isPreview && (
          <meta
            httpEquiv="Content-Security-Policy"
            content="default-src 'self' 'unsafe-inline' 'unsafe-eval' data: blob:; script-src 'self' 'unsafe-inline' 'unsafe-eval'; connect-src 'self' *.supabase.co *.dropbox.com youtube.com www.youtube.com; img-src 'self' data: blob: https:; media-src 'self' blob: https:; frame-src 'self' youtube.com www.youtube.com; style-src 'self' 'unsafe-inline';"
          />
        )}
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
