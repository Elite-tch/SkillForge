import React from "react";
import Link from "next/link";
import { Search, Filter, Star, Zap, Shield, ChevronRight } from "lucide-react";

// Mock Data for Marketplace
const skills = [
  {
    id: "pdf-research-pro",
    name: "PDF Research Pro",
    slug: "pdf-research-pro",
    description: "Extracts tables, summaries, and key insights from PDF documents. Handles scanned files via OCR.",
    price: "$0.05",
    unit: "per page",
    rating: 4.9,
    reviews: 128,
    tags: ["Analysis", "OCR", "Finance"],
    verified: true,
    image: "/forge1.png"
  },
  {
    id: "tech-translate-specialist",
    name: "TechTranslate Specialist",
    slug: "tech-translate-specialist",
    description: "High-precision translation for technical documentation. Preserves code blocks and markdown.",
    price: "$0.02",
    unit: "per 1k tokens",
    rating: 4.7,
    reviews: 84,
    tags: ["Translation", "DevTools"],
    verified: true,
    image: "/forge2.png"
  },
  {
    id: "web-scraper-v2",
    name: "Universal Web Scraper",
    slug: "web-scraper-v2",
    description: "Ethical scraping agent that handles JS-heavy sites, CAPTCHAs, and returns structured JSON.",
    price: "$0.10",
    unit: "per site",
    rating: 4.8,
    reviews: 340,
    tags: ["Data", "Web"],
    verified: false,
    image: "/forge.png"
  },
  {
    id: "smart-contract-auditor",
    name: "Solidity Auditor",
    slug: "smart-contract-auditor",
    description: "Static analysis and vulnerability detection for EVM smart contracts.",
    price: "$1.50",
    unit: "per audit",
    rating: 5.0,
    reviews: 42,
    tags: ["Security", "Blockchain", "Monad"],
    verified: true,
    image: "/forge1.png"
  },
  {
    id: "image-gen-flux",
    name: "Flux Image Gen",
    slug: "image-gen-flux",
    description: "Generate photorealistic images using the Flux model. Optimized for speed on Monad.",
    price: "$0.08",
    unit: "per image",
    rating: 4.6,
    reviews: 110,
    tags: ["Creative", "Image"],
    verified: true,
    image: "/forge2.png"
  },
  {
    id: "twitter-sentiment",
    name: "X/Twitter Sentiment",
    slug: "twitter-sentiment",
    description: "Real-time sentiment analysis of stock/crypto tickers on X.",
    price: "$0.01",
    unit: "per query",
    rating: 4.5,
    reviews: 215,
    tags: ["Social", "Finance"],
    verified: false,
    image: "/forge.png"
  },
];


export default function Marketplace() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-[#8247e5]/30">

      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white font-display">Discover Skills</h1>
            <p className="mt-2 text-sm text-slate-400">
              Browse the decentralized registry of MCP capabilities.
            </p>
          </div>

          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
              <input
                type="text"
                placeholder="Search skills..."
                className="w-full rounded-lg border border-white/10 bg-white/5 pl-9 pr-4 py-2 text-sm text-white placeholder:text-slate-600 focus:border-[#8247e5] focus:outline-none"
              />
            </div>
            <button className="flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-300 hover:bg-white/10 hover:text-white">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <Link
              key={skill.id}
              href={`/skills/${skill.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-xl border border-white/10 bg-neutral-900/40 transition-all hover:bg-neutral-900/60 hover:border-white/20 hover:-translate-y-1"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#8247e5]/5 to-transparent opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none" />

              {/* Card Image */}
              <div className="relative h-64 w-full overflow-hidden bg-neutral-800">
                <img
                  src={skill.image}
                  alt={skill.name}
                  className="h-full w-full object-cover opacity-90 transition-transform duration-500 "
                />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent opacity-60" />
              </div>

              <div className="relative z-10 flex h-fit flex-col p-5 ">
                <div className="mb-3 flex items-start justify-between">

                  {skill.verified && (
                    <div className="rounded-full  bg-[#00ffbd]/10 px-2 py-0.5 text-[10px] font-medium text-[#00ffbd] border border-[#00ffbd]/20 flex items-center gap-1 backdrop-blur-md bg-black/40">
                      <Shield className="h-3 w-3" />
                      Verified
                    </div>
                  )}
                </div>

                <h3 className="text-lg font-bold text-white mb-2">{skill.name}</h3>
                <p className="text-sm text-slate-400 leading-relaxed  mb-4">
                  {skill.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-3">
                  {skill.tags.map(tag => (
                    <span key={tag} className="text-[10px] uppercase font-mono bg-white/5 px-2 py-1 rounded text-slate-500 border border-white/5">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className=" flex items-center justify-between border-t border-white/5 pt-4">
                  <div className="flex items-center gap-1 text-xs text-slate-300">
                    <Star className="h-3.5 w-3.5 fill-yellow-500 text-yellow-500" />
                    <span className="font-bold">{skill.rating}</span>
                    <span className="text-slate-600">({skill.reviews})</span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-bold text-white group-hover:text-[#00ffbd] transition-colors">{skill.price}</div>
                    <div className="text-[10px] text-slate-500">{skill.unit}</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
