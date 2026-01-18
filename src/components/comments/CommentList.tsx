import { createClient } from "@/utils/supabase/server";
import { getComments } from "@/actions/comments";
import { CommentListClient } from "./CommentListClient";

interface CommentListProps {
    projectSlug: string;
}

export async function CommentList({ projectSlug }: CommentListProps) {
    // Check Admin
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const isAdmin = user?.email === "wjdwls8520@gmail.com";

    // Initial fetch (Page 1)
    const result = await getComments(projectSlug, 1, 5);

    if (result.error) {
        return (
            <div className="text-center py-10">
                <p className="text-red-400 text-sm">
                    {result.error.includes('PGRST205')
                        ? "방명록 DB가 아직 생성되지 않았습니다."
                        : `오류 발생: ${result.error}`}
                </p>
            </div>
        );
    }

    return (
        <CommentListClient
            projectSlug={projectSlug}
            initialRoots={result.roots || []}
            initialReplies={result.replies || []}
            initialHasMore={result.hasMore || false}
            isAdmin={isAdmin}
        />
    );
}
