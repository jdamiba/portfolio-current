"use client";

import { Space_Grotesk } from "next/font/google";
import { motion } from "framer-motion";
import { Separator } from "./components/ui/separator";
import { ProjectCard } from "./components/ProjectCard";
import { BlogPostCard } from "./components/BlogPostCard";
import { ExperienceItem } from "./components/ExperienceItem";
import { Hero } from "./components/Hero";
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

export default function Home() {
  const projects = [
    {
      title: "PopcornAI",
      description:
        "Get movie recommendations based on your resume. Winner of the 2025 SampleApp.ai Hackathon.",
      image: "/images/popcorn.png",
      link: "https://popcornai.vercel.app",
      tags: ["Next.js", "Qdrant", "Tailwind CSS"],
      type: "image" as const,
    },
    {
      title: "What It's Like To Learn About LangChain",
      description:
        "A short film I produced, wrote, and starred in about learning about the LangChain framework.",
      image: "/images/langchain.png",
      link: "https://youtu.be/yGZ_L1uLa5g",
      tags: ["Technical Writing", "Python", "AI"],
      type: "video" as const,
      videoId: "yGZ_L1uLa5g",
    },
    {
      title: "Photogen",
      description:
        "A full-stack Next.js application serving an AI image generator, with the ability to create models based on your own likeness.",
      image: "/images/photogen.png",
      link: "https://photogen.dev",
      tags: ["Next.js", "Replicate", "Tailwind CSS"],
      type: "image" as const,
    },
    {
      title: "Ives",
      description:
        "An AI powered project manager for your job search. Get matched with jobs and generate a calendar for your side-projects.",
      image: "/images/ives.png",
      link: "https://ives-frontend.vercel.app/",
      tags: ["Next.js", "Qdrant"],
      type: "image" as const,
    },
    {
      title: "IO Plasma Torus Simulation",
      description: "A 3D plasma torus simulation using WebGL and Three.js.",
      image: "/images/plasma.png",
      link: "https://io-plasma-torus.vercel.app/",
      tags: ["Next.js", "Three.js"],
      type: "image" as const,
    },
  ];

  const blogPosts = [
    {
      title: "Building a Music Recommendation System Pt. 1",
      description:
        "Let's build an application that can visit Pitchfork and get music reviews.",
      link: "/blog/music-recommendations-pt1",
      tags: ["Qdrant", "Node.js", "Browserbase"],
    },
    {
      title: "Upserting Twitch Live Chat Messages Into a Vector Database",
      description:
        "Building a Node.js server that listens to Twitch live chat messages and upserts them into a vector database.",
      link: "/blog/upserting-twitch-live-chats-vector-db",
      tags: ["Qdrant", "Node.js", "Twitch API"],
    },
    {
      title: "Implementing Vector Search Using Qdrant and Next.js",
      description:
        "A tutorial on how to implement vector search in Next.js using Qdrant.",
      link: "/blog/implementing-vector-search-qdrant-nextjs",
      tags: ["AI", "JavaScript", "Tutorial"],
    },
    {
      title: "Introducing Ives - Your Project Manager for Your Job Search",
      description: "An AI powered project manager for your job search.",
      link: "/blog/introducing-ives",
      tags: ["AI", "JavaScript", "Tutorial"],
    },
    {
      title: "Challenges of Making a Modern Snake Game in React & Next.js",
      description:
        "Lessons learned and real-world debugging stories from building a feature-rich Snake game with React, Next.js, and TypeScript.",
      link: "/blog/challenges-of-making-a-snake-game",
      tags: ["React", "Next.js", "Game Dev", "TypeScript"],
    },
  ];

  const experiences = [
    {
      title: "Backend Engineer",
      company: "@BrianTylerCohen YouTube",
      period: "Oct 2024 - Present",
      description: [
        "Architected and maintained a Node.js web service transforming live stream chats into real-time data visualizations",
        "Developed a Discord bot for Substack subscribers, enabling seamless authentication and exclusive content access.",
        "Led backend infrastructure decisions, ensuring scalability and efficiency.",
      ],
    },
    {
      title: "Senior Front-End Developer",
      company: "Artie",
      period: "Sept 2022 - Jan 2024",
      description: [
        "Owned the development and maintenance of PongLegends.com, a full-stack Next.js web app delivering a 3D gaming experience.",
        "Championed UI/UX enhancements, reducing page load time by 30% and increasing engagement metrics",
        "Collaborated with backend engineers to optimize API consumption and ensure seamless data synchronization.",
      ],
    },
    {
      title: "Full-Stack Software Engineer",
      company: "Fluxon",
      period: "Aug 2021 - Aug 2022",
      description: [
        "Led a team of engineers in feature development for a food delivery startup using Next.js and Google Firebase",
        "Designed and developed a complete user interface component library (35+ components) meant to consume a healthcare API being developed by a healthcare startup with over $3 billion valuation",
      ],
    },
    {
      title: "Front-End Developer",
      company: "Plotly",
      period: "Aug 2018 - May 2021",
      description: [
        "Developed and maintained Plotly's React-based Next.js marketing site, improving performance and user engagement.",
        "Collaborated with the open-source community to enhance Dash (Python, R, and Julia) visualization documentation.",
        "Worked closely with designers and marketers to launch high-impact feature pages and optimize conversion funnels.",
      ],
    },
  ];

  return (
    <div
      className={`min-h-screen bg-background text-foreground ${spaceGrotesk.variable}`}
    >
      <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <Hero
          intro={
            "As a senior full-stack engineer with 6+ years of experience, I specialize in building modern, scalable web applications with Next.js, React, and Node.js. My work spans data visualization tools, interactive web services, and AI-powered products—most recently for @BrianTylerCohen's YouTube channel (3M+ subscribers). I'm passionate about elegant UI, robust architecture, and delivering seamless user experiences that blend performance with thoughtful design."
          }
        />

        <Separator className="my-16" />

        {/* Featured Projects Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-20"
          id="projects"
        >
          <h2 className="mb-8 text-3xl font-bold tracking-tight">
            Featured Projects
          </h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {projects.map((project, index) => (
              <ProjectCard key={index} project={project} />
            ))}
          </div>
        </motion.section>

        <Separator className="my-16" />

        {/* Experience Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-20"
          id="experience"
        >
          <h2 className="mb-8 text-3xl font-bold tracking-tight">Experience</h2>
          <div className="mt-8">
            {experiences.map((experience, index) => (
              <ExperienceItem key={index} experience={experience} />
            ))}
          </div>
        </motion.section>

        <Separator className="my-16" />

        {/* Blog Posts Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-20"
          id="blog"
        >
          <h2 className="mb-8 text-3xl font-bold tracking-tight">Blog Posts</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {blogPosts.map((post, index) => (
              <BlogPostCard key={index} post={post} />
            ))}
          </div>
        </motion.section>

        {/* Footer */}
        <footer className="mt-20 flex flex-col items-center justify-center text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Joseph Damiba. All rights reserved.
          </p>
          <p className="mt-2">
            Built with Next.js, Tailwind CSS, and shadcn/ui
          </p>
        </footer>
      </main>
    </div>
  );
}
