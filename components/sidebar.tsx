'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { handleSignOut } from "@/app/actions/authActions";
import { HomeIcon, MessageCircleIcon, UsersIcon } from "lucide-react";
import logo from '@/public/assets/DD_T9qPu.jpeg';

const Sidebar = ({ session }: { session: any }) => {
  const pathname = usePathname();

  const role = session?.user?.role; // Ex: 'admin' or 'user'

  // Routes accessibles selon le rôle
  const navItems = [
    { href: "/page2/docs", label: "Chats", icon: <MessageCircleIcon size={18} />, roles: [ 'admin'] },
    { href: "/page1/docs", label: "Chats", icon: <MessageCircleIcon size={18} />, roles: ['user'] },
    { href: "/page2/users", label: "Users", icon: <UsersIcon size={18} />, roles: ['admin'] },
    { href: "/page1/documents", label: "Documents", icon: <UsersIcon size={18} />, roles: ['user'] },

    { href: "/page2/documents", label: "Documents", icon: <UsersIcon size={18} />, roles: [ 'admin'] },
  ];

  // On filtre selon le rôle
  const filteredItems = navItems.filter(item => item.roles.includes(role));

  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col p-4">
      {/* Logo */}
      <div className="flex justify-center items-center mb-8">
        <Image
          src={logo}
          alt="Logo"
          width={80}
          height={80}
          className="rounded-full border border-white"
        />
      </div>

      {/* Navigation */}
      <ul className="space-y-2">
        {filteredItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-md transition-colors duration-200 ${
                pathname === item.href
                  ? "bg-gray-700 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          </li>
        ))}
      </ul>

      {/* Espace flexible pour pousser le bouton en bas */}
      <div className="flex-grow" />

      {/* Bouton en bas */}
      <div className="mt-auto">
        {!session ? (
          <Link href="/auth/signin">
            <Button variant="default" className="w-full">Sign In</Button>
          </Link>
        ) : (
          <form action={handleSignOut}>
            <Button variant="default" type="submit" className="w-full">
              Sign Out
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
