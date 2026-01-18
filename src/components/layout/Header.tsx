import Link from "next/link";
import { cn } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { LogoutButton } from "@/components/auth/LogoutButton";

export async function Header() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const isAdmin = user?.email === "wjdwls8520@gmail.com";

    return (
        <header className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-sm border-b border-gray-100 transition-all">
            <div className="container flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center gap-3">
                    <img src="/logo.jpg" alt="readme.jj Logo" className="h-10 w-auto rounded-md shadow-sm" />
                    {/* <span className="font-serif text-2xl font-bold tracking-tight text-primary">readme.jj</span> */}
                </Link>
                <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
                    <Link href="#portfolio" className="text-gray-600 hover:text-primary transition-colors">
                        Portfolio
                    </Link>
                    <Link href="#resume" className="text-gray-600 hover:text-primary transition-colors">
                        Resume
                    </Link>
                    <Link href="#contact" className="text-gray-600 hover:text-primary transition-colors">
                        Contact
                    </Link>
                    {isAdmin && <LogoutButton />}
                </nav>

                {/* Mobile Logout (visible if admin) */}
                {isAdmin && (
                    <div className="md:hidden">
                        <LogoutButton />
                    </div>
                )}
            </div>
        </header>
    );
}
