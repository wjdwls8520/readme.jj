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

    // Check for existing nickname (skip for admin if they want to reuse their own name, or enforce uniqueness even for admin?)
    // User asked for "개발자 김정진" for admin. Uniqueness should probably still apply if someone else somehow took it, 
    // but the blacklist prevents others from taking it. So we are safe.
    // However, if admin posts multiple times, they need to be able to use the same nickname?
    // The current Uniqueness check uses .maybeSingle(). 
    // If strict uniqueness is required for EVERYONE, admin can only post ONCE. 
    // User request: "이미 db에 같은 닉네임이 있다면 작성하지 못하게해줘".
    // BUT Admin needs to reply multiple times. 
    // Exception: Admin's nickname "개발자 김정진" should NOT be subject to uniqueness check? Or maybe "개발자 김정진" is a special badge?
    // Actually, widespread pattern is: Nicknames are unique per USER (session), or just unique string?
    // If unique string, then Admin can only post once. That's bad.
    // Let's assume Admin is exempt from Uniqueness check OR "개발자 김정진" is a special system name that doesn't trigger the check?
    // Wait, the user said "닉네임을 입력하는데 이미 db에 같은 닉네임이 있다면 작성하지 못하게해줘". 
    // If Admin is force-set to "개발자 김정진", and that name exists, Admin is blocked? 
    // Let's exempt Admin from uniqueness check.

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
