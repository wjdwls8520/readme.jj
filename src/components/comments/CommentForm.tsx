"use client";

import { useState } from "react";
import { postComment } from "@/actions/comments";
import { cn } from "@/lib/utils";

interface CommentFormProps {
    projectSlug: string;
    parentId?: string; // If null, it's a root comment
    initialContent?: string; // content to pre-fill (e.g. @nickname)
    onSuccess?: () => void;
    onCancel?: () => void; // handle cancel action
    className?: string;
    isAdmin?: boolean;
}

export function CommentForm({ projectSlug, parentId, initialContent = "", onSuccess, onCancel, className, isAdmin = false }: CommentFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    // Determine if this is a reply form (has parentId) to style text differently if requested
    const isReply = !!parentId;

    const [content, setContent] = useState(initialContent);
    const hasValidMention = isReply && initialContent && content.startsWith(initialContent);

    async function handleSubmit(formData: FormData) {
        setLoading(true);
        setError("");

        formData.append("project_slug", projectSlug);
        if (parentId) formData.append("parent_id", parentId);
        // Ensure content in FormData matches state (textarea controlled or uncontrolled, but better safe)
        formData.set("content", content); // Override with current controlled state

        const result = await postComment(formData);

        if (result?.error) {
            setError(result.error);
        } else {
            setContent(""); // Clear state
            // Reset logic: manually clear textarea or rely on form.reset()
            const form = document.querySelector(`form[id="comment-form-${projectSlug}-${parentId || 'root'}"]`) as HTMLFormElement;
            form?.reset();
            if (onSuccess) onSuccess();
        }
        setLoading(false);
    }

    // Backdrop rendering for mention highlight
    // We render the content in a div behind the textarea.
    // The textarea has color: transparent, caret-color: black.
    // The backdrop renders the mention in primary color, rest in gray.

    const mentionPart = hasValidMention ? initialContent : "";
    const restPart = hasValidMention ? content.slice(initialContent.length) : content;

    return (
        <form
            id={`comment-form-${projectSlug}-${parentId || 'root'}`}
            action={handleSubmit}
            className={cn("space-y-3", className)}
        >
            <div className={cn("grid grid-cols-2 gap-3", isAdmin && "hidden")}>
                <input
                    name="nickname"
                    placeholder="닉네임"
                    required={!isAdmin}
                    maxLength={10}
                    defaultValue={isAdmin ? "개발자 김정진" : ""} // Dummy value for admin, overrides in server
                    autoComplete="username"
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-sm"
                />
                <input
                    name="password"
                    type="password"
                    placeholder="비밀번호 (삭제용)"
                    required={!isAdmin}
                    defaultValue={isAdmin ? "admin-pass" : ""} // Dummy value for admin
                    autoComplete="current-password"
                    className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-sm"
                />
            </div>

            <div className="relative">
                {/* Backdrop for highlighting */}
                <div
                    aria-hidden="true"
                    className="absolute inset-0 w-full rounded-md px-3 py-2 text-sm pointer-events-none whitespace-pre-wrap break-words font-sans bg-white border border-transparent pb-6"
                >
                    {hasValidMention ? (
                        <>
                            <span className="text-primary font-bold">{mentionPart}</span>
                            <span className="text-gray-900">{restPart}</span>
                        </>
                    ) : (
                        <span className={cn("text-gray-900", !content && "text-gray-400")}>
                            {content || (isAdmin ? "관리자 권한으로 댓글 작성 중..." : "자유롭게 방명록을 남겨주세요...")}
                        </span>
                    )}
                </div>

                <textarea
                    name="content"
                    value={content}
                    onChange={(e) => {
                        if (e.target.value.length <= 300) {
                            setContent(e.target.value);
                        }
                    }}
                    placeholder="" /* Placeholder handled by backdrop */
                    required
                    rows={3}
                    className={cn(
                        "relative z-10 w-full rounded-md border border-gray-200 bg-transparent px-3 py-2 text-sm font-sans focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all shadow-sm resize-none text-transparent caret-gray-900 selection:bg-primary/20 pb-6",
                        // Note: text-transparent hides the actual text input, but caret remains visible.
                        // Selection background should still be visible.
                    )}
                />
                {/* Character Counter */}
                <div className="absolute bottom-2 right-2 z-20 text-[10px] font-medium text-gray-400 pointer-events-none bg-white/80 px-1 rounded">
                    {content.length}/300
                </div>
            </div>
            {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
            <div className="flex justify-end gap-2">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="rounded-full border border-gray-200 bg-white px-4 py-2 text-xs font-bold text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-all shadow-sm"
                    >
                        취소
                    </button>
                )}
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-full bg-primary/90 px-5 py-2 text-xs font-bold text-white hover:bg-primary disabled:opacity-50 transition-all shadow-sm"
                >
                    {loading ? "등록 중..." : "등록하기"}
                </button>
            </div>
        </form>
    );
}
