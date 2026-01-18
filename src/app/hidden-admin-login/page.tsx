"use client";

import { createClient } from "@/utils/supabase/client";

export default function AdminLogin() {
    const handleLogin = async () => {
        const supabase = createClient();
        await supabase.auth.signInWithOAuth({
            provider: "google",
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    };

    return (
        <main className="flex min-h-screen items-center justify-center bg-soft/20">
            <div className="w-full max-w-sm rounded-lg border border-soft/30 bg-background p-8 shadow-lg text-center">
                <h1 className="mb-6 text-2xl font-bold text-secondary">Admin Access</h1>
                <button
                    onClick={handleLogin}
                    className="w-full rounded-md bg-primary px-4 py-2 text-white hover:bg-primary/90 transition-colors font-medium"
                >
                    Sign in with Google
                </button>
            </div>
        </main>
    );
}
