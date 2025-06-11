'use client';
import Link from "next/link";
import { usePathname } from "next/navigation";

const Sidebar = () => {
  const pathname = usePathname(); // Remplace useRouter()

  return (
    <div className="w-64 bg-gray-800 text-white p-4">
      
      <ul>
        <li className={`mb-2 ${pathname === "/page2" ? "bg-gray-700 rounded p-2" : ""}`}>
          <Link href="/page2">Dashboard</Link>
        </li>
        <li className={`mb-2 ${pathname === "/page2/docs" ? "bg-gray-700 rounded p-2" : ""}`}>
          <Link href="/page2/docs">chats</Link>
        </li>
         <li className={`mb-2 ${pathname === "/page2/users" ? "bg-gray-700 rounded p-2" : ""}`}>
          <Link href="/page2/users">Utilisateurs</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;