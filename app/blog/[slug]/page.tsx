import Link from "next/link";

interface BlogPostParams {
  params: {
    slug: string;
  };
}

export default function BlogPost({ params }: BlogPostParams) {
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
          prose-p:!text-gray-600 dark:prose-p:!text-gray-300 
          prose-li:!text-gray-600 dark:prose-li:!text-gray-300 
          prose-pre:!bg-gray-100 dark:prose-pre:!bg-gray-800 
          prose-pre:!border prose-pre:!border-gray-200 
          dark:prose-pre:!border-gray-700 prose-pre:!rounded-lg"
        >
          <header className="mb-16 not-prose">
            <div className="flex gap-2 mb-6">
              <span className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                Next.js
              </span>
              <span className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                Tutorial
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Blog Post Title
            </h1>
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
              <p>Joseph Damiba</p>
              <span>•</span>
              <time>January 1, 2024</time>
            </div>
          </header>

          <section>
            <p>
              Your blog post content goes here. This template supports markdown
              styling through the @tailwindcss/typography plugin.
            </p>

            <h2>Section Heading</h2>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua.
            </p>

            <pre>
              <code>
                {`// Code example
const greeting = "Hello, World!";
console.log(greeting);`}
              </code>
            </pre>

            <blockquote>
              This is a blockquote. It can be used to highlight important quotes
              or statements in your blog post.
            </blockquote>
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
