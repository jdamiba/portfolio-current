"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="fixed top-0 left-0 w-full bg-background/80 backdrop-blur z-50 border-b border-border/20">
      <div className="max-w-5xl mx-auto flex items-center justify-between px-4 py-3">
        <Link href="/" className="hover:text-primary transition-colors">
          Joseph Damiba
        </Link>
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-6 text-sm font-medium">
          <a href="#projects" className="hover:text-primary transition-colors">
            Projects
          </a>
          <a
            href="#experience"
            className="hover:text-primary transition-colors"
          >
            Experience
          </a>
          <a href="#blog" className="hover:text-primary transition-colors">
            Blog
          </a>
          <a
            href="mailto:jdamiba@gmail.com"
            className="hover:text-primary transition-colors"
          >
            Contact
          </a>
        </nav>
        {/* Hamburger Icon for Mobile */}
        <button
          className="md:hidden p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <nav className="md:hidden bg-background/95 border-t border-border/20 px-4 py-4 flex flex-col gap-4 text-base font-medium animate-fade-in-down">
          <a
            href="#projects"
            className="hover:text-primary transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Projects
          </a>
          <a
            href="#experience"
            className="hover:text-primary transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Experience
          </a>
          <a
            href="#blog"
            className="hover:text-primary transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Blog
          </a>
          <a
            href="#contact"
            className="hover:text-primary transition-colors"
            onClick={() => setMenuOpen(false)}
          >
            Contact
          </a>
        </nav>
      )}
    </header>
  );
}
