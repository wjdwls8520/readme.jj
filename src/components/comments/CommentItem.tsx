"use client";

import { useState } from "react";
import { formatDistanceToNow, format, differenceInHours } from "date-fns";
import { ko } from "date-fns/locale";
import { MessageSquare, Trash2, Monitor, Cpu } from "lucide-react";
import { CommentForm } from "./CommentForm";
import { deleteComment } from "@/actions/comments";
import { cn } from "@/lib/utils";
import { DeleteModal } from "./DeleteModal";
import { SuccessModal } from "./SuccessModal";
import { AlertModal } from "./AlertModal";

interface CommentProps {
    comment: any;
    projectSlug: string;
    isReply?: boolean;
    onDataChange?: () => void;
}

function formatDate(dateString: string) {
    const date = new Date(dateString);
    const now = new Date();
    const diffHours = differenceInHours(now, date);

    if (diffHours < 24) {
        return formatDistanceToNow(date, { addSuffix: true, locale: ko });
    } else {
        return format(date, "yyyy년 MM월 dd일", { locale: ko });
    }
}

// Function to render content with colored mentions
function renderContent(content: string) {
    const mentionRegex = /^(@[^\s]+)\s/;
    const match = content.match(mentionRegex);

    if (match) {
        const mention = match[1];
        const rest = content.slice(mention.length);
        return (
            <>
                <span className="text-primary font-bold">{mention}</span>{rest}
            </>
        );
    }
    return content;
}

export function CommentItem({ comment, projectSlug, isReply = false, onDataChange }: CommentProps) {
    const [showReply, setShowReply] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
    const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);

    const isDeleted = comment.is_deleted; // Check soft delete flag

    const replyParentId = isReply ? comment.parent_id : comment.id;
    const replyInitialContent = `@${comment.nickname}`;

    async function handleDeleteConfirm(password: string) {
        setIsDeleting(true);
        const res = await deleteComment(comment.id, password);
        if (res.success) {
            setIsDeleteModalOpen(false);
            setIsSuccessModalOpen(true);
        } else {
            setAlertMessage(res.error || "비밀번호가 일치하지 않습니다.");
            setIsAlertModalOpen(true);
        }
        setIsDeleting(false);
    }

    const handleSuccessClose = () => {
        setIsSuccessModalOpen(false);
        if (onDataChange) {
            onDataChange();
        } else {
            window.location.reload();
        }
    };

    const handleReplySuccess = () => {
        setShowReply(false);
        if (onDataChange) {
            onDataChange();
        } else {
            window.location.reload();
        }
    };

    const maskedIp = comment.ip_address
        ? comment.ip_address.split('.').slice(0, 2).join('.') + '.x.x'
        : 'Unknown';

    return (
        <>
            {isDeleted ? (
                <div className={cn("rounded-xl p-4 bg-gray-50/50 border border-gray-100/50 text-gray-400 italic text-sm", isReply && "ml-4 md:ml-8")}>
                    {comment.content}
                </div>
            ) : (
                <div className={cn("group relative rounded-xl border border-transparent hover:border-gray-100 hover:bg-white hover:shadow-sm p-4 transition-all duration-300", isReply && "ml-4 md:ml-8 border-l-2 border-l-gray-100 pl-4 bg-transparent hover:bg-transparent")}>
                    <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-800 text-sm">{comment.nickname}</span>
                            <span className="text-[10px] text-gray-400 hidden md:inline-flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded">
                                <Monitor className="h-3 w-3" /> {comment.os || 'Unk'}
                            </span>
                            <span className="text-[10px] text-gray-400 hidden md:inline-flex items-center gap-1 bg-gray-50 px-1.5 py-0.5 rounded">
                                <Cpu className="h-3 w-3" /> {comment.browser || 'Unk'}
                            </span>
                        </div>
                        <span className="text-[10px] text-gray-400 font-medium">
                            {formatDate(comment.created_at)}
                        </span>
                    </div>

                    <p className="mb-3 text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                        {renderContent(comment.content)}
                    </p>

                    <div className="flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                            onClick={() => setShowReply(!showReply)}
                            className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-primary transition-colors"
                        >
                            <MessageSquare className="h-3 w-3" /> 답글
                        </button>
                        <button
                            onClick={() => setIsDeleteModalOpen(true)}
                            className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <Trash2 className="h-3 w-3" /> 삭제
                        </button>
                    </div>

                    {showReply && (
                        <div className="mt-4 pl-4 border-l-2 border-primary/20 animate-in fade-in slide-in-from-top-2">
                            <CommentForm
                                projectSlug={projectSlug}
                                parentId={replyParentId}
                                initialContent={replyInitialContent}
                                onSuccess={handleReplySuccess}
                                onCancel={() => setShowReply(false)}
                            />
                        </div>
                    )}
                </div>
            )}

            <DeleteModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleDeleteConfirm}
                isDeleting={isDeleting}
            />

            <SuccessModal
                isOpen={isSuccessModalOpen}
                onClose={handleSuccessClose}
                message="댓글이 삭제되었습니다."
            />

            <AlertModal
                isOpen={isAlertModalOpen}
                onClose={() => setIsAlertModalOpen(false)}
                message={alertMessage}
            />
        </>
    );
}
