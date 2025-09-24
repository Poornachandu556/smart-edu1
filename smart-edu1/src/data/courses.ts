export type Course = {
  id: string;
  title: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  description: string;
  youtubePlaylistUrl: string;
  youtubeChannel: string;
  image: string; // public path
  tags?: string[];
};

export const courses: Course[] = [
  {
    id: "js-fundamentals",
    title: "JavaScript Fundamentals",
    level: "Beginner",
    description:
      "Learn variables, functions, arrays, objects, DOM, and modern ES features.",
    youtubePlaylistUrl: "https://www.youtube.com/playlist?list=PLillGF-RfqbYE6Ik_EuXA2iZFcE082B3s",
    youtubeChannel: "Traversy Media",
    image: "https://images.unsplash.com/photo-1579468118864-1b9ea3c0db4a?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3",
    tags: ["Web", "JavaScript"],
  },
  {
    id: "ts-for-devs",
    title: "TypeScript for Developers",
    level: "Intermediate",
    description:
      "Strong typing, generics, unions, narrowing, and Next.js integration.",
    youtubePlaylistUrl: "https://youtube.com/playlist?list=PL1BztTYDF-QNrddrcvejiw5vxSZSPIRfn&si=VH4oJo8wl7U8n2wB",
    youtubeChannel: "The Net Ninja",
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3",
    tags: ["Web", "TypeScript"],
  },
  {
    id: "react-essentials",
    title: "React Essentials",
    level: "Beginner",
    description:
      "Hooks, props/state, effects, routing basics, and component patterns.",
    youtubePlaylistUrl: "https://youtu.be/CgkZ7MvWUAA?si=3Jlsxja-PP4LsbJ-",
    youtubeChannel: "Web Dev Simplified",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3",
    tags: ["Web", "React"],
  },
  {
    id: "nextjs-pro",
    title: "Next.js in Practice",
    level: "Intermediate",
    description:
      "App Router, server components, API routes, auth, and deployment.",
    youtubePlaylistUrl: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9i0_2FF-WhtRIfIJ1lXlTZR",
    youtubeChannel: "The Net Ninja",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3",
    tags: ["Web", "Next.js"],
  },
  {
    id: "python-basics",
    title: "Python Basics",
    level: "Beginner",
    description:
      "Syntax, data structures, file I/O, and simple scripting projects.",
    youtubePlaylistUrl: "https://www.youtube.com/playlist?list=PL-osiE80TeTs4UjLw5MM6OjgkjFeUxCYH",
    youtubeChannel: "Corey Schafer",
    image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3",
    tags: ["Python"],
  },
  {
    id: "ds-algo",
    title: "Data Structures & Algorithms",
    level: "Advanced",
    description:
      "Big-O, arrays, linked lists, trees, graphs, DP, and problem solving.",
    youtubePlaylistUrl: "https://www.youtube.com/playlist?list=PL9gnSGHSqcnr_DxHsP7AW9ftq0AtAyYqJ",
    youtubeChannel: "take U forward",
    image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3",
    tags: ["Algorithms", "Interview"],
  },
  {
    id: "react-native",
    title: "React Native Mobile Apps",
    level: "Intermediate",
    description:
      "Build cross-platform iOS/Android apps with React Native and Expo.",
    youtubePlaylistUrl: "https://youtube.com/playlist?list=PLC3y8-rFHvwhiQJD1di4eRVN30WWCXkg1&si=1PDjcpYmhywHwJN5",
    youtubeChannel: "The Net Ninja",
    image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3",
    tags: ["Mobile", "React Native"],
  },
  {
    id: "flutter-basics",
    title: "Flutter Basics",
    level: "Beginner",
    description:
      "Get started with Flutter widgets, state, navigation, and layouts.",
    youtubePlaylistUrl: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9jLYyp2Aoh6hcWuxFDX6PBJ",
    youtubeChannel: "The Net Ninja",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3",
    tags: ["Mobile", "Flutter"],
  },
  {
    id: "node-express",
    title: "Node.js & Express APIs",
    level: "Intermediate",
    description:
      "REST APIs with Express, middleware, auth, and deployment.",
    youtubePlaylistUrl: "https://www.youtube.com/playlist?list=PLillGF-RfqbYRpji8t4SxUkMxfowG4Kqp",
    youtubeChannel: "Traversy Media",
    image: "https://images.unsplash.com/photo-1627398242454-45a1465c2479?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3",
    tags: ["Backend", "Node.js"],
  },
  {
    id: "django-web",
    title: "Django Web Development",
    level: "Intermediate",
    description:
      "Models, views, templates, auth, and building full-stack apps.",
    youtubePlaylistUrl: "https://www.youtube.com/playlist?list=PL-osiE80TeTs4UjLw5MM6OjgkjFeUxCYH",
    youtubeChannel: "Corey Schafer",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3",
    tags: ["Python", "Web"],
  },
  {
    id: "sql-postgresql",
    title: "SQL & PostgreSQL",
    level: "Beginner",
    description:
      "Write SQL queries, joins, indexes, and design relational schemas.",
    youtubePlaylistUrl: "https://www.youtube.com/playlist?list=PLzMcBGfZo4-nyLTlSRBvo0zjSnCnqjHYQ",
    youtubeChannel: "Tech With Tim",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3",
    tags: ["SQL", "Database"],
  },
  {
    id: "system-design",
    title: "System Design Essentials",
    level: "Advanced",
    description:
      "Scalability, caching, queues, sharding, and real-world architectures.",
    youtubePlaylistUrl: "https://www.youtube.com/playlist?list=PLMCXHnjXnTnvo6alSjVkgxV-VH6EPyvoX",
    youtubeChannel: "Gaurav Sen",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3",
    tags: ["System Design"],
  },
  {
    id: "python-ml",
    title: "Machine Learning with Python",
    level: "Intermediate",
    description:
      "Pandas, scikit-learn, model evaluation, and ML workflows.",
    youtubePlaylistUrl: "https://www.youtube.com/playlist?list=PLWKjhJtqVAbkFiqHnNaxpOPhh9tSWMXIF",
    youtubeChannel: "freeCodeCamp.org",
    image: "https://images.unsplash.com/photo-1555949963-aa79dcee981d?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3",
    tags: ["ML", "Python"],
  },
  {
    id: "deep-learning",
    title: "Deep Learning Foundations",
    level: "Advanced",
    description:
      "Neural networks, CNNs/RNNs, training tricks, and PyTorch basics.",
    youtubePlaylistUrl: "https://www.youtube.com/playlist?list=PLZSO_6-bSqHQHBCoGaObUljoXAyyqhpFW",
    youtubeChannel: "deeplizard",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3",
    tags: ["Deep Learning"],
  },
  {
    id: "devops-docker",
    title: "Docker & DevOps Basics",
    level: "Beginner",
    description:
      "Docker images, containers, compose, and CI/CD fundamentals.",
    youtubePlaylistUrl: "https://www.youtube.com/playlist?list=PL4cUxeGkcC9i0_2FF-WhtRIfIJ1lXlTZR",
    youtubeChannel: "The Net Ninja",
    image: "https://images.unsplash.com/photo-1605379399642-870262d3d051?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3",
    tags: ["DevOps", "Docker"],
  },
  {
    id: "linux-shell",
    title: "Linux & Shell Scripting",
    level: "Beginner",
    description:
      "Command line, bash scripting, permissions, and tooling.",
    youtubePlaylistUrl: "https://www.youtube.com/playlist?list=PLS1QulWo1RIYmaxcEqw5JhK3b-6rgdWO_",
    youtubeChannel: "ProgrammingKnowledge",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3",
    tags: ["Linux", "Shell"],
  },
  {
    id: "os-concepts",
    title: "Operating Systems Concepts",
    level: "Intermediate",
    description:
      "Processes, threads, scheduling, memory, and file systems.",
    youtubePlaylistUrl: "https://youtube.com/playlist?list=PLxCzCOWd7aiGz9donHRrE9I3Mwn6XdP8p&si=9vnO-j079AX1pXMc",
    youtubeChannel: "Gate Smashers",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3",
    tags: ["OS"],
  },
  {
    id: "dbms",
    title: "DBMS for Interviews",
    level: "Intermediate",
    description:
      "Relational design, normalization, transactions, and indexes.",
    youtubePlaylistUrl: "https://youtube.com/playlist?list=PLrL_PSQ6q062cD0vPMGYW_AIpNg6T0_Fq&si=KUIP_RKrvi9vL-12",
    youtubeChannel: "Knowledge Gate",
    image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3",
    tags: ["DBMS", "Interview"],
  },
  {
    id: "networks",
    title: "Computer Networks",
    level: "Intermediate",
    description:
      "OSI/TCP-IP, routing, switching, and network protocols.",
    youtubePlaylistUrl: "https://youtube.com/playlist?list=PLBlnK6fEyqRgMCUAG0XRw78UA8qnv6jEx&si=V4fYmT_f8sOpzV5W",
    youtubeChannel: "Knowledge Gate",
    image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3",
    tags: ["Networks"],
  },
  {
    id: "aptitude",
    title: "Aptitude & Quantitative Prep",
    level: "Beginner",
    description:
      "Arithmetic, algebra, probability, and interview-style problems.",
    youtubePlaylistUrl: "https://youtube.com/playlist?list=PL4HVBri7hrFPiM0JAKLILQ0ZKCF2fI5T0&si=vYbXfcLFN9FCFtbv",
    youtubeChannel: "TalentSprint Aptitude Prep",
    image: "https://old.svcetedu.org/wp-content/uploads/2020/03/footer-logo.jpg",
    tags: ["Aptitude"],
  },
  {
    id: "thinker-lab",
    title: "Thinker Lab",
    level: "Beginner",
    description:
      "Hands-on STEM projects, tinkering, and creative making for curious minds.",
    youtubePlaylistUrl: "https://www.youtube.com/@TinkerStudiobyMahamani",
    youtubeChannel: "Tinker Studio by Mahamani",
    image: "https://yt3.googleusercontent.com/wUGAqp8PkuSeA6LOeN6KkdQQjtuwPyj7UeE9RyE3Xyjp2zLHVhj_y0afVkSIWzeEil3eYIAAfg=s900-c-k-c0x00ffffff-no-rj",
    tags: ["STEM", "Maker"],
  },
];


