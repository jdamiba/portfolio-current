"use client";

import Link from "next/link";
import CodeBlock from "@/app/components/CodeBlock";

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
                TensorFlow
              </span>
              <span className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                Qdrant
              </span>
              <span className="text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded">
                Vector Search
              </span>
            </div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Implementing Vector Search Using Qdrant and Next.js
            </h1>
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
              <p>Joseph Damiba</p>
              <span>•</span>
              <time>March 11, 2025</time>
            </div>
          </header>

          <section>
            <p>
              Vector search has revolutionized how we find similar content
              across various domains, from images to text. In this post,
              I&apos;ll walk through implementing an image similarity search
              application using Next.js, TensorFlow.js, and Qdrant - a powerful
              vector database.
            </p>

            <h2>What We Are Building</h2>
            <p>We&apos;ll create a web application that:</p>
            <ul>
              <li>1. Allows users to upload ground-truth images</li>
              <li>
                2. Converts the ground-truth images into vector embeddings using
                TensorFlow.js and MobileNet
              </li>
              <li>3. Stores these embeddings in a Qdrant collection</li>
              <li>4. Allows users to to upload target imges</li>
              <li>
                5. Converts the target images into vector embeddings using
                TensorFlow.js and MobileNet
              </li>
              <li>6. Performs a vector search against the Qdrant collection</li>
              <li>7. Displays the results to the user</li>
            </ul>
            <h2>Understanding the Components</h2>
            <p>
              Before diving into the implementation, let&apos;s understand our
              key tools:
            </p>
            <ul>
              <li>
                <strong>Next.js:</strong> Our React framework for building the
                application
              </li>
              <li>
                <strong>MobileNet:</strong> A pre-trained convolutional neural
                network that can extract meaningful features from images while
                being lightweight enough to run in the browser.
              </li>
              <li>
                <strong>Qdrant:</strong> A vector search provider that excels at
                storing and querying high-dimensional vectors, perfect for our
                image embeddings.
              </li>
            </ul>
            <h3>Understanding Vector Embeddings </h3>
            <p>
              Vector embeddings are numerical representations of data that
              capture semantic meaning. For images, these embeddings represent
              visual features like shapes, textures, and objects. When we run an
              image through MobileNet, it generates a 1280-dimensional vector
              that represents the image&apos;s features. Similar images will
              have vectors that are close to each other in this high-dimensional
              space.
            </p>
            <h3>Setting Up The Project</h3>
            <p>
              First, let&apos;s create a new Next.js project with TypeScript
              support, and install the necessary dependencies. We&apos;ll use
              the official Next.js project creation tool, which sets up all the
              basic configuration for us. The additional packages we&apos;re
              installing are:
            </p>
            <ul>
              <li>
                <code>@tensorflow/tfjs</code>: The core TensorFlow.js library
                that allows us to run machine learning models in JavaScript
              </li>
              <li>
                <code>@tensorflow-models/mobilenet</code>: A pre-trained neural
                network that can analyze images
              </li>
              <li>
                <code>qdrant-js</code>: The JavaScript client for interacting
                with our Qdrant vector database
              </li>
            </ul>
            <CodeBlock
              language="bash"
              code={`npx create-next-app@latest image-similarity-search
cd image-similarity-search
npm install @tensorflow/tfjs @tensorflow-models/mobilenet qdrant-js`}
            />
            <p>
              Next, we&apos;ll create the core functionality that converts
              images into vector embeddings. This is where the magic happens -
              we&apos;ll use the MobileNet model to analyze images and generate
              numerical representations (vectors) that capture their visual
              features.
            </p>
            <p>Here&apos;s how the code works:</p>
            <ul>
              <li>
                We first load the MobileNet model (only once) and keep it in
                memory
              </li>
              <li>
                For each image, we:
                <ol>
                  <li>Convert it from base64 format to a buffer</li>
                  <li>Resize it to 224x224 pixels (what MobileNet expects)</li>
                  <li>
                    Convert it to a tensor (a special format for machine
                    learning)
                  </li>
                  <li>Generate predictions and embeddings using MobileNet</li>
                  <li>Clean up the memory to prevent leaks</li>
                </ol>
              </li>
            </ul>
            <CodeBlock
              language="typescript"
              code={`// utils/embedding-node.ts
import * as tf from "@tensorflow/tfjs";
import * as mobilenet from "@tensorflow-models/mobilenet";
import sharp from "sharp";

let model: mobilenet.MobileNet | null = null;

async function loadModel() {
  if (!model) {
    // Use CPU backend instead of WASM
    await tf.setBackend("cpu");
    model = await mobilenet.load({ version: 2, alpha: 1.0 });
  }
  return model;
}

export async function generateEmbedding(
  base64Image: string
): Promise<number[]> {
  try {
    const mobileNetModel = await loadModel();

    // Convert base64 to buffer
    const imageBuffer = Buffer.from(base64Image, "base64");

    // Process image with sharp
    const processedImage = await sharp(imageBuffer)
      .resize(224, 224, { fit: "contain" })
      .raw()
      .toBuffer();

    // Create tensor from raw pixel data
    const tfImage = tf.tensor3d(new Uint8Array(processedImage), [224, 224, 3]);

    const predictions = await mobileNetModel.classify(tfImage);
    console.log("predictions", predictions);

    // Generate embedding
    const embedding = mobileNetModel.infer(tfImage, true);
    const embeddingData = await embedding.data();
    console.log("embeddingData", embeddingData);

    // Cleanup
    tfImage.dispose();
    embedding.dispose();

    return Array.from(embeddingData);
  } catch (error) {
    console.error("Error generating embedding:", error);
    throw error;
  }
}
                  `}
            />
            <p>
              Now we need to create an API endpoint that will receive images
              from users and store their vector representations in our Qdrant
              database. This endpoint does several important things:
            </p>
            <ul>
              <li>
                Checks if our Qdrant collection exists, creating it if it
                doesn&apos;t
              </li>
              <li>Accepts image uploads through a FormData request</li>
              <li>
                Converts the uploaded image to a format our embedding function
                can process
              </li>
              <li>Generates the embedding using our previous function</li>
              <li>
                Stores the embedding in Qdrant with a unique ID and the filename
              </li>
            </ul>
            <p>
              The collection is configured to use &quot;Cosine&quot; distance,
              which is a mathematical way to measure how similar two vectors are
              - the closer to 1, the more similar they are.
            </p>
            <CodeBlock
              language="typescript"
              code={`// app/api/add-to-collection/route.ts
import { NextRequest, NextResponse } from "next/server";
import { QdrantClient } from "@qdrant/js-client-rest";
import { generateEmbedding } from "@/utils/embedding-node";

// Define custom error type
type ProcessingError = {
  message: string;
  status?: number;
  cause?: unknown;
};

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});

const COLLECTION_NAME = "image_vector_embeddings_20250310";
const VECTOR_SIZE = 1280; // MobileNet embedding size

async function ensureCollection() {
  try {
    // Check if collection exists
    const collections = await qdrant.getCollections();
    const exists = collections.collections.some(
      (collection) => collection.name === COLLECTION_NAME
    );

    if (!exists) {
      // Create collection if it doesn't exist
      await qdrant.createCollection(COLLECTION_NAME, {
        vectors: {
          size: VECTOR_SIZE,
          distance: "Cosine",
        },
      });
    }
  } catch (error) {
    console.error("Error ensuring collection exists:", error);
    throw error;
  }
}

export async function POST(request: NextRequest) {
  try {
    // Ensure collection exists before proceeding
    await ensureCollection();

    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    // Generate embedding
    const embedding = await generateEmbedding(base64Image);

    // Upload to Qdrant
    await qdrant.upsert(COLLECTION_NAME, {
      points: [
        {
          id: Date.now(),
          vector: embedding,
          payload: {
            filename: file.name,
          },
        },
      ],
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error processing image:", error);

    const processingError: ProcessingError = {
      message:
        error instanceof Error ? error.message : "Error processing image",
      cause: error,
    };

    return NextResponse.json(
      { error: processingError.message },
      { status: 500 }
    );
  }
}
`}
            />
            <p>
              Finally, we need an endpoint that can take a new image and find
              similar ones in our database. This endpoint:
            </p>
            <ul>
              <li>Accepts an uploaded image from the user</li>
              <li>
                Converts it to an embedding using the same process as before
              </li>
              <li>
                Searches our Qdrant collection for the most similar vectors
              </li>
              <li>
                Returns the similarity score (between 0 and 1) and filename of
                the best match
              </li>
            </ul>
            <p>
              A similarity score closer to 1 means the images are very similar,
              while a score closer to 0 means they&apos;re very different.
            </p>
            <CodeBlock
              language="typescript"
              code={`// app/api/compare-image/route.ts
import { NextRequest, NextResponse } from "next/server";
import { QdrantClient } from "@qdrant/js-client-rest";
import { generateEmbedding } from "@/utils/embedding-node";

// Define custom error type
type ProcessingError = {
  message: string;
  status?: number;
  cause?: unknown;
};

const qdrant = new QdrantClient({
  url: process.env.QDRANT_URL,
  apiKey: process.env.QDRANT_API_KEY,
});
const COLLECTION_NAME = "image_vector_embeddings_20250310";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("image") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString("base64");

    // Generate embedding for uploaded image
    const embedding = await generateEmbedding(base64Image);

    // Get similarity score from Qdrant
    const searchResult = await qdrant.search(COLLECTION_NAME, {
      vector: embedding,
      limit: 1,
      with_payload: true,
    });

    const similarity = searchResult[0]?.score || 0;

    return NextResponse.json({
      similarity,
      filename: searchResult[0]?.payload?.filename,
    });
  } catch (error: unknown) {
    console.error("Error processing image:", error);

    const processingError: ProcessingError = {
      message:
        error instanceof Error ? error.message : "Error processing image",
      cause: error,
    };

    return NextResponse.json(
      { error: processingError.message },
      { status: 500 }
    );
  }
}
`}
            />
            <p>
              With our backend APIs ready, we can create the user interface.
              This React component includes:
            </p>
            <ul>
              <li>
                A section for uploading multiple &quot;ground truth&quot; images
                to our collection
              </li>
              <li>
                Status indicators to show the progress of processing each image
              </li>
              <li>A section for uploading a single target image to compare</li>
              <li>A display area for showing the similarity results</li>
            </ul>
            <p>
              The interface uses React&apos;s useState hook to manage the
              various states of our application, and provides real-time feedback
              as images are processed and compared.
            </p>
            <CodeBlock
              language="typescript"
              code={`
// app/page.tsx
"use client";

import { useState } from "react";
import Image from "next/image";

type UploadStatus = {
  filename: string;
  status: "pending" | "processing" | "complete" | "error";
  error?: string;
};

export default function Home() {
  const [collectionImages, setCollectionImages] = useState<File[]>([]);
  const [uploadStatuses, setUploadStatuses] = useState<UploadStatus[]>([]);
  const [targetImage, setTargetImage] = useState<File | null>(null);
  const [targetPreview, setTargetPreview] = useState<string | null>(null);
  const [similarityScore, setSimilarityScore] = useState<number | null>(null);
  const [isComparing, setIsComparing] = useState(false);

  const handleCollectionUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []);
    setCollectionImages(files);
    setUploadStatuses(
      files.map((file) => ({
        filename: file.name,
        status: "pending",
      }))
    );
  };

  const processCollection = async () => {
    for (let i = 0; i < collectionImages.length; i++) {
      const file = collectionImages[i];
      setUploadStatuses((prev) =>
        prev.map((status, idx) =>
          idx === i ? { ...status, status: "processing" } : status
        )
      );

      try {
        const formData = new FormData();
        formData.append("image", file);

        const response = await fetch("/api/add-to-collection", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) throw new Error("Failed to process image");

        setUploadStatuses((prev) =>
          prev.map((status, idx) =>
            idx === i ? { ...status, status: "complete" } : status
          )
        );
      } catch (error: unknown) {
        setUploadStatuses((prev) =>
          prev.map((status, idx) =>
            idx === i
              ? {
                  ...status,
                  status: "error",
                  error:
                    error instanceof Error ? error.message : "Unknown error",
                }
              : status
          )
        );
      }
    }
  };

  const handleTargetImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setTargetImage(file);
      setTargetPreview(URL.createObjectURL(file));
      setSimilarityScore(null);
    }
  };

  const handleCompare = async () => {
    if (!targetImage) return;

    setIsComparing(true);
    try {
      const formData = new FormData();
      formData.append("image", targetImage);

      const response = await fetch("/api/compare-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      setSimilarityScore(data.similarity);
    } catch (error) {
      console.error("Error comparing images:", error);
    } finally {
      setIsComparing(false);
    }
  };

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto space-y-12">
        {/* Collection Building Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Add Image(s) toCollection</h2>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleCollectionUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-violet-50 file:text-violet-700
              hover:file:bg-violet-100"
          />

          {uploadStatuses.length > 0 && (
            <div className="space-y-4">
              <button
                onClick={processCollection}
                className="px-4 py-2 bg-violet-500 text-white rounded-md"
              >
                Process Images
              </button>

              <div className="space-y-2">
                {uploadStatuses.map((status, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span>{status.filename}</span>
                    <span
                      className={\`text-sm \${
                        status.status === "complete"
                          ? "text-green-500"
                          : status.status === "error"
                          ? "text-red-500"
                          : status.status === "processing"
                          ? "text-blue-500"
                          : "text-gray-500"
                      }\`}
                    >
                      {status.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Image Comparison Section */}
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">Compare Image</h2>
          <input
            type="file"
            accept="image/*"
            onChange={handleTargetImageUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />

          {targetPreview && (
            <div className="space-y-4">
              <Image
                src={targetPreview}
                alt="Preview"
                width={300}
                height={300}
                className="object-contain"
              />

              <button
                onClick={handleCompare}
                disabled={isComparing}
                className="px-4 py-2 bg-blue-500 text-white rounded-md
                  disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {isComparing ? "Comparing..." : "Get Similarity Score"}
              </button>
            </div>
          )}

          {similarityScore !== null && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-lg text-black font-semibold">
                Similarity Score: {(similarityScore * 100).toFixed(2)}%
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}`}
            />
            <p>
              With these pieces in place, we can run <code>npm run dev</code>{" "}
              and interact with our application.
            </p>
            <p>
              The complete code for this project can be found on my{" "}
              <Link href="https://github.com/jdamiba/qdrant-nextjs-template">
                GitHub
              </Link>
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
