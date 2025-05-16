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
      title: "Revivle",
      description:
        "Create an online store from your closet. Sell your clothes, shoes, and accessories.",
      image: "/images/revivle.png",
      link: "https://www.revivle.com/home",
      tags: ["HTML", "CSS"],
      type: "image" as const,
    },
    {
      title: "Clarity",
      description:
        "The next-generation social calendar app. Connect with your friends and family to plan events.",
      image: "/images/clarity.png",
      link: "https://www.clarity.fo",
      tags: ["Next.js", "PostgreSQL", "Tailwind CSS"],
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
      title: "Snake Game",
      description: "A snake game built with React, Next.js, and TypeScript.",
      image: "/images/snake.png",
      link: "/snake",
      tags: ["Next.js", "React", "Tailwind CSS"],
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
      title: "Freelance Software Engineer (remote)",
      company: "Various",
      period: "Oct 2024 - Present",
      description: [
        "BrianTylerCohen - created Discord bot to allow Substack subscribers to verify status, increasing participation rate by 200%",
        "Revivle - Developed landing and clost page components for redesigned website, leading to 200% increase in mobile sign-ups",
        "Clarity - Developed entire MVP for social calendar web app including user auth",
      ],
    },
    {
      title: "Senior Front-End Developer",
      company: "Artie",
      period: "Sept 2022 - Jan 2024",
      description: [
        "Owned the development and maintenance of PongLegends.com, a full-stack Next.js web app delivering a WebGL-based 3D gaming experience to thousands of monthly active users.",
        "Developed a React.js-based web application allowing quality assurance testers to access in-development NFTs, reducing the amount of visual bugs shipped by 90%",
        "Led a project to allowing holders of Artie NFTs to use them as playable characters within the game, leading to a 50% increase in player engagement among players who synced their NFTs",
      ],
    },
    {
      title: "Full-Stack Software Engineer",
      company: "Fluxon",
      period: "Aug 2021 - Aug 2022",
      description: [
        "Built the infrastructure for the launch of a food delivery startup using Next.js for the front-end and postgresql for the backend",
        "Architected and developed a React.js based reference front-end application for a healthcare startup’s API product, making that API available to thousands of front-end JavaScript developers",
      ],
    },
    {
      title: "Dash Core Developer",
      company: "Plotly",
      period: "Aug 2018 - May 2021",
      description: [
        "Led a project to simultaneously update the versions of several dozen Python packages used in Dash Enterprise’s documentation, delivering major security and usability improvements to hundreds of clients",
        "Responsible for implementing a top-down redesign of plotly.com to focus more on converting enterprise customers, leading to 35% more enterprise customer booked in the next sales quarter",
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
            "As a senior full-stack engineer with 7+ years of experience, I specialize in building modern, scalable web applications with Next.js, React, and Node.js. My work spans data visualization tools, interactive web services, and AI-powered products—most recently for @BrianTylerCohen's YouTube channel (3M+ subscribers). I'm passionate about elegant UI, robust architecture, and delivering seamless user experiences that blend performance with thoughtful design."
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
