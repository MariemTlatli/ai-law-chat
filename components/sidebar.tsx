'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

import { HomeIcon, MessageCircleIcon, UsersIcon } from "lucide-react";
import logo from '@/public/assets/DD_T9qPu.jpeg';

const navItems = [
  { href: "/page2", label: "Dashboard", icon: <HomeIcon size={18} /> },
  { href: "/page2/docs", label: "Chats", icon: <MessageCircleIcon size={18} /> },
  { href: "/page2/users", label: "Utilisateurs", icon: <UsersIcon size={18} /> },
  { href: "/page2/documents", label: "Documents", icon: <UsersIcon size={18} /> },
];

const Sidebar = () => {
  const pathname = usePathname();

  return (
    <div className="w-64 h-full bg-gray-800 text-white flex flex-col p-4 ">
      <div className="h-12"></div>
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
        {navItems.map((item) => (
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
    </div>
  );
};

export default Sidebar;
