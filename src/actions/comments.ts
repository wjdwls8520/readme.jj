"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { UAParser } from "ua-parser-js";

export async function postComment(formData: FormData) {
    const headersList = await headers();
    const userAgent = headersList.get("user-agent") || "";
    const ip = headersList.get("x-forwarded-for")?.split(",")[0] || "127.0.0.1";

    const parser = new UAParser(userAgent);
    const browser = parser.getBrowser();
    const os = parser.getOS();

    // Admin Check
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    const isAdmin = user?.email === "wjdwls8520@gmail.com";

    const nickname = formData.get("nickname") as string;
    let finalNickname = nickname;
    const password = formData.get("password") as string;
    const content = formData.get("content") as string;
    const projectSlug = formData.get("project_slug") as string;
    const parentId = formData.get("parent_id") as string | null;

    // 0. Server-side Validation
    if (finalNickname.length > 10) {
        return { error: "닉네임은 최대 10자까지 가능합니다." };
    }
    if (content.length > 300) {
        return { error: "댓글 내용은 최대 300자까지 가능합니다." };
    }

    // 1. Nickname Blacklist Logic
    const BLACKLIST = ["개발자 김정진", "어드민", "admin", "김정진", "정진"];
    if (!isAdmin && BLACKLIST.includes(nickname)) {
        return { error: "사용할 수 없는 닉네임입니다." };
    }

    // 2. Admin Auto-Nickname
    if (isAdmin) {
        finalNickname = "개발자 김정진";
    }

    if (!finalNickname || !password || !content || !projectSlug) {
        return { error: "Missing required fields" };
    }

    // Rate Limiting (Flood Protection)
    // Prevent more than 3 comments in last 2 minutes from same IP
    if (!isAdmin) {
        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000).toISOString();
        const { count, error: countError } = await supabase
            .from("comments")
            .select("*", { count: 'exact', head: true })
            .eq("ip_address", ip)
            .gte("created_at", twoMinutesAgo);

        if (countError) {
            console.error("Rate limit check failed:", countError);
            // Proceed cautiously or fail safe? Let's proceed but log it.
        } else if (count !== null && count >= 3) {
            return { error: "도배 방지를 위해 잠시 후에 작성해주세요." };
        }
    }

    if (!isAdmin) {
        const { data: existingUser } = await supabase
            .from("comments")
            .select("id")
            .eq("nickname", finalNickname)
            .limit(1)
            .maybeSingle();

        if (existingUser) {
            return { error: "이미 사용중인 닉네임입니다." };
        }
    }

    const { error } = await supabase.from("comments").insert({
        nickname: finalNickname,
        password: isAdmin ? "admin-pass" : password, // Admin doesn't need real password, store dummy or keep user input? user input is fine.
        content,
        project_slug: projectSlug,
        parent_id: parentId ? parentId : null,
        ip_address: ip,
        os: `${os.name || "Unknown"} ${os.version || ""}`,
        browser: `${browser.name || "Unknown"} ${browser.version || ""}`,
    });

    if (error) {
        console.error("Error posting comment:", error);
        return { error: "Failed to post comment" };
    }

    revalidatePath("/");
    return { success: true };
}

export async function deleteComment(commentId: string, passwordAttempt: string) {
    const supabase = await createClient();

    // 1. Fetch the comment to check password
    const { data: comment, error: fetchError } = await supabase
        .from("comments")
        .select("password")
        .eq("id", commentId)
        .single();

    if (fetchError || !comment) {
        return { error: "댓글을 찾을 수 없습니다." };
    }

    // 2. Check if user is admin
    const { data: { user } } = await supabase.auth.getUser();
    const isAdmin = user?.email === "wjdwls8520@gmail.com";
    console.log("Delete Request - User Email:", user?.email, "Is Admin:", isAdmin);

    // 3. Verify password if not admin
    if (!isAdmin && comment.password !== passwordAttempt) {
        return { error: "비밀번호가 일치하지 않습니다." };
    }

    // 4. Soft Delete (Update flag instead of delete row)
    const { error: deleteError } = await supabase
        .from("comments")
        .update({
            is_deleted: true,
            content: isAdmin ? "관리자의 권한으로 삭제처리 된 댓글 입니다" : "삭제된 댓글입니다.",
            nickname: "알 수 없음",
            password: "", // Clear sensitive data
            ip_address: null,
            os: null,
            browser: null
        })
        .eq("id", commentId);

    if (deleteError) {
        console.error("Critical Error in deleteComment:", JSON.stringify(deleteError, null, 2));
        return { error: `삭제 실패: ${deleteError.message} (${deleteError.code})` };
    }

    revalidatePath("/");
    return { success: true };
}

export async function getComments(projectSlug: string, page: number = 1, pageSize: number = 5, sortOrder: 'asc' | 'desc' = 'desc') {
    const supabase = await createClient();

    // 1. Fetch Root Comments (Paginated)
    // Fetch one extra item to check if there are more pages
    const from = (page - 1) * pageSize;
    const to = from + pageSize; // Intentionally fetch 6 items (index 0 to 5)

    const { data: rawRoots, error: rootError } = await supabase
        .from("comments")
        .select("*")
        .eq("project_slug", projectSlug)
        .is("parent_id", null)
        .order("created_at", { ascending: sortOrder === 'asc' })
        .range(from, to);

    if (rootError) return { error: rootError.message };
    if (!rawRoots || rawRoots.length === 0) return { roots: [], replies: [], hasMore: false };

    // Check if we have more than requested
    const hasMore = rawRoots.length > pageSize;
    // Slice to return only the requested amount
    const rootComments = hasMore ? rawRoots.slice(0, pageSize) : rawRoots;

    // 2. Fetch Replies for these roots
    const rootIds = rootComments.map(c => c.id);
    const { data: replies, error: replyError } = await supabase
        .from("comments")
        .select("*")
        .in("parent_id", rootIds)
        .order("created_at", { ascending: true }); // Replies typically shown oldest first

    if (replyError) return { error: replyError.message };

    return { roots: rootComments, replies: replies || [], hasMore };
}
