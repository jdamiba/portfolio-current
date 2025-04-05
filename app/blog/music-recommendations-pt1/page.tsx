"use client";

import Link from "next/link";

export default function BlogPost() {
  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="max-w-3xl mx-auto">
        <nav className="mb-16">
          <Link
            href="/"
            className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            ← Back to home
          </Link>
        </nav>

        <article
          className="prose dark:prose-invert lg:prose-lg max-w-none 
          prose-h1:!text-4xl prose-h1:!sm:text-5xl 
          prose-h2:!text-3xl prose-h2:!sm:text-4xl 
          prose-h3:!text-2xl prose-h3:!sm:text-3xl 
          prose-h2:!mt-12 prose-h3:!mt-8 
          prose-p:!text-gray-800 dark:prose-p:!text-gray-200 
          prose-li:!text-gray-800 dark:prose-li:!text-gray-200 
          prose-pre:!p-0 
          prose-pre:!bg-transparent dark:prose-pre:!bg-transparent 
          prose-pre:!border-0
          prose-code:!text-gray-800 dark:prose-code:!text-gray-200"
        >
          <header className="mb-16 not-prose">
            <div className="flex gap-2 mb-6">
              <span className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                Node.js
              </span>
              <span className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                Qdrant
              </span>
              <span className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                Browserbase
              </span>
              <span className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                StageHand
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Music Recommendation System Pt 1
            </h1>
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
              <p>Joseph Damiba</p>
              <span>•</span>
              <time>March 23, 2025</time>
            </div>
          </header>

          <section>
            <p>
              I love listening to music, but it&apos;s hard to find new music
              that I like. Over the years I have picked up a few tricks here and
              there, like following DJs whose taste I vibe with or looking up
              which record label put out an album I like and seeing what other
              artists have released music on that label.
            </p>
            <p>
              With the advent of vector search databases, I now have a new tool
              in my toolbelt. In this series of posts, I am going to build a
              music recommendations site built on vector embeddings of reviews
              of music albums.
            </p>
            <p>
              In order to save myself some time, I am going to use StageHand, a
              web automation library, to visit the music review site and get the
              text of music reviews into my application.
            </p>
            <p>
              Then, I will use an embedding model to create vectors out of the
              text of the music review, and then upsert those embeddings into my
              vector database.
            </p>
            <p>
              With my embeddings in my vector database, I can then build a front
              end user interface that interacts with my embeddings to recommend
              me music.
            </p>
            <p>Let&apos;s get started!</p>
          </section>
        </article>

        <footer className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex gap-6">
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
            </div>
            <Link
              href="/"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              ← Back to home
            </Link>
          </div>
        </footer>
      </main>
    </div>
  );
}
