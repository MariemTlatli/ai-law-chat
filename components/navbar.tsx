import Link from "next/link";
import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { handleSignOut } from "@/app/actions/authActions";
import Image from 'next/image';
import logo from '@/public/assets/DD_T9qPu.jpeg';
export default async function Navbar() {
  const session = await auth();
  console.log({ session });
  return (
    <nav className="">
      {/* <Link href="/" className="text-xl font-bold">
       <Image
          src={logo}
          alt="Logo"
          width={50}
          height={250}
        />
       
      </Link>
      {!session ? (
        <Link href="/auth/signin">
          <Button variant="default">Sign In</Button>
        </Link>
      ) : (
        <form action={handleSignOut}>
          <Button variant="default" type="submit">
            Sign Out
          </Button>
        </form>
      )} */}
    </nav>
  );
}
