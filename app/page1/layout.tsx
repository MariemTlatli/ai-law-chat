// app/page2/layout.tsx
import { auth } from '@/auth';
import ClientLayout from './client-layout';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const session = await auth(); // ✅ fonctionne ici car layout est serveur
 if (!session?.user || session.user.role !== 'user') {
    return <div>Access Denied</div>;
  }
  return <ClientLayout session={session}>{children}</ClientLayout>;
}

