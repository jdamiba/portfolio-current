## SpecStory

## Improving Prose and Code Contrast (3/11/2025, 1:40:47 PM)

_**User**_

I want there to be a greater contrast between prose and code on my blog page

---

_**Assistant**_

I'll help you modify the styling to increase contrast between prose and code blocks. I'll update the article's prose class styling to make the text darker and adjust the code block background for better contrast.

```typescript:app/blog/implementing-vector-search-qdrant-nextjs/page.tsx
// ... existing code ...
        <article
          className="prose dark:prose-invert lg:prose-lg max-w-none 
          prose-h1:!text-4xl prose-h1:!sm:text-5xl 
          prose-h2:!text-3xl prose-h2:!sm:text-4xl 
          prose-h3:!text-2xl prose-h3:!sm:text-3xl 
          prose-h2:!mt-12 prose-h3:!mt-8 
          prose-p:!text-gray-800 dark:prose-p:!text-gray-200 
          prose-li:!text-gray-800 dark:prose-li:!text-gray-200 
          prose-pre:!bg-gray-50 dark:prose-pre:!bg-gray-900 
          prose-pre:!border prose-pre:!border-gray-200 
          dark:prose-pre:!border-gray-700 prose-pre:!rounded-lg
          prose-code:!text-gray-800 dark:prose-code:!text-gray-200
          prose-pre:!shadow-sm"
        >
// ... existing code ...
```

I made these changes:

1. Changed prose text color from gray-600 to gray-800 for better readability in light mode
2. Changed dark mode prose text from gray-300 to gray-200 for better contrast
3. Made code block background lighter (gray-50) in light mode and darker (gray-900) in dark mode
4. Added a subtle shadow to code blocks with `prose-pre:!shadow-sm`
5. Added explicit text color styling for inline code with `prose-code`

These changes will create more contrast between regular text and code blocks while maintaining readability in both light and dark modes.

---

_**User**_

implement syntax highlighting

---

_**Assistant**_

I'll help you implement syntax highlighting for the code blocks. We'll use Prism.js for syntax highlighting. Here's how to implement it:

1. First, let's install the required dependencies:

```bash
npm install prismjs @types/prismjs
```

2. Create a new component for syntax-highlighted code:

```typescript:app/components/CodeBlock.tsx
'use client';

import { useEffect } from 'react';
import Prism from 'prismjs';
import 'prismjs/themes/prism-tomorrow.css';
// Import additional languages
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';

interface CodeBlockProps {
  code: string;
  language: string;
}

export default function CodeBlock({ code, language }: CodeBlockProps) {
  useEffect(() => {
    Prism.highlightAll();
  }, [code]);

  return (
    <pre className="!p-0">
      <code className={`language-${language}`}>{code}</code>
    </pre>
  );
}
```

3. Update the blog post to use the new component:

```typescript:app/blog/implementing-vector-search-qdrant-nextjs/page.tsx
'use client';

import Link from "next/link";
import CodeBlock from "@/app/components/CodeBlock";

export default function BlogPost() {
  // ... existing imports and start of component ...

  return (
    // ... existing JSX until the first code block ...
    
    {/* Replace the existing pre/code blocks with the new CodeBlock component */}
    <CodeBlock 
      language="bash"
      code={`npx create-next-app@latest image-similarity-search
cd image-similarity-search
npm install @tensorflow/tfjs @tensorflow-models/mobilenet qdrant-js`}
    />

    {/* For the embedding-node.ts code block */}
    <CodeBlock 
      language="typescript"
      code={`// utils/embedding-node.ts
import * as tf from "@tensorflow/tfjs";
// ... rest of the code ...`}
    />

    {/* Continue replacing other code blocks similarly */}
    
    // ... rest of the component ...
  );
}
```

4. Add some custom styles to enhance the code blocks. Create a new CSS file:

```css:app/styles/prism-custom.css
pre[class*="language-"] {
  background: #1a1a1a !important;
  border-radius: 0.5rem !important;
  margin: 2rem 0 !important;
  padding: 1.5rem !important;
  overflow-x: auto !important;
}

code[class*="language-"] {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace !important;
  font-size: 0.875rem !important;
  line-height: 1.7 !important;
}

.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
  color: #6b7280 !important;
}

.token.function {
  color: #93c5fd !important;
}

.token.keyword {
  color: #f472b6 !important;
}

.token.string {
  color: #86efac !important;
}

.token.number {
  color: #fca5a5 !important;
}
```

5. Import the custom styles in your layout file:

```typescript:app/layout.tsx
import '@/app/styles/prism-custom.css';
// ... rest of your imports ...
```

This implementation will give you:

1. Syntax highlighting for TypeScript, JavaScript, Bash, and JSON
2. A modern, dark theme for code blocks
3. Custom styling for different code elements
4. Proper font sizing and spacing
5. Mobile-responsive code blocks with horizontal scrolling when needed

The code will be highlighted automatically when the component mounts and whenever the code prop changes. The styling is customizable through the CSS file if you want to adjust colors or other properties.

Remember to wrap code blocks in your markdown/content with the appropriate language identifier for proper highlighting:

```typescript:app/blog/implementing-vector-search-qdrant-nextjs/page.tsx
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
```

Note that I've updated the article's className to remove some of the pre/code styling since we're now handling that in our custom CSS file.

---

_**User**_

let's enhance the text prior to each codeblock with more explanation of how the code works. assume readers are novices in both nextjs and vector search

---

_**Assistant**_



---



---

