"use client";

import { useState } from "react";
import { CommentItem } from "./CommentItem";
import { getComments } from "@/actions/comments";
import { CommentForm } from "./CommentForm";

interface Comment {
    id: string;
    created_at: string;
    nickname: string;
    content: string;
    parent_id: string | null;
    ip_address?: string;
    os?: string;
    browser?: string;
    is_deleted?: boolean;
    // ... any other fields
}

interface CommentListClientProps {
    projectSlug: string;
    initialRoots: Comment[];
    initialReplies: Comment[];
    initialHasMore: boolean;
    isAdmin: boolean;
}

export function CommentListClient({ projectSlug, initialRoots, initialReplies, initialHasMore, isAdmin }: CommentListClientProps) {
    const [roots, setRoots] = useState<Comment[]>(initialRoots);
    const [replies, setReplies] = useState<Comment[]>(initialReplies);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(initialHasMore);
    const [loading, setLoading] = useState(false);
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    const fetchComments = async (newPage: number, newSortOrder: 'asc' | 'desc') => {
        setLoading(true);
        const result = await getComments(projectSlug, newPage, 5, newSortOrder);

        if (result.error) {
            console.error(result.error);
            setLoading(false);
            return;
        }

        if (result.roots) {
            if (newPage === 1) {
                // Replace data for new sort
                setRoots(result.roots);
                setReplies(result.replies || []);
            } else {
                // Append data for load more
                setRoots(prev => [...prev, ...result.roots]);
                setReplies(prev => [...prev, ...result.replies || []]);
            }
            setHasMore(result.hasMore);
            setPage(newPage);
        }
        setLoading(false);
    };

    const loadMore = () => {
        if (loading || !hasMore) return;
        fetchComments(page + 1, sortOrder);
    };

    const handleSortChange = (order: 'asc' | 'desc') => {
        if (order === sortOrder) return;
        setSortOrder(order);
        setPage(1);
        setHasMore(false); // Reset temporarily
        fetchComments(1, order);
    };

    // Callback to refresh data without reload
    const refreshComments = () => {
        // Re-fetch current page with current sort order
        // Note: If we are on page > 1, we might want to fetch up to that page, or just reset to page 1?
        // For a simple guestbook, resetting to page 1 (showing newest) is often better UX after a new post.
        // BUT for deletion, we want to stay where we are.

        // Let's keep it simple: Reset to Page 1 for New Comments, Stay on Page for Deletion?
        // Actually, fetchComments logic replaces roots if page === 1.
        // If we are on page 2, and we delete something, we should probably just re-fetch everything up to current page?
        // Or just re-fetch the current view state.

        // Simply re-fetching page 1 adds to the list if we append. 
        // We need a "Reload" mode.

        // Refined Strategy:
        // For simplicity and correctness in this "Load More" pattern, the easiest robust way is to reset to Page 1.
        // If a user deletes a comment on Page 3, and we reset to Page 1, they lose context.
        // Ideally, we re-fetch all pages currently loaded.

        // However, given the constraints and "Load More" style, let's try to just re-fetch the first page (reset) for now, 
        // as it guarantees consistency.
        // OR, we can just reload the window.location.reload() which the user explicitly hated.

        // Let's implement a hard reset to Page 1 for now implementation.
        setPage(1);
        setRoots([]); // Clear to avoid duplicates if logic is append
        setHasMore(false);
        fetchComments(1, sortOrder);
    };

    const handleCommentSuccess = () => {
        refreshComments();
    };

    const handleDataChange = () => {
        refreshComments();
    };

    return (
        <div className="space-y-8 bg-gray-50/50 p-6 rounded-xl border border-gray-100/50">
            <CommentForm projectSlug={projectSlug} onSuccess={handleDataChange} isAdmin={isAdmin} />

            <div className="space-y-6">
                {/* Sort Buttons */}
                <div className="flex justify-end gap-2 border-b border-gray-200 pb-2">
                    <button
                        onClick={() => handleSortChange('desc')}
                        className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${sortOrder === 'desc' ? 'bg-primary text-white' : 'text-gray-400 hover:text-gray-600 bg-gray-100'}`}
                    >
                        최신순
                    </button>
                    <button
                        onClick={() => handleSortChange('asc')}
                        className={`text-xs font-bold px-3 py-1 rounded-full transition-colors ${sortOrder === 'asc' ? 'bg-primary text-white' : 'text-gray-400 hover:text-gray-600 bg-gray-100'}`}
                    >
                        등록순
                    </button>
                </div>

                {roots.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-400 text-sm">첫 번째로 방명록을 남겨주세요.</p>
                    </div>
                ) : (
                    <>
                        {roots.map((comment) => {
                            const commentReplies = replies
                                .filter(r => r.parent_id === comment.id)
                                .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

                            return (
                                <div key={comment.id} className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                                    <CommentItem
                                        comment={comment as any}
                                        projectSlug={projectSlug}
                                        onDataChange={handleDataChange}
                                    />
                                    {commentReplies.length > 0 && (
                                        <div className="space-y-3 mt-3">
                                            {commentReplies.map(reply => (
                                                <CommentItem
                                                    key={reply.id}
                                                    comment={reply as any}
                                                    projectSlug={projectSlug}
                                                    isReply
                                                    onDataChange={handleDataChange}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {/* Load More Button */}
                        {hasMore && (
                            <div className="pt-4 flex justify-center">
                                <button
                                    onClick={loadMore}
                                    disabled={loading}
                                    className="px-6 py-2 bg-white border border-gray-200 rounded-full text-sm font-bold text-gray-500 hover:border-primary hover:text-primary transition-all shadow-sm disabled:opacity-50"
                                >
                                    {loading ? "불러오는 중..." : "더보기"}
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
