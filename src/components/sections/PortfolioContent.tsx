"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export type Category = "Frontend" | "Backend (Fullstack)";

export interface ProjectItem {
    id: string;
    slug: string;
    title: string;
    category: Category;
    tag: string;
    description: string;
    url?: string;
    thumbnail?: string;
    pdf?: string;
    commentSection: React.ReactNode;
}

interface PortfolioContentProps {
    projects: ProjectItem[];
}

import Image from "next/image";

const TABS: Category[] = ["Backend (Fullstack)", "Frontend"];

export function PortfolioContent({ projects }: PortfolioContentProps) {
    const [activeTab, setActiveTab] = useState<Category>("Backend (Fullstack)");

    const filteredProjects = projects.filter(project => project.category === activeTab);

    return (
        <section id="portfolio" className="py-24 bg-gray-50">
            <div className="container">
                <div className="flex flex-col items-center mb-12 space-y-6">
                    <div className="flex flex-col items-center space-y-2">
                        <h2 className="text-3xl font-bold text-gray-900 font-serif">Portfolio</h2>
                        <div className="h-1 w-12 bg-primary rounded-full"></div>
                    </div>

                    {/* Tabs */}
                    <div className="flex p-1 bg-white rounded-full border border-gray-200 shadow-sm">
                        {TABS.map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-6 py-2 rounded-full text-sm font-bold transition-all duration-300",
                                    activeTab === tab
                                        ? "bg-primary text-white shadow-md"
                                        : "text-gray-400 hover:text-gray-600"
                                )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid gap-12 max-w-4xl mx-auto min-h-[500px]">
                    {filteredProjects.map((project) => (
                        <article key={project.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300 animate-in fade-in slide-in-from-bottom-4">
                            <div className="h-72 bg-gray-100 relative group overflow-hidden">
                                {project.thumbnail ? (
                                    <Image
                                        src={project.thumbnail}
                                        alt={project.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-400">
                                        Project Image ({project.title})
                                    </div>
                                )}
                            </div>
                            <div className="p-8 md:p-10">
                                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                                    <h3 className="text-2xl font-bold text-gray-900">{project.title}</h3>
                                    <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                        <span className="px-3 py-1 bg-soft/20 text-secondary text-xs font-bold rounded-full uppercase tracking-wide whitespace-nowrap">{project.tag}</span>

                                        {/* Website Button */}
                                        {project.url && (
                                            <a
                                                href={project.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-1.5 bg-gray-900 text-white text-xs font-bold rounded-full hover:bg-black transition-colors flex items-center gap-1 whitespace-nowrap"
                                            >
                                                Visit Website
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path></svg>
                                            </a>
                                        )}

                                        {/* PDF Button */}
                                        {project.pdf && (
                                            <a
                                                href={project.pdf}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="px-4 py-1.5 border border-primary text-primary hover:bg-primary hover:text-white text-xs font-bold rounded-full transition-colors flex items-center gap-1 whitespace-nowrap"
                                            >
                                                View PDF
                                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                            </a>
                                        )}
                                    </div>
                                </div>
                                <p className="text-gray-600 leading-relaxed mb-8 border-b border-gray-100 pb-8">
                                    {project.description}
                                </p>

                                <h4 className="flex items-center gap-2 text-sm font-bold text-gray-400 mb-6 uppercase tracking-wider">
                                    <span className="w-2 h-2 rounded-full bg-accent"></span>
                                    Guestbook
                                </h4>
                                {/* Render the slot passed from Server */}
                                {project.commentSection}
                            </div>
                        </article>
                    ))}

                    {filteredProjects.length === 0 && (
                        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
                            <p className="text-gray-400 text-sm">해당 카테고리의 프로젝트가 준비 중입니다.</p>
                        </div>
                    )}
                </div>

                {/* Navigation Button */}
                <div className="flex justify-center mt-12 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                    <button
                        onClick={() => {
                            const target = activeTab === "Backend (Fullstack)" ? "Frontend" : "Backend (Fullstack)";
                            setActiveTab(target);
                            // Optional: Scroll to top of portfolio section
                            document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" });
                        }}
                        className="group relative inline-flex items-center gap-2 px-8 py-4 bg-white border border-gray-200 rounded-full text-gray-900 font-bold shadow-sm hover:shadow-md hover:border-primary/50 transition-all duration-300"
                    >
                        <span>
                            {activeTab === "Backend (Fullstack)" ? "Frontend 프로젝트 보러가기" : "Backend 프로젝트 보러가기"}
                        </span>
                        <svg
                            className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </section>
    );
}
