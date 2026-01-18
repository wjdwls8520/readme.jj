import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { formatDistanceToNow } from "date-fns";
import { deleteComment } from "@/actions/comments";

export default async function AdminDashboard() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user || user.email !== process.env.ADMIN_EMAIL) {
        redirect("/hidden-admin-login");
    }

    const { data: comments } = await supabase
        .from("comments")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <main className="container mx-auto py-12 px-4">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-secondary">Admin Dashboard</h1>
                <div className="text-sm text-foreground/60">
                    Signed in as: <span className="font-semibold text-primary">{user.email}</span>
                </div>
            </div>

            <div className="rounded-md border border-soft/20 bg-background overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-soft/10 text-foreground/70">
                            <tr>
                                <th className="px-4 py-3 text-left">Date</th>
                                <th className="px-4 py-3 text-left">Project</th>
                                <th className="px-4 py-3 text-left">Author</th>
                                <th className="px-4 py-3 text-left">Content</th>
                                <th className="px-4 py-3 text-left">Meta</th>
                                <th className="px-4 py-3 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {comments?.map((comment) => (
                                <tr key={comment.id} className="border-b border-soft/10 last:border-0 hover:bg-soft/5 transition-colors">
                                    <td className="px-4 py-3 whitespace-nowrap text-foreground/60">
                                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                    </td>
                                    <td className="px-4 py-3 font-medium">{comment.project_slug}</td>
                                    <td className="px-4 py-3 font-medium text-primary">{comment.nickname}</td>
                                    <td className="px-4 py-3 max-w-xs truncate" title={comment.content}>{comment.content}</td>
                                    <td className="px-4 py-3 text-xs text-foreground/40">
                                        {comment.ip_address} | {comment.os} | {comment.browser}
                                    </td>
                                    <td className="px-4 py-3 text-right">
                                        <form action={async () => {
                                            "use server";
                                            await deleteComment(comment.id, ""); // Admin bypass
                                        }}>
                                            <button className="text-red-500 hover:text-red-700 font-medium">Delete</button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                            {comments?.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-4 py-8 text-center text-foreground/40">No comments found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </main>
    );
}
