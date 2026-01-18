"use client";

import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export function LogoutButton() {
    const router = useRouter();
    const supabase = createClient();

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.refresh();
        // Redirect to home is handled by refresh usually if logic is there, 
        // or we can explicitly replace.
        window.location.href = "/";
    };

    return (
        <button
            onClick={handleLogout}
            className="text-sm font-bold text-red-500 hover:text-red-600 transition-colors"
        >
            Logout
        </button>
    );
}
