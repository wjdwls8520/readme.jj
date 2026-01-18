"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AlertCircle } from "lucide-react";

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    message?: string;
}

export function AlertModal({ isOpen, onClose, message = "오류가 발생했습니다." }: AlertModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="w-full max-w-sm overflow-hidden rounded-2xl bg-white p-6 shadow-2xl animate-in zoom-in-95 duration-200 border border-gray-100 text-center">

                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
                    <AlertCircle className="h-6 w-6 text-red-600" />
                </div>

                <h3 className="text-lg font-bold text-gray-900 mb-2">알림</h3>
                <p className="text-gray-600 mb-6 text-sm whitespace-pre-wrap">{message}</p>

                <button
                    onClick={onClose}
                    className="w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-bold text-white hover:bg-black transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
                >
                    확인
                </button>

            </div>
        </div>,
        document.body
    );
}
