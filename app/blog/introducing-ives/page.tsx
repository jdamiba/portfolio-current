"use client";

import Link from "next/link";

export default function BlogPost() {
  return (
    <div className="min-h-screen p-8 sm:p-20">
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
                Next.js
              </span>
              <span className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                Qdrant
              </span>
              <span className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                Vector Search
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Introducing Ives - Your Project Manager for Your Job Search
            </h1>
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
              <p>Joseph Damiba</p>
              <span>•</span>
              <time>March 19, 2025</time>
            </div>
          </header>

          <section>
            <p>
              Looking for a job as a software engineer in today&apos;s job
              market is a daunting task. With so many engineers looking for work
              as a result of the mass layoffs the industry has seen over the
              last few years, the competition for a limited number of roles has
              become fierce. To stand out, job seekers need to both be able to
              target jobs they are well-suited for and be able to demonstrate to
              their potential employers that they have the technical
              capabilities to excel on the job.
            </p>

            <p>
              However, this is a really tough task even for developers with tons
              of experience. It can take hours to go through job boards like
              Indeed or LinkedIn looking for jobs that fit your resume. Even
              more time is spent planning and building projects which
              demonstrate one&apos;s technical chops. As software engineers we
              might be adept at building servers and wrangling CSS, but many of
              us struggle with the project management side of the job search.
              Whole weeks can go by without committing any code to GitHub or
              submitting any job applications, leaving you feeling more
              demoralized as the job search continues.
            </p>

            <p>
              That&apos;s why along with my brother,{" "}
              <a href="https://www.twitter.com/ptdamiba"></a>Thierry Damiba, we
              have created <a href="https://ives-frontend.vercel.app/">Ives</a>,
              an AI-powered project manager that helps software engineers
              structure their efforts while you search for work. All you need to
              do is to upload your resume, and Ives takes care of everything
              else, creating a personalized calendar of daily activities for you
              to perform, which culminate in you deploying projects that
              demonstrate your skillset to hiring managers and recruiters.{" "}
            </p>

            <p>
              Ives has two main features. The first feature is job matching,
              where we use vector search to find roles which match the
              user&apos;s skillset. This alone can save hours every week, giving
              job seekers direction in terms of which jobs to apply for. Instead
              of performing basic keyword search to identify jobs that users are
              good matches for, we create vector embeddings of job postings and
              use cosine similarity to find jobs that are close to our
              user&apos;s profile. This allows us to use the semantic
              information in a post to match with a user, rather than relying on
              a recruiter to write the perfect job description.
            </p>

            <p>
              The second feature that Ives is bringing to job seekers is an
              adaptive calendar, where the app will build a custom week-long
              plan for you that helps you actually ship projects. Just like a
              project manager at a startup,{" "}
              <a href="https://ives-frontend.vercel.app/">Ives</a> can break
              down projects into manageable chunks and help you organize your
              time to be able to build and ship more projects.
            </p>

            <p>
              If you are on the job hunt, try out{" "}
              <a href="https://ives-frontend.vercel.app/">Ives</a> today. We
              would love to hear your experience with the product and get your
              feedback!
            </p>
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
