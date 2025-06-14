// app/page2/layout.tsx (RESTE un Server Component)
import { auth } from '@/lib/auth';
import ClientLayout from './client-layout';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user || session.user.role !== 'admin') {
    return <div>Access Denied</div>;
  }
  return <ClientLayout>{children}</ClientLayout>;
}

