"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface DeleteModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (password: string) => Promise<void>;
    isDeleting: boolean;
}

export function DeleteModal({ isOpen, onClose, onConfirm, isDeleting }: DeleteModalProps) {
    const [password, setPassword] = useState("");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    // Prevent background scrolling
    // FIXED: Hook is now called unconditionally (at the top level), satisfying Rules of Hooks.
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    // MOVED: Early return is now AFTER all hooks.
    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100">

                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">댓글 삭제</h3>
                    <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100 transition-colors">
                        <X className="w-5 h-5 text-gray-500" />
                    </button>
                </div>

                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                    댓글을 삭제하시겠습니까? <br />
                    <span className="text-xs text-gray-400">작성 시 입력한 비밀번호를 입력해주세요.</span>
                </p>

                <div className="space-y-4">
                    <input
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-md border border-gray-200 bg-gray-50 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                        autoFocus
                    />

                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="flex-1 rounded-lg bg-gray-100 px-4 py-3 text-sm font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                        >
                            취소
                        </button>
                        <button
                            onClick={() => onConfirm(password)}
                            disabled={isDeleting || !password}
                            className="flex-1 rounded-lg bg-red-500 px-4 py-3 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-50 transition-colors shadow-sm"
                        >
                            {isDeleting ? "삭제 중..." : "삭제하기"}
                        </button>
                    </div>
                </div>

            </div>
        </div>,
        document.body
    );
}
