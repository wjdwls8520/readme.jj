export function Footer() {
    return (
        <footer className="w-full bg-gray-50 border-t border-gray-100 py-12 mt-24">
            <div className="container flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex flex-col items-center md:items-start gap-2">
                    <span className="text-sm font-bold text-gray-800">Jeong Jin</span>
                    <p className="text-xs text-gray-500">
                        © {new Date().getFullYear()} All rights reserved.
                    </p>
                </div>
                <div className="flex items-center gap-6 text-sm text-gray-500">
                    <a href="#" className="hover:text-primary transition-colors">GitHub</a>
                    <a href="#" className="hover:text-primary transition-colors">LinkedIn</a>
                    <a href="/hidden-admin-login" className="hover:text-gray-900 transition-colors">Admin</a>
                </div>
            </div>
        </footer>
    );
}
