import { auth } from "@/auth";
import Sidebar from "@/components/sidebar";


interface LayoutProps {
  children: React.ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  const session = await auth();

  // Vérifiez si l'utilisateur est connecté et a le rôle d'administrateur
  if (!session?.user || session.user.role !== "admin") {
    return <div>Access Denied</div>;
  }

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Contenu principal */}
      <div className="flex-1 p-4">
        {children}
      </div>
    </div>
  );
};

export default Layout;