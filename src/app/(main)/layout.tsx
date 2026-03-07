import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminRedirect from '@/components/AdminRedirect';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminRedirect>
      <div className="min-h-screen bg-white overflow-x-hidden">
        <Header />
        <main>
          {children}
        </main>
        <Footer />
      </div>
    </AdminRedirect>
  );
}