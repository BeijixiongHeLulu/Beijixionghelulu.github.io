import { defineSiteConfig } from "./src/config/site";
export const siteConfig = defineSiteConfig({
  title: "Jianshu Wang",
  author: "Jianshu Wang",
  siteUrl: "https://beijixionghelulu.github.io",
  description:
    "Academic profile of Jianshu Wang. Research interests in human factors, cognitive neuroscience, and behavioral modeling.",
  keywords: [
    "human factors",
    "cognitive neuroscience",
    "behavioral modeling",
    "human-computer interaction",
    "psychology",
  ],
  hero: {
    headline: "Human Factors | Cognitive Neuroscience | Behavioral Modeling",
    subheadline: "Research Assistant, Lifedu Educational Technology Co., Ltd.",
    profileImage: "/assets/img/profile.jpg",
    profileAlt: "Jianshu Wang",
  },
  affiliations: [
    {
      role: "Research Assistant",
      institution: "Lifedu Educational Technology Co., Ltd.",
    },
  ],
  socialLinks: [
    {
      label: "Email",
      href: "mailto:jishuu825@gmail.com",
      icon: "i-mdi:email-outline",
    },
    {
      label: "Google Scholar",
      href: "https://scholar.google.com/citations?user=Zs9zJOMAAAAJ",
      icon: "i-academicons:google-scholar",
    },
    {
      label: "CV",
      href: "/assets/pdf/CV_Jianshu_Wang.pdf",
      icon: "i-mdi:file-pdf-box",
    },
  ],
  navLinks: [
    { href: "/", label: "about" },
    { href: "/publications/", label: "publications" },
    { href: "/projects/", label: "research" },
    { href: "/portfolio/", label: "portfolio" },
    { href: "/cv/", label: "CV" },
    { href: "/hobby/", label: "hobby" },
  ],
  footer: { showAuthor: true, showProfileLinks: false, copyright: "" },
  pageTitles: {
    researches: {
      title: "publications",
      description:
        "Published articles, submitted manuscripts, and earlier preprints.",
    },
    projects: {
      title: "research",
      description:
        "Selected research in EEG/ERP analysis, behavioral modeling, cognitive neuroscience, and human-computer interaction.",
    },
  },
  homeBlocks: {
    hero: { enabled: true },
    showcase: { enabled: false },
    publications: {
      enabled: true,
      title: "selected publications",
      description: "",
    },
    posts: { enabled: false },
  },
});
export default siteConfig;
