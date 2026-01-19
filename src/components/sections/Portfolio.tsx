import { CommentList } from "@/components/comments/CommentList";
import { PortfolioContent, ProjectItem } from "./PortfolioContent";

export function Portfolio() {
    const projects: ProjectItem[] = [
        {
            id: "pine",
            slug: "pine",
            title: "PINE",
            category: "Backend (Fullstack)",
            tag: "PC Web",
            thumbnail: "/images/pine-thumb.png",
            description: "k-문화를 알리는 커뮤니티 사이트. JSP와 Spring Boot, MYSQL을 활용하여 구현했습니다.",
            url: "http://3.35.102.140.nip.io:8070/", // Add your URL here
            isNew: true,
            commentSection: <CommentList projectSlug="pine" />
        },
        {
            id: "Jimbim",
            slug: "Jimbim",
            title: "Jimbim",
            category: "Backend (Fullstack)",
            tag: "PC Web",
            thumbnail: "/images/jimbim-thumb.png",
            description: "'짐을 비우다.' 중고거래 플랫폼을 구현했습니다. Spring Boot와 React, MYSQL, Postgresql을 활용하여 구현했으며, ec2 docker를 활용하여 배포했습니다. 또한 웹소켓을 활용한 채팅기능을 추가하여 실시간 거래와 GPT 토큰을 활용한 챗봇기능을 제공합니다.",
            url: "http://3.38.18.208/", // Add your URL here
            pdf: "/중고거래플랫폼_JIMBIM.pdf",
            isNew: true,
            commentSection: <CommentList projectSlug="Jimbim" />
        },
        {
            id: "XRhub",
            slug: "XRhub",
            title: "XRhub",
            category: "Frontend",
            tag: "PC/M Responsive Web",
            thumbnail: "/images/xrhub-thumb.png",
            description: "내가 원하는대로 직접 만드는 메타버스 vr 가상전시관.",
            url: "https://www.xrhub.co.kr/index.html", // Add your URL here
            isNew: true,
            commentSection: <CommentList projectSlug="XRhub" />
        },
        {
            id: "korail",
            slug: "korail",
            title: "Korail",
            category: "Frontend",
            tag: "PC/M Responsive Web",
            thumbnail: "/images/korail-thumb.gif",
            description: "코레일의 서울역을 메타버스로 구현한 가상 전시관",
            url: "https://ksmart.myds.me/korail_vr/vtour/", // Add your URL here
            commentSection: <CommentList projectSlug="korail" />
        },
        {
            id: "hyundai-wia",
            slug: "hyundai-wia",
            title: "Hyundai Wia",
            category: "Frontend",
            tag: "PC/M Responsive Web",
            thumbnail: "/images/hw-thumb.png",
            description: "vr로 구현한 현대위아 제품을 소개하는 가상 전시관",
            url: "https://virtual-autoparts.hyundai-wia.com/vr/index.html", // Add your URL here
            commentSection: <CommentList projectSlug="hyundai-wia" />
        },
        {
            id: "lgensol",
            slug: "lgensol",
            title: "LG 에너지솔루션",
            category: "Frontend",
            tag: "PC/M Responsive Web",
            thumbnail: "/images/lgensol-thumb.png",
            description: "LG 에너지솔루션의 실제 코엑스 전시관과, 다양한 미래산업 제품들을 전시한 가상 전시관",
            url: "https://virtual.lgensol.com/index.html", // Add your URL here
            commentSection: <CommentList projectSlug="lgensol" />
        },
        {
            id: "Doosan",
            slug: "Doosan",
            title: "Doosan heritage 1896",
            category: "Frontend",
            tag: "PC/M Responsive Web",
            thumbnail: "/images/doosan-thumb.gif",
            description: "두산의 역사를 전시한 vr 가상 박물관.",
            url: "https://www.doosanheritage1896.com/doosan_vr/doosan2/index.html", // Add your URL here
            commentSection: <CommentList projectSlug="doosan" />
        },
        {
            id: "posco",
            slug: "posco",
            title: "POSCO",
            category: "Frontend",
            tag: "PC/M Responsive Web",
            thumbnail: "/images/posco-thumb.png",
            description: "포스코의 실제 전시 행사를 vr로 구현한 가상 전시관",
            url: "http://product.posco.com/posco2/index.html", // Add your URL here
            commentSection: <CommentList projectSlug="posco" />
        },

    ];

    return <PortfolioContent projects={projects} />;
}
