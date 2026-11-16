"use client";

import { useSyncExternalStore } from "react";

const subscribeToYear = () => () => {};
const getClientYear = () => new Date().getFullYear();
const getServerYear = () => 2026;

const footerLinks = {
  Platform: [
    { label: "Data Explorer",       href: "#how-it-works" },
    { label: "Advanced Search",     href: "#how-it-works" },
    { label: "Dataset Library",     href: "#how-it-works" },
    { label: "Analytics Dashboard", href: "#how-it-works" },
    { label: "Saved Views",         href: "#features" },
    { label: "Data Export",         href: "#features" },
  ],
  Features: [
    { label: "Full-Text Search",     href: "#features" },
    { label: "Dynamic Filtering",    href: "#features" },
    { label: "Smart Pagination",     href: "#features" },
    { label: "Record Relationships", href: "#features" },
    { label: "Data Analytics",       href: "#features" },
    { label: "Role-Based Access",    href: "#solutions" },
  ],
  Documentation: [
    { label: "Getting Started",    href: "#" },
    { label: "API Reference",      href: "#" },
    { label: "Data Schema",        href: "#" },
    { label: "Authentication",     href: "#" },
    { label: "Query DSL",          href: "#" },
    { label: "Deployment Guide",   href: "#" },
  ],
  Company: [
    { label: "About DataScope",  href: "#about" },
    { label: "How It Works",     href: "#about" },
    { label: "Security",         href: "#solutions" },
    { label: "GitHub Repository", href: "https://github.com", external: true },
    { label: "Contact Us",       href: "mailto:hello@datascope.app", external: true },
    { label: "Report an Issue",  href: "#" },
  ],
};

const techStack = [
  { name: "Next.js 16",    color: "bg-slate-700 text-slate-200" },
  { name: "React 19",      color: "bg-indigo-900/60 text-indigo-300" },
  { name: "TypeScript",    color: "bg-indigo-900/60 text-indigo-300" },
  { name: "Tailwind CSS",  color: "bg-sky-900/60 text-sky-300" },
  { name: "Redux Toolkit", color: "bg-purple-900/60 text-purple-300" },
  { name: "PostgreSQL",    color: "bg-indigo-900/60 text-indigo-300" },
  { name: "Redis",         color: "bg-red-900/60 text-red-300" },
  { name: "Drizzle ORM",   color: "bg-emerald-900/60 text-emerald-300" },
  { name: "Express.js",    color: "bg-slate-700 text-slate-200" },
  { name: "Zod",           color: "bg-orange-900/60 text-orange-300" },
];

export default function Footer() {
  const currentYear = useSyncExternalStore(subscribeToYear, getClientYear, getServerYear);

  return (
    <footer className="bg-[#0B1120] border-t border-[#1E293B]">
      {/* Main footer grid */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 pt-16 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-10 mb-12">

          {/* Brand column — wider */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Logo */}
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center shadow-lg shadow-indigo-900/40">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="text-white">
                  <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" fill="currentColor" opacity="0.3" />
                  <path d="M5 5h3v3H5zM16 5h3v3h-3zM5 16h3v3H5zM16 16h3v3h-3z" fill="currentColor" />
                </svg>
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Data<span className="text-indigo-400">Scope</span>
              </span>
            </div>

            {/* Description */}
            <p className="text-slate-400 text-sm leading-relaxed max-w-xs">
              An Enterprise Data Discovery &amp; Intelligence Platform built to
              explore, search, filter, analyze, and manage large volumes of
              structured business data at scale.
            </p>

            {/* Tech stack badges */}
            <div>
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2.5">
                Built with
              </p>
              <div className="flex flex-wrap gap-1.5">
                {techStack.map((t) => (
                  <span key={t.name} className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${t.color}`}>
                    {t.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-3">
              {/* GitHub */}
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 border border-[#1E293B]/60 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 hover:-translate-y-0.5"
                aria-label="GitHub"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z" />
                </svg>
              </a>
              {/* Email */}
              <a
                href="mailto:hello@datascope.app"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 border border-[#1E293B]/60 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 hover:-translate-y-0.5"
                aria-label="Email"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <polyline points="22,6 12,13 2,6" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 border border-[#1E293B]/60 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200 hover:-translate-y-0.5"
                aria-label="LinkedIn"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="lg:col-span-1">
              <h4 className="text-sm font-bold text-slate-200 mb-4">{category}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target={"external" in link && link.external ? "_blank" : undefined}
                      rel={"external" in link && link.external ? "noopener noreferrer" : undefined}
                      className="text-sm text-slate-400 hover:text-slate-100 transition-colors duration-150 flex items-center gap-1 group"
                    >
                      {link.label}
                      {"external" in link && link.external && (
                        <svg className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                          <polyline points="15 3 21 3 21 9" />
                          <line x1="10" y1="14" x2="21" y2="3" />
                        </svg>
                      )}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact info bar */}
        <div className="border-t border-[#1E293B] pt-8 pb-6">
          <div className="grid sm:grid-cols-3 gap-4 mb-8">
            {[
              {
                icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>,
                label: "Email", value: "hello@datascope.app", href: "mailto:hello@datascope.app",
              },
              {
                icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2z"/></svg>,
                label: "GitHub", value: "github.com/datascope", href: "https://github.com",
              },
              {
                icon: <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>,
                label: "Location", value: "Remote-first · Worldwide", href: "#",
              },
            ].map((contact) => (
              <a key={contact.label} href={contact.href} className="flex items-center gap-3 group">
                <div className="w-9 h-9 rounded-xl bg-slate-800 border border-[#1E293B]/60 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:border-indigo-700/40 transition-all duration-200 shrink-0">
                  {contact.icon}
                </div>
                <div>
                  <div className="text-xs text-slate-500">{contact.label}</div>
                  <div className="text-sm text-slate-300 group-hover:text-white transition-colors">{contact.value}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1E293B] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-indigo-600 to-indigo-800 flex items-center justify-center">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="white" opacity="0.9">
                <path d="M5 5h3v3H5zM16 5h3v3h-3zM5 16h3v3H5zM16 16h3v3h-3z" />
              </svg>
            </div>
            <span>
              © {currentYear}{" "}
              <span className="text-slate-300 font-medium">DataScope</span>. All rights reserved.
            </span>
          </div>

          {/* Right: legal + status */}
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <a href="#" className="hover:text-slate-300 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-slate-300 transition-colors">Cookie Policy</a>
            </div>
            {/* Live status */}
            <div className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-800/50 rounded-full px-3 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-semibold text-emerald-400">All Systems Operational</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

