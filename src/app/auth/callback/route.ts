import { NextResponse } from 'next/server'
// The client you created from the server-side helper
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in param, use it as the redirect URL
    const next = searchParams.get('next') ?? '/admin/dashboard'

    if (code) {
        const supabase = await createClient()
        const { error } = await supabase.auth.exchangeCodeForSession(code)

        if (!error) {
            // Check for specific admin email
            const { data: { user } } = await supabase.auth.getUser()

            if (user?.email === "wjdwls8520@gmail.com") {
                const forwardedHost = request.headers.get('x-forwarded-host') // original origin before load balancer
                const isLocalEnv = process.env.NODE_ENV === 'development'
                if (isLocalEnv) {
                    return NextResponse.redirect(`${origin}/`) // Redirect to Home
                } else if (forwardedHost) {
                    return NextResponse.redirect(`https://${forwardedHost}/`)
                } else {
                    return NextResponse.redirect(`${origin}/`)
                }
            } else {
                // Not the admin: sign out and redirect
                await supabase.auth.signOut()
                return NextResponse.redirect(`${origin}/hidden-admin-login?error=Unauthorized`)
            }
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}
