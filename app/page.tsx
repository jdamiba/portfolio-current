"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-4xl mx-auto">
        <header className="mb-16">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Joseph Damiba</h1>
          <h2 className="text-xl sm:text-2xl text-gray-600 dark:text-gray-300">
            Senior Full-Stack Engineer
          </h2>
        </header>

        <section className="mb-16">
          <h3 className="text-2xl font-bold mb-6">About Me</h3>
          <p className="text-lg text-gray-700 dark:text-gray-200 mb-4">
            Senior software engineer with 6 years of experience specializing in
            full-stack development with Next.js, React, and Node.js. Currently
            building data visualization tools and web services at
            @BrianTylerCohen YouTube (3 million+ subscribers).
          </p>
        </section>

        <section className="mb-16">
          <h3 className="text-2xl font-bold mb-6">Featured Projects</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <a
              href="https://photogen.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 transition-all hover:border-gray-400 dark:hover:border-gray-600 hover:shadow-lg"
            >
              <h4 className="text-xl font-bold mb-2">Photogen</h4>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                A full-stack Next.js application serving an AI image generator,
                with the ability to create models based on your own likeness.
              </p>
              <div className="flex gap-2">
                <span className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                  Next.js
                </span>
                <span className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                  Replicate
                </span>
                <span className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                  Tailwind CSS
                </span>
              </div>
            </a>

            <a
              href="https://youtu.be/yGZ_L1uLa5g"
              target="_blank"
              rel="noopener noreferrer"
              className="border border-gray-200 dark:border-gray-800 rounded-lg p-6 transition-all hover:border-gray-400 dark:hover:border-gray-600 hover:shadow-lg"
            >
              <h4 className="text-xl font-bold mb-2">
                What It&apos;s Like To Learn About LangChain
              </h4>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                A short film I produced, wrote, and starred in about learning
                about the LangChain framework.
              </p>
              <div className="flex gap-2">
                <span className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                  Technical Writing
                </span>
                <span className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                  Python
                </span>
                <span className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                  AI
                </span>
              </div>
            </a>
          </div>
        </section>

        <section className="mb-16">
          <h3 className="text-2xl font-bold mb-6">Experience</h3>
          <div className="space-y-8">
            <div>
              <h4 className="text-xl font-bold">Backend Engineer</h4>
              <p className="text-gray-600 dark:text-gray-300">
                @BrianTylerCohen YouTube • Oct 2024 - Present
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-700 dark:text-gray-200">
                <li>
                  Architected and maintained a Node.js web service transforming
                  live stream chats into real-time data visualizations
                </li>
                <li>
                  Developed a Discord bot for Substack subscribers, enabling
                  seamless authentication and exclusive content access.
                </li>
                <li>
                  Led backend infrastructure decisions, ensuring scalability and
                  efficiency.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-bold">Senior Front-End Developer</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Artie • Sept 2022 - Jan 2024
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-700 dark:text-gray-200">
                <li>
                  Owned the development and maintenance of PongLegends.com, a
                  full-stack Next.js web app delivering a 3D gaming experience.
                </li>
                <li>
                  Championed UI/UX enhancements, reducing page load time by 30%
                  and increasing engagement metrics
                </li>
                <li>
                  Collaborated with backend engineers to optimize API
                  consumption and ensure seamless data synchronization.
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-bold">
                Full-Stack Software Engineer
              </h4>
              <p className="text-gray-600 dark:text-gray-300">
                Fluxon • Aug 2021 - Aug 2022
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-700 dark:text-gray-200">
                <li>
                  Led a team of engineers in feature development for a food
                  delivery startup using Next.js and Google Firebase
                </li>
                <li>
                  Designed and developed a complete user interface component
                  library (35+ components) meant to consume a healthcare API
                  being developed by a healthcare startup with over $3 billion
                  valuation
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-xl font-bold">Front-End Developer</h4>
              <p className="text-gray-600 dark:text-gray-300">
                Plotly • Aug 2018 - May 2021
              </p>
              <ul className="list-disc list-inside mt-2 text-gray-700 dark:text-gray-200">
                <li>
                  Developed and maintained Plotly’s React-based Next.js
                  marketing site, improving performance and user engagement.
                </li>
                <li>
                  Collaborated with the open-source community to enhance Dash
                  (Python, R, and Julia) visualization documentation.
                </li>
                <li>
                  Worked closely with designers and marketers to launch
                  high-impact feature pages and optimize conversion funnels.
                </li>
              </ul>
            </div>
          </div>
        </section>

        <footer className="flex gap-6">
          <Link
            href="https://github.com/jdamiba"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            target="_blank"
          >
            GitHub
          </Link>
          <Link
            href="https://linkedin.com/in/joseph-damiba"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            target="_blank"
          >
            LinkedIn
          </Link>
        </footer>
      </main>
    </div>
  );
}
