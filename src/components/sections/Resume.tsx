import { InteractiveCanvas } from "./InteractiveCanvas";

export function Resume() {
    return (
        <section id="resume" className="relative min-h-[60vh] flex items-center justify-center overflow-hidden py-24">
            {/* 3D Background */}
            <InteractiveCanvas />

            {/* Content Overlay */}
            <div className="container relative z-10 mx-auto px-4 max-w-4xl text-center">
                <div className="glass-panel p-12 rounded-3xl border border-white/20 shadow-xl backdrop-blur-md bg-white/30 hover:bg-white/40 transition-colors duration-500">
                    <h2 className="text-3xl font-bold mb-6 text-gray-900 font-serif">Resume</h2>
                    <p className="mb-10 text-gray-800 text-lg max-w-2xl mx-auto font-medium">
                        감각적인 디지털 경험을 통해 저의 여정과 기술을 탐험해보세요.
                        <br />
                        <span className="text-sm font-normal text-gray-600 mt-2 block">
                            (마우스를 움직여 배경의 3D 오브젝트와 상호작용해보세요)
                        </span>
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <a
                            href="/resume.pdf"
                            download="정진_이력서.pdf"
                            className="bg-primary text-white hover:bg-primary/90 px-8 py-4 rounded-full font-bold transition-all transform hover:scale-105 shadow-lg active:scale-95 flex items-center gap-2"
                        >
                            <span>PDF 이력서 다운로드</span>
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        </a>
                        <div className="flex items-center gap-4 text-gray-700">
                            <a href="mailto:wjdwls8520@gmail.com" className="hover:text-primary transition-colors font-medium">정진님께 메일 보내기</a>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
