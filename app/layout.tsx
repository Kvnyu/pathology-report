// CSS
import './globals.css';
// Components
import Navbar from '@/components/layout/Navbar';

export const metadata = {
  title: 'Everlab',
  description: 'The next generation of prevenative healthcare'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className="h-full">
        <Navbar />
        {children}
      </body>
    </html>
  );
}
