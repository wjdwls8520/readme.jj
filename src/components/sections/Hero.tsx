import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Mail, Phone, MapPin, Calendar, Clock, Briefcase } from "lucide-react";

export function Hero() {
    const profile = {
        name: "김정진",
        role: "풀스택 개발자",
        exp: "프론트엔드 3년, 백엔드 신입",
        birth: "95년생 (31)",
        address: "경기도 고양시 덕양구",
        phone: "010-3641-2532",
        email: "wjdwls8520@gmail.com"
    };

    return (
        <section id="hero" className="flex min-h-[80vh] flex-col justify-center py-20 bg-white">
            <div className="container max-w-5xl px-4 md:px-6">
                <div className="flex flex-col md:flex-row gap-12 md:gap-20 items-center justify-center">

                    {/* Profile Image - Brunch Style (Clean & Soft) */}
                    <div className="relative group shrink-0">
                        <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-tr from-gray-50 to-gray-100 opacity-60 blur-2xl group-hover:opacity-100 transition-opacity duration-700"></div>
                        <div className="relative h-72 w-72 md:h-96 md:w-96 overflow-hidden rounded-[2rem] shadow-2xl ring-1 ring-gray-100 rotate-2 hover:rotate-0 transition-transform duration-500 ease-out">
                            <Image
                                src="/images/profile-image.jpg"
                                alt="프로필 사진"
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                        </div>
                    </div>

                    {/* Profile Info */}
                    <div className="flex flex-col space-y-8 max-w-xl text-center md:text-left animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        <div className="space-y-4">
                            <span className="inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-bold text-primary tracking-wide">
                                {profile.role}
                            </span>
                            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl font-serif">
                                {profile.name}
                            </h1>
                            <p className="text-xl text-gray-500 leading-relaxed font-sans">
                                프론트엔드 실무 <span className="text-gray-900 font-semibold">"경험"</span>위에 <br /> 백엔드 <span className="text-gray-900 font-semibold">"지식"</span>을 <br />더했습니다.
                            </p>
                        </div>

                        {/* Info Grid - Modern IT Style */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-left bg-gray-50/50 p-6 rounded-2xl border border-gray-100/50 hover:border-primary/20 transition-colors">
                            <div className="flex items-center gap-3 text-gray-600">
                                <Briefcase className="h-4 w-4 text-primary shrink-0" />
                                <span className="text-sm font-medium">{profile.exp}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <Calendar className="h-4 w-4 text-primary shrink-0" />
                                <span className="text-sm font-medium">{profile.birth}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <MapPin className="h-4 w-4 text-primary shrink-0" />
                                <span className="text-sm font-medium">{profile.address}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600">
                                <Phone className="h-4 w-4 text-primary shrink-0" />
                                <span className="text-sm font-medium">{profile.phone}</span>
                            </div>
                            <div className="flex items-center gap-3 text-gray-600 sm:col-span-2">
                                <Mail className="h-4 w-4 text-primary shrink-0" />
                                <span className="text-sm font-medium">{profile.email}</span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex gap-4 justify-center md:justify-start pt-2">
                            <Link href="#portfolio" className="rounded-full bg-gray-900 px-8 py-3.5 text-sm font-bold text-white shadow-lg hover:bg-black hover:-translate-y-1 transition-all">
                                프로젝트 보기
                            </Link>
                            <a href="mailto:wjdwls8520@gmail.com" className="rounded-full border border-gray-200 bg-white px-8 py-3.5 text-sm font-bold text-gray-600 hover:border-primary hover:text-primary hover:-translate-y-1 transition-all">
                                연락하기
                            </a>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
