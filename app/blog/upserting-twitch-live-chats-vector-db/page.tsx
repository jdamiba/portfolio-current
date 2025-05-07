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
                Node.js
              </span>
              <span className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                Qdrant
              </span>
              <span className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                Twitch API
              </span>
              <span className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                Redis
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Getting Twitch Live Chat Messages Into a Vector Database
            </h1>
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
              <p>Joseph Damiba</p>
              <span>•</span>
              <time>March 21, 2025</time>
            </div>
          </header>

          <section>
            <p>
              We are in a golden age of vector search, where providers such as
              Qdrant and Pinecone have made it easier than ever to extract
              insights from the high-dimensional data that embedding models
              produce. However, in order to perform vector search, first you
              need to actually create your embeddings and get them into your
              vector database.
              <p>
                In this blog post, we will build a Node.js server that listens
                to live chat messages on a Twitch stream and then gets those
                messages into a Qdrant vector database. In another post, we will
                explore building a frontend that allows us to perform vector
                search on this data.
              </p>
              <p>
                The first thing we need to do is to intialize our Node.js
                project:
              </p>
              <CodeBlock language="typescript" code={`npm init -y`} />{" "}
              <p>
                Then, we can install the dependencies we will need for this
                project:
              </p>
              <CodeBlock
                language="typescript"
                code={`npm install dotenv redis tmi.js @qdrant/js-client-rest openai uuid    `}
              />{" "}
              <p>
                Next, we can create a .env file to store our environment
                variables:
              </p>
              <CodeBlock language="typescript" code={`touch .env`} />
              <p>
                We are going to need a QDRANT_URL variable that points to the
                URL of your Qdrant cluster if you are using Qdrant Cloud or to
                the local address if you are using Qdrant locally. We also need
                a QDRANT_API_KEY variable, which can be found in your Qdrant
                account. We also need an OPENAI_API_KEY to use OpenAI&apos;s
                text embedding model and finally, a TWITCH_CHANNEL variable that
                points to the channel you want to listen to for messages.
              </p>
              <p>
                Now, we can create a file called index.js, which will be our
                entry point for the Node.js script:
              </p>
              <CodeBlock language="typescript" code={`touch index.js`} />
              <p>
                First, things first, we need to import the necessary
                dependencies:
              </p>
              <CodeBlock
                language="typescript"
                code={`
//index.js
require("dotenv").config();
const tmi = require("tmi.js");
const Redis = require("redis");
const { QdrantClient } = require("@qdrant/js-client-rest");
const OpenAI = require("openai");
const { v4: uuidv4 } = require("uuid");
`}
              />
            </p>
            <p>
              {" "}
              Next, we need to initialize our client libraries for Qdrant,
              OpenAI, Redis, and Twitch
            </p>
            <CodeBlock
              language="typescript"
              code={`
//index.js
// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize Qdrant client
const qdrantClient = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

// Initialize Redis client
const redisClient = Redis.createClient({
  url: "redis://localhost:6379", // Default local Redis server URL
});

// Initialize Twitch client
const twitchClient = new tmi.Client({
  channels: [process.env.TWITCH_CHANNEL],
});
`}
            />
            <p>
              With our client libraries initalized, we can create a connections
              to our Redis and Twitch clients and ensure that we have a
              collection set up to store embeddings in Qdrant.{" "}
            </p>
            <CodeBlock
              language="typescript"
              code={`
//index.js
// Connect to Redis
async function main() {
  await redisClient.connect();

  // Check if collection exists
  try {
    const collections = await qdrantClient.getCollections();
    const collectionExists = collections.collections.some(
      (collection) => collection.name === "kai_cenat_twitch_messages"
    );

    if (!collectionExists) {
      // Create Qdrant collection if it doesn't exist
      await qdrantClient.createCollection("kai_cenat_twitch_messages", {
        vectors: {
          size: 1536, // OpenAI text-embedding-3-small dimension size
          distance: "Cosine",
        },
      });
      console.log("Created new collection with correct vector size");
    } else {
      console.log("Collection already exists, skipping creation");
    }
  } catch (error) {
    console.error("Error checking/creating collection:", error.message);
  }
}

main().catch(console.error);

// Connect to Twitch
twitchClient.connect();

            `}
            />
            <p>
              Now, we are ready to recieve Twitch messages. When we get one from
              Twitch&apos;s servers, we want to store it in Redis. We can do
              this by using the on function on our Twitch client.
            </p>
            <CodeBlock
              language="typescript"
              code={`
//index.js
// Listen for chat messages
twitchClient.on("message", async (channel, tags, message, self) => {
  if (self) return; // Ignore messages from the bot itself

  const chatMessage = {
    channel,
    username: tags.username,
    message,
    timestamp: new Date().toISOString(),
  };

  // Save message to Redis
  await redisClient.lPush("chat_messages", JSON.stringify(chatMessage));
});

            `}
            />
            <p>
              Next, we need to create a function that will look at Redis and
              parse individual messages. We then create an embedding of the
              message, and upsert it into our Qdrant cluster.
            </p>
            <CodeBlock
              language="typescript"
              code={`
//index.js
// Function to process Redis messages and store in Qdrant
async function processMessagesAndStore() {
  try {
    // Check if the Redis client is connected
    if (!redisClient.isOpen) {
      console.error(
        "Redis client is not connected. Attempting to reconnect..."
      );
      await redisClient.connect();
    }

    const messages = await redisClient.lRange("chat_messages", 0, -1);

    if (messages.length === 0) {
      console.log("No messages to process.");
      return;
    }

    for (const messageJson of messages) {
      const message = JSON.parse(messageJson);

      try {
        // Get embeddings for the message
        const embedding = await getEmbeddings(message.message);

        // Store in Qdrant with UUID
        await qdrantClient.upsert("kai_cenat_twitch_messages", {
          points: [
            {
              id: uuidv4(),
              vector: embedding,
              payload: {
                channel: message.channel,
                username: message.username,
                message: message.message,
                timestamp: message.timestamp,
              },
            },
          ],
        });

        console.log(\`Stored embedding for message from \$\{message.username\}\`);
      } catch (error) {
        console.error("Error processing message:", error);
      }
    }

    // Clear Redis after successful processing
    await redisClient.del("chat_messages");
    console.log(\`Processed \${messages.length} messages\`);
  } catch (error) {
    console.error("Error in processMessagesAndStore:", error);
  }
}
            `}
            />
            <p>
              Finally, we can use JavaScript&apos;s setInterval() function to
              run our function every five seconds.
            </p>
            <CodeBlock
              language="typescript"
              code={`
//index.js
// Schedule periodic processing (every 5 seconds)
setInterval(processMessagesAndStore, 5000);

console.log(
  "Twitch chat logger started with OpenAI embeddings and Qdrant storage."
);

// Ensure proper cleanup when the server is shutting down
process.on("SIGINT", async () => {
  console.log("Shutting down...");
  await redisClient.quit();
  process.exit(0);
});
            `}
            />
            <p>
              And that&apos;s it!. We now have a functioning Node.js script that
              can listen to Twitch and process messages into our Qdrant cluster.
            </p>
            <p>
              Stay tuned for the next post in this series, where we will build a
              frontend that uses this data.
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
