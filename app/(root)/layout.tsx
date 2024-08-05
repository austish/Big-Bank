import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import { getLoggedInUser } from "@/lib/actions/user.actions";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const loggedIn = await getLoggedInUser();

  if (!loggedIn) {
    console.log('not logged in')
    redirect('/sign-in')
  } 

  return (
    <main className="flex h-screen w-full font-inter">
        <Sidebar user = {loggedIn} />
        <div className="flex size-full flex-col">
          <div className="root-layout">
            <Link href='/' className='flex gap-2'>
              <Image 
                src="/icons/logo.svg"
                width={30}
                height={30}
                alt="menu icon"
              />
            </Link>
            <div>
              <MobileNav user={loggedIn} />
            </div>
          </div>
          {children}
        </div>
    </main>
  );
}
