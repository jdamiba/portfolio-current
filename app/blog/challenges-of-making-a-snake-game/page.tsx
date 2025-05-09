"use client";

import Link from "next/link";
import CodeBlock from "@/app/components/CodeBlock";

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
                React
              </span>
              <span className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                Next.js
              </span>
              <span className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                Game Dev
              </span>
              <span className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                TypeScript
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Challenges of Making a Modern Snake Game in React & Next.js
            </h1>
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
              <p>Joseph Damiba</p>
              <span>•</span>
              <time>
                {new Date().toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
            </div>
          </header>

          <section>
            <p>
              <strong>What is Snake?</strong> Snake is a classic arcade game
              where you control a line (the &quot;snake&quot;) that grows longer
              each time it eats food, but you lose if you run into yourself or
              the walls. The challenge is to survive as long as possible while
              the snake gets longer and harder to maneuver.
            </p>
            <p>
              <strong>What is Conway&apos;s Game of Life?</strong> The Game of
              Life is a famous cellular automaton invented by mathematician John
              Conway. It consists of a grid of cells that &quot;live&quot; or
              &quot;die&quot; based on simple rules about their neighbors,
              creating fascinating patterns that evolve over time. In this
              project, I used the Game of Life to generate dynamic apple
              patterns for the Snake game.
            </p>
            <p>
              Building a Snake game might seem simple at first glance, but as I
              discovered while developing a feature-rich, visually dynamic
              version in React and Next.js, there are plenty of subtle and
              not-so-subtle challenges along the way. In this post, I&apos;ll
              share some of the real-world issues I encountered, how I debugged
              them, and the lessons learned—using examples from my own code and
              development process.
            </p>

            <h2>1. Apple Spawning: When Apples Refuse to Appear 🍏</h2>
            <p>
              One of the first issues I ran into was apples not spawning as
              expected. My game used a Game of Life mechanic to generate apples,
              but sometimes the grid would stabilize with no apples, or the
              forbidden set for apple spawning was too restrictive. Here&apos;s
              a snippet of the logic:
            </p>
            <CodeBlock
              language="typescript"
              code={`const forbidden = new Set(
  newSnakes.flatMap((s) => s.body.map(([x, y]) => \`${"${x},${y}"}\`))
);
const updated = nextLifeGrid(nextGrid, forbidden);
if (getAliveCells(updated).length === 0) {
  return createRandomPatternGrid(gridSize, 7, 3, 2, 2, 1);
}`}
            />
            <p>
              The solution? I had to carefully balance the forbidden set and add
              fallbacks to ensure apples would always respawn, even if the Game
              of Life grid died out.
            </p>

            <h2>2. Color Consistency: Why Is My Snake Two Colors?</h2>
            <p>
              Another subtle bug: sometimes a snake&apos;s body would appear in
              two different colors. This happened because body segments from
              different snakes could be merged, or color assignment wasn&apos;t
              consistent. Here&apos;s a real example of the type definition and
              initialization:
            </p>
            <CodeBlock
              language="typescript"
              code={`body: Array.from(
  { length: 5 },
  (_, j) => [Math.floor(gridSize / 2) - j, Math.floor(gridSize / 2)] as [number, number]
),`}
            />
            <p>
              The fix was to ensure that each snake&apos;s{" "}
              <code>bodyColor</code> was assigned once and never mixed, and that
              body arrays were never merged between snakes.
            </p>

            <h2>3. Hydration Mismatches & SSR: The Perils of Randomness</h2>
            <p>
              Next.js apps render on both the server and client, which means any
              random values or browser-only APIs (like <code>localStorage</code>
              ) can cause hydration mismatches. I saw warnings like:
            </p>
            <CodeBlock
              language="text"
              code={`Hydration failed because the server rendered HTML didn&apos;t match the client.`}
            />
            <p>
              The solution was to use a <code>hasMounted</code> flag and only
              render the game UI after the component had mounted on the client:
            </p>
            <CodeBlock
              language="typescript"
              code={`const [hasMounted, setHasMounted] = useState(false);
useEffect(() => { setHasMounted(true); }, []);
if (!hasMounted) return null;`}
            />

            <h2>4. TypeScript: Tuple Types and Linter Woes</h2>
            <p>
              TypeScript is great for catching bugs, but sometimes its
              strictness can be a hurdle. For example, I got this error:
            </p>
            <CodeBlock
              language="text"
              code={`Type &apos;number[][]&apos; is not assignable to type &apos;[number, number][]&apos;.
  Type &apos;number[]&apos; is not assignable to type &apos;[number, number]&apos;.`}
            />
            <p>The fix? Explicitly cast arrays to the correct tuple type:</p>
            <CodeBlock
              language="typescript"
              code={`let newBody = ([[x, y], ...snake.body]) as [number, number][];`}
            />

            <h2>5. Modularization: Keeping the Codebase Maintainable</h2>
            <p>
              As the game grew, I broke it into multiple files:{" "}
              <code>gameOfLife.ts</code> for the Game of Life logic,{" "}
              <code>colorUtils.ts</code> for color helpers,{" "}
              <code>SnakeHandlers.ts</code> for event logic, and a custom{" "}
              <code>useSnakeGame</code> hook for state. This made the code much
              easier to reason about and extend.
            </p>

            <h2>6. Persistent State: Tracking the Longest Snake</h2>
            <p>
              I wanted to track the longest snake ever achieved, even across
              reloads. The solution was to use <code>localStorage</code> and
              only access it after mount:
            </p>
            <CodeBlock
              language="typescript"
              code={`useEffect(() => {
  setHasMounted(true);
  try {
    const stored = localStorage.getItem("longestSnakeLength");
    if (stored) setLongestSnakeLength(Number(stored));
  } catch (e) {}
}, []);`}
            />

            <h2>Lessons Learned</h2>
            <ul>
              <li>Always be mindful of SSR vs. client-only code in Next.js.</li>
              <li>
                TypeScript tuple types can save you from subtle bugs, but
                require careful casting.
              </li>
              <li>
                Modularizing your codebase early pays off as features grow.
              </li>
              <li>
                Hydration mismatches are often caused by randomness or browser
                APIs—render only after mount if needed.
              </li>
              <li>
                Debugging is easier when you log and visualize state changes
                (e.g., snake colors, apple positions).
              </li>
            </ul>

            <p>
              Building a Snake game was a fun and surprisingly deep technical
              challenge. If you&apos;re tackling a similar project, I hope these
              real-world examples help you avoid some of the pitfalls I
              encountered!
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
