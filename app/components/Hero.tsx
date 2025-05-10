import Link from "next/link";
import { Github, Linkedin, Mail } from "lucide-react";
import React from "react";

export function Hero({ intro }: { intro: string }) {
  return (
    <section className="relative flex flex-col pt-[50px] md:flex-row items-center md:items-stretch justify-center min-h-[60vh] md:min-h-[70vh] w-full gap-0 md:gap-8 px-2 md:px-0">
      {/* Right: Text Content */}
      <div className="flex w-full md:w-1/2 flex-col justify-center items-center md:items-start text-center md:text-left py-4 md:py-0">
        <h1 className="mb-2 text-4xl sm:text-5xl font-bold tracking-tight">
          Joseph Damiba
        </h1>
        <h2 className="mb-4 text-lg sm:text-xl text-muted-foreground font-medium">
          Senior Full-Stack Engineer
        </h2>
        <p className="mb-6 max-w-xl text-base sm:text-lg text-muted-foreground">
          {intro}
        </p>
        <div className="mb-6 flex flex-wrap gap-2 justify-center md:justify-start">
          <span className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-foreground shadow-sm">
            React
          </span>
          <span className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-foreground shadow-sm">
            TypeScript
          </span>
          <span className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-foreground shadow-sm">
            UI/UX
          </span>
          <span className="inline-flex items-center rounded-full border border-border bg-background px-2.5 py-0.5 text-xs font-medium text-foreground shadow-sm">
            Node.js
          </span>
        </div>
        <div className="flex flex-wrap gap-4 justify-center md:justify-start">
          <Link
            href="https://github.com/jdamiba"
            className="flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-primary-foreground transition-colors hover:bg-primary/90 shadow-sm"
            target="_blank"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </Link>
          <Link
            href="https://linkedin.com/in/joseph-damiba"
            className="flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-foreground transition-colors hover:bg-muted shadow-sm"
            target="_blank"
          >
            <Linkedin className="h-4 w-4" />
            <span>LinkedIn</span>
          </Link>
          <Link
            href="mailto:jdamiba@gmail.com"
            className="flex items-center gap-2 rounded-md border border-border bg-background px-4 py-2 text-foreground transition-colors hover:bg-muted shadow-sm"
            target="_blank"
          >
            <Mail className="h-4 w-4" />
            <span>Email</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
