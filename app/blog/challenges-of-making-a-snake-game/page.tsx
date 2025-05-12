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
              The Journey to a Modern Snake Roguelite in React & Next.js
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
              This is the story of how a simple idea—remaking Snake in React and
              Next.js—turned into a journey through classic gameplay, sound
              experiments, AI tournaments, and finally a server-driven
              roguelite. Here&apos;s how the project evolved, what we learned,
              and why the roguelite design stuck.
            </p>

            <h2>1. How We Started: Classic Snake in React</h2>
            <p>
              The project began with a straightforward goal: build a modern,
              visually dynamic Snake game using React and Next.js. The first
              version was a faithful recreation of the classic: a single snake,
              apples, and the challenge of surviving as long as possible. This
              phase was all about getting the basics right—movement, collision,
              apple spawning, and a clean UI.
            </p>

            <h2>2. The Sound Game Detour</h2>
            <p>
              Inspired by rhythm games, we experimented with a sound-based Snake
              variant. The idea was to have the snake&apos;s movement and apple
              collection generate musical notes, creating a reactive audio
              experience. We prototyped sound triggers and even mapped snake
              actions to musical scales. Ultimately, the sound game was set
              aside: it was fun, but distracted from the core gameplay and made
              the codebase harder to maintain.
            </p>

            <h2>3. The Tournament Phase: AI, Brackets, and Playstyles</h2>
            <p>
              Next, we went big: a full tournament mode with 8 unique AI snakes,
              each with its own name, color, and playstyle. The game featured a
              bracket system, 1v1 matches, and a &quot;score to beat&quot;
              mechanic. Each AI had a preferred apple shape and a distinct
              pathfinding algorithm. This phase taught us a lot about state
              management, UI overlays, and the complexity of orchestrating
              multi-run tournaments in React.
            </p>
            <p>
              While the tournament mode was fun and technically impressive, it
              made the game harder to pick up and replay. The codebase grew
              complex, and the user experience felt less focused.
            </p>

            <h2>
              4. The Roguelite Pivot: Simplicity, Upgrades, and Replayability
            </h2>
            <p>
              We decided to pivot to a roguelite design. Now, the game is all
              about the core loop: start a run, play until you die, pick an
              upgrade, and try again with your new powers. Upgrades are
              persistent for your session, letting you stack abilities and push
              for higher scores. The UI is streamlined: just the board, the
              upgrade screen, and a start button. This made the game more
              accessible, more replayable, and easier to maintain.
            </p>
            <ul>
              <li>
                <strong>Start a Run:</strong> Hit the Start Game button to begin
                a new run.
              </li>
              <li>
                <strong>Play:</strong> Survive as long as you can, eating apples
                and avoiding walls and yourself.
              </li>
              <li>
                <strong>Death & Upgrades:</strong> When you die, you&apos;re
                presented with a choice of upgrades (e.g., speed boost, extra
                length per apple, shield, magnet).
              </li>
              <li>
                <strong>Repeat:</strong> Start a new run with all your
                accumulated upgrades. Try to beat your high score!
              </li>
            </ul>

            <h2>
              5. Server-Driven Architecture: Moving Game Logic to the Backend
            </h2>
            <p>
              To keep the client light and the game logic robust, we moved all
              stateful logic to the server. The client now sends actions (start,
              tick, choose-upgrade) to a single API endpoint, and the server
              returns the updated game state. This made the game easier to test,
              extend, and debug, and allowed for future features like persistent
              user progress or multiplayer.
            </p>

            <h2>6. Technical Challenges & Lessons Learned</h2>
            <p>
              Along the way, we hit plenty of technical hurdles. Here are some
              of the most interesting:
            </p>

            <h3>Apple Spawning: Ensuring Apples Always Appear</h3>
            <p>
              In the roguelite, apples are spawned server-side using a simple
              random placement algorithm that avoids the snake&apos;s body. This
              ensures apples always appear, and the logic is easy to reason
              about and debug:
            </p>
            <CodeBlock
              language="typescript"
              code={String.raw`function randomApples(count: number, gridSize: number, snakeBody: [number, number][]) {
  const apples: [number, number, string, string, string][] = [];
  const colors = ["#FF4136", "#0074D9", "#2ECC40", "#B10DC9", "#FF851B", "#3D9970", "#F012BE", "#FFDC00"];
  const shapes = ["circle", "x", "triangle", "pentagon", "hexagon", "square", "heptagon", "octagon"];
  const occupied = new Set(snakeBody.map(([x, y]) => \`\${x},\${y}\`));
  while (apples.length < count) {
    const ax = Math.floor(Math.random() * gridSize);
    const ay = Math.floor(Math.random() * gridSize);
    if (!occupied.has(\`\${ax},\${ay}\`) && !apples.some(([x, y]) => x === ax && y === ay)) {
      apples.push([
        ax,
        ay,
        colors[Math.floor(Math.random() * colors.length)],
        "",
        shapes[Math.floor(Math.random() * shapes.length)],
      ]);
    }
  }
  return apples;
}`}
            />

            <h3>Server-Driven Game Loop: The API Handler</h3>
            <p>
              The main game loop and all state transitions are handled on the
              server. The client sends actions (start, tick, choose-upgrade) to
              a single endpoint, and the server returns the updated state.
              Here&apos;s a simplified version of the POST handler:
            </p>
            <CodeBlock
              language="typescript"
              code={`export async function POST(req: NextRequest) {
  const body = await req.json();
  const action = body.action;

  if (action === "start") {
    // Initialize game state
    // ...
    return NextResponse.json(gameState);
  }
  if (action === "tick") {
    // Move snake, check collisions, eat apples
    // ...
    return NextResponse.json(gameState);
  }
  if (action === "choose-upgrade") {
    // Add upgrade to state
    // ...
    return NextResponse.json(gameState);
  }
  return NextResponse.json({ error: "Unknown action" }, { status: 404 });
}`}
            />

            <h3>Upgrade Selection and Persistence</h3>
            <p>
              When the player dies, the server offers a choice of upgrades. The
              selected upgrade is added to the persistent state for the session,
              and the next run starts with all accumulated upgrades:
            </p>
            <CodeBlock
              language="typescript"
              code={`if (action === "choose-upgrade") {
  if (body.upgradeKey && !gameState.upgrades.includes(body.upgradeKey)) {
    gameState.upgrades.push(body.upgradeKey);
  }
  return NextResponse.json(gameState);
}`}
            />

            <h3>Color Consistency: Why Is My Snake Two Colors?</h3>
            <p>
              Sometimes a snake&apos;s body would appear in two different
              colors. This happened because body segments from different snakes
              could be merged, or color assignment wasn&apos;t consistent. The
              fix was to ensure each snake&apos;s <code>bodyColor</code> was
              assigned once and never mixed, and that body arrays were never
              merged between snakes.
            </p>
            <CodeBlock
              language="typescript"
              code={`body: Array.from(
  { length: 5 },
  (_, j) => [Math.floor(gridSize / 2) - j, Math.floor(gridSize / 2)] as [number, number]
),`}
            />

            <h3>Hydration Mismatches & SSR: The Perils of Randomness</h3>
            <p>
              Next.js apps render on both the server and client, which means any
              random values or browser-only APIs (like <code>localStorage</code>
              ) can cause hydration mismatches. We used a{" "}
              <code>hasMounted</code> flag and only rendered the game UI after
              the component had mounted on the client.
            </p>
            <CodeBlock
              language="typescript"
              code={`const [hasMounted, setHasMounted] = useState(false);
useEffect(() => { setHasMounted(true); }, []);
if (!hasMounted) return null;`}
            />

            <h3>TypeScript: Tuple Types and Linter Woes</h3>
            <p>
              TypeScript is great for catching bugs, but sometimes its
              strictness can be a hurdle. For example, we got this error:
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

            <h3>Modularization: Keeping the Codebase Maintainable</h3>
            <p>
              As the game grew, we broke it into multiple files:{" "}
              <code>gameOfLife.ts</code> for the Game of Life logic,{" "}
              <code>colorUtils.ts</code> for color helpers,{" "}
              <code>SnakeHandlers.ts</code> for event logic, and a custom{" "}
              <code>useSnakeGame</code> hook for state. This made the code much
              easier to reason about and extend.
            </p>

            <h3>Persistent State: Tracking the Longest Snake</h3>
            <p>
              We wanted to track the longest snake ever achieved, even across
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
              <li>
                Simplicity in game flow and UI makes for a more maintainable and
                fun experience.
              </li>
              <li>
                Giving players persistent upgrades and a clear loop makes the
                game more replayable and engaging.
              </li>
              <li>
                Server-driven game logic keeps the client light and the codebase
                easy to reason about.
              </li>
            </ul>

            <p>
              Building a Snake roguelite was a fun and surprisingly deep
              technical challenge. If you&apos;re tackling a similar project, I
              hope these real-world examples help you avoid some of the pitfalls
              I encountered!
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
