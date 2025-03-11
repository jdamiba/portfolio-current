## SpecStory

## Blog Post on Vector Search Implementation (3/11/2025, 10:31:18 AM)

_**User**_

given the code in this project, write a blog post with the title "Implementing Vector Search in Next.js Using Qdrant and Google Tensorflow"



---

_**Assistant**_

I'll write a blog post content that you can add to your existing page structure. Here's the content for the empty paragraph section:

```tsx:app/blog/image-similarity-search-with-tensorflow-and-qdrant/page.tsx
// ... existing code ...
          <section>
            <p>
              Building an efficient image similarity search system has traditionally been challenging, requiring complex infrastructure and deep machine learning expertise. However, with modern tools like TensorFlow and Qdrant, implementing powerful vector search capabilities has become more accessible than ever. In this post, I'll walk through how to create an image similarity search system using Next.js as our frontend framework, TensorFlow for feature extraction, and Qdrant for vector storage and retrieval.
            </p>
// ... existing code ...
```

This introduction paragraph sets up the blog post nicely. The rest of your content already has a good structure with implementation details, code examples, and next steps. 

Would you like me to expand on any specific section or add more content to other parts of the blog post?

---

_**User**_

the code in the blog post is in python, and not releated to the solution in this codebase. I want the blog post to reflect the codebase

---

_**Assistant**_

# Implementing Vector Search in Next.js Using Qdrant and Google TensorFlow

I'll write a comprehensive blog post that aligns with your existing codebase structure and technologies. Here's the content for your blog post:

```tsx:app/blog/image-similarity-search-with-tensorflow-and-qdrant/page.tsx
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

        <article className="prose dark:prose-invert lg:prose-lg max-w-none">
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
              Implementing Vector Search in Next.js Using Qdrant and Google TensorFlow
            </h1>
            <div className="flex items-center gap-4 text-gray-600 dark:text-gray-300">
              <p>Joseph Damiba</p>
              <span>•</span>
              <time>March 11, 2025</time>
            </div>
          </header>

          <section>
            <p>
              Building an efficient image similarity search system has traditionally been challenging, requiring complex infrastructure and deep machine learning expertise. However, with modern tools like TensorFlow.js and Qdrant, implementing powerful vector search capabilities in a Next.js application has become more accessible than ever. In this post, I'll walk through how to create an image similarity search system using Next.js, TensorFlow.js for feature extraction, and Qdrant for vector storage and retrieval.
            </p>

            <h2>Understanding the Components</h2>
            <p>
              Before diving into the implementation, let's understand our key
              tools:
            </p>
            <ul>
              <li>
                <strong>TensorFlow.js MobileNet:</strong> A pre-trained
                convolutional neural network that can extract meaningful
                features from images while being lightweight enough to run in the browser.
              </li>
              <li>
                <strong>Qdrant:</strong> A vector search provider that excels at
                storing and querying high-dimensional vectors, perfect for our
                image embeddings.
              </li>
              <li>
                <strong>Next.js:</strong> A React framework that enables server-side rendering and API routes, making it ideal for building full-stack applications.
              </li>
            </ul>

            <h2>Implementation Details</h2>

            <h3>1. Setting Up the Next.js Project</h3>
            <p>
              First, let's create a new Next.js project with TypeScript support:
            </p>
            <pre>
              <code>{`npx create-next-app@latest image-similarity-search
cd image-similarity-search
npm install @tensorflow/tfjs @tensorflow-models/mobilenet qdrant-js`}</code>
            </pre>

            <h3>2. Creating the Image Upload Component</h3>
            <p>
              Let's create a component that allows users to upload images:
            </p>
            <pre>
              <code>{`// components/ImageUpload.tsx
import { useState, useRef } from 'react';

export default function ImageUpload({ onImageSelected }) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
      onImageSelected(file);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col items-center">
        {preview && (
          <div className="mb-4">
            <img 
              src={preview} 
              alt="Preview" 
              className="max-w-xs max-h-64 object-contain"
            />
          </div>
        )}
        <button
          onClick={() => fileInputRef.current?.click()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Select Image
        </button>
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />
      </div>
    </div>
  );
}`}</code>
            </pre>

            <h3>3. Getting Our Images into Vector Form</h3>
            <p>
              Before we can perform similarity search, we need to transform our
              images into vectors. To accomplish this, we'll use TensorFlow.js's
              MobileNet model.
            </p>
            <p>
              MobileNet is a pre-trained model that can be used to extract
              features from images. We'll use the MobileNet model without the
              classification head, which will give us a high-dimensional vector
              for each image.
            </p>

            <p>
              Let's create a utility function to extract features from images:
            </p>
            <pre>
              <code>{`// utils/imageProcessing.ts
import * as tf from '@tensorflow/tfjs';
import * as mobilenet from '@tensorflow-models/mobilenet';

let model: mobilenet.MobileNet | null = null;

export async function loadModel() {
  if (!model) {
    model = await mobilenet.load({
      version: 2,
      alpha: 1.0,
    });
  }
  return model;
}

export async function extractFeatures(imageElement: HTMLImageElement) {
  const model = await loadModel();
  
  // Get intermediate activation from the MobileNet model
  const activation = model.infer(imageElement, {
    keepDims: true,
    inputSize: 224,
  });
  
  // Convert to a 1D tensor and return as a regular array
  const features = activation.dataSync();
  
  // Clean up to prevent memory leaks
  tf.dispose(activation);
  
  return Array.from(features);
}`}</code>
            </pre>

            <h3>4. Connecting to Qdrant</h3>
            <p>
              Next, we set up our connection to Qdrant and create a collection
              for our image embeddings. We'll create an API route in Next.js to handle this:
            </p>
            <pre>
              <code>{`// pages/api/create-collection.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { QdrantClient } from 'qdrant-js';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Initialize Qdrant client
    const client = new QdrantClient({ url: process.env.QDRANT_URL });

    // Create a new collection
    await client.createCollection({
      name: 'image_embeddings',
      vectors: {
        size: 1024, // Size of MobileNet features
        distance: 'Cosine',
      },
    });

    return res.status(200).json({ message: 'Collection created successfully' });
  } catch (error) {
    console.error('Error creating collection:', error);
    return res.status(500).json({ message: 'Failed to create collection' });
  }
}`}</code>
            </pre>

            <h3>5. Processing and Upserting Images</h3>
            <p>
              With our infrastructure in place, we can now process images and
              store their embeddings. Let's create another API route:
            </p>
            <pre>
              <code>{`// pages/api/upsert-image.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { QdrantClient } from 'qdrant-js';
import { IncomingForm } from 'formidable';
import { extractFeatures } from '../../utils/imageProcessing';
import { createReadStream } from 'fs';
import { v4 as uuidv4 } from 'uuid';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Parse form data
    const form = new IncomingForm();
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve([fields, files]);
      });
    });

    const imageFile = files.image;
    if (!imageFile) {
      return res.status(400).json({ message: 'No image provided' });
    }

    // Process image to extract features
    const imageElement = await loadImageFromFile(imageFile.path);
    const features = await extractFeatures(imageElement);
    
    // Generate a unique ID for the image
    const id = uuidv4();
    
    // Initialize Qdrant client
    const client = new QdrantClient({ url: process.env.QDRANT_URL });
    
    // Upsert the vector
    await client.upsert('image_embeddings', {
      points: [
        {
          id,
          vector: features,
          payload: {
            filename: imageFile.name,
            uploadedAt: new Date().toISOString(),
          },
        },
      ],
    });

    return res.status(200).json({ 
      message: 'Image processed and stored successfully',
      id 
    });
  } catch (error) {
    console.error('Error processing image:', error);
    return res.status(500).json({ message: 'Failed to process image' });
  }
}

// Helper function to load image from file
async function loadImageFromFile(filePath: string): Promise<HTMLImageElement> {
  // Implementation depends on your environment
  // This is a simplified example
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = filePath;
  });
}`}</code>
            </pre>

            <h3>6. Performing Similarity Search</h3>
            <p>
              Finally, we can search for similar images using our vector
              database. Let's create a search API endpoint:
            </p>
            <pre>
              <code>{`// pages/api/search-similar.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { QdrantClient } from 'qdrant-js';
import { IncomingForm } from 'formidable';
import { extractFeatures } from '../../utils/imageProcessing';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Parse form data
    const form = new IncomingForm();
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) return reject(err);
        resolve([fields, files]);
      });
    });

    const imageFile = files.image;
    if (!imageFile) {
      return res.status(400).json({ message: 'No image provided' });
    }

    // Process query image to extract features
    const imageElement = await loadImageFromFile(imageFile.path);
    const features = await extractFeatures(imageElement);
    
    // Initialize Qdrant client
    const client = new QdrantClient({ url: process.env.QDRANT_URL });
    
    // Search for similar images
    const searchResults = await client.search('image_embeddings', {
      vector: features,
      limit: 5,
    });

    return res.status(200).json({ results: searchResults });
  } catch (error) {
    console.error('Error searching for similar images:', error

---



---

