import { auth } from "@/auth";

export default async function AdminPage() {
  const session = await auth();

  if (!session?.user || session.user.role !== "admin") {
    return <div>Access Denied</div>;
  }

  return <div>Bienvenue, administrateur !</div>;
}