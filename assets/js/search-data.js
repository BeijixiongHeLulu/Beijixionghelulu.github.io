// get the ninja-keys element
const ninja = document.querySelector('ninja-keys');

// add the home and posts menu items
ninja.data = [{
    id: "nav-about",
    title: "about",
    section: "Navigation",
    handler: () => {
      window.location.href = "/";
    },
  },{id: "nav-publications",
          title: "publications",
          description: "Published articles, submitted manuscripts, and earlier preprints.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/publications/";
          },
        },{id: "nav-research",
          title: "research",
          description: "Selected research in EEG/ERP analysis, behavioral modeling, cognitive neuroscience, and human-computer interaction.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/projects/";
          },
        },{id: "nav-cv",
          title: "CV",
          description: "Psychology training, EEG/ERP analysis, computational behavioral modeling, and HCI research. Download the full CV using the PDF icon.",
          section: "Navigation",
          handler: () => {
            window.location.href = "/cv/";
          },
        },{id: "nav-hobby",
          title: "hobby",
          description: "",
          section: "Navigation",
          handler: () => {
            window.location.href = "/hobby/";
          },
        },{id: "news-started-a-research-internship-at-the-institute-of-software-chinese-academy-of-sciences",
          title: 'Started a research internship at the Institute of Software, Chinese Academy of Sciences....',
          description: "",
          section: "News",},{id: "news-our-paper-on-the-moral-effects-of-ai-regulation-was-accepted-by-acta-psychologica-sinica-in-september-2025",
          title: 'Our paper on the moral effects of AI regulation was accepted by Acta...',
          description: "",
          section: "News",},{id: "news-new-preprint-on-motion-intensity-visual-target-congruency-and-cognition-in-hci-is-available-on-arxiv",
          title: 'New preprint on motion intensity, visual-target congruency, and cognition in HCI is available...',
          description: "",
          section: "News",},{id: "news-our-paper-on-interbrain-synchronization-and-interpersonal-emotion-regulation-is-now-online-in-emotion",
          title: 'Our paper on interbrain synchronization and interpersonal emotion regulation is now online in...',
          description: "",
          section: "News",},{id: "projects-community-evaluations-and-evidence-accumulation",
          title: 'Community Evaluations and Evidence Accumulation',
          description: "EEG analysis and behavioral modeling of implicit community evaluations and resident well-being.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/00-eeg-behavioral-modeling/";
            },},{id: "projects-human-factors-in-driving-takeover",
          title: 'Human Factors in Driving Takeover',
          description: "Cognitive load, warning timing, and situation-awareness recovery in automated driving.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/01-driving-takeover/";
            },},{id: "projects-human-performance-during-whole-body-motion",
          title: 'Human Performance During Whole-Body Motion',
          description: "Unity experiments and task-relative motion analysis on a 6-DOF platform.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/02-motion-performance/";
            },},{id: "projects-human-ai-ethics",
          title: 'Human-AI Ethics',
          description: "PsychoPy experiments and mixed-effects analysis of AI supervision and ethical decisions.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/03-human-ai-ethics/";
            },},{id: "projects-behavioral-decision-modeling",
          title: 'Behavioral Decision Modeling',
          description: "Drift diffusion and reinforcement-learning models for loss and compensatory decisions.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/05-behavioral-decision-modeling/";
            },},{id: "projects-eeg-and-erp-analysis",
          title: 'EEG and ERP Analysis',
          description: "Neural data analysis in studies of effort-based behavior and social relationships.",
          section: "Projects",handler: () => {
              window.location.href = "/projects/06-eeg-erp-analysis/";
            },},{
        id: 'social-cv',
        title: 'CV',
        section: 'Socials',
        handler: () => {
          window.open("/assets/pdf/CV_Jianshu_Wang.pdf", "_blank");
        },
      },{
        id: 'social-email',
        title: 'email',
        section: 'Socials',
        handler: () => {
          window.open("mailto:%6A%69%73%68%75%75%38%32%35@%67%6D%61%69%6C.%63%6F%6D", "_blank");
        },
      },{
        id: 'social-rss',
        title: 'RSS Feed',
        section: 'Socials',
        handler: () => {
          window.open("/feed.xml", "_blank");
        },
      },{
        id: 'social-scholar',
        title: 'Google Scholar',
        section: 'Socials',
        handler: () => {
          window.open("https://scholar.google.com/citations?user=Zs9zJOMAAAAJ", "_blank");
        },
      },{
      id: 'light-theme',
      title: 'Change theme to light',
      description: 'Change the theme of the site to Light',
      section: 'Theme',
      handler: () => {
        setThemeSetting("light");
      },
    },
    {
      id: 'dark-theme',
      title: 'Change theme to dark',
      description: 'Change the theme of the site to Dark',
      section: 'Theme',
      handler: () => {
        setThemeSetting("dark");
      },
    },
    {
      id: 'system-theme',
      title: 'Use system default theme',
      description: 'Change the theme of the site to System Default',
      section: 'Theme',
      handler: () => {
        setThemeSetting("system");
      },
    },];
