export type Skill = {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  price: string;
  unit: string;
  chain: string;
  category: string;
  rating: number;
  callsToday: number;
  image: string;
};

export const mockSkills: Skill[] = [
  {
    id: "pdf-research-pro",
    name: "PDF Research Pro",
    shortDescription: "Extracts tables and key findings from long research PDFs.",
    longDescription:
      "Optimized for financial and technical research. Handles batches of PDFs, extracts tables, builds a structured summary, and returns both machine-readable data and a human overview.",
    price: "$0.30",
    unit: "per 50-page document",
    chain: "Monad",
    category: "Analysis",
    rating: 4.8,
    callsToday: 186,
    image:
      "/forge2.png",
  },
  {
    id: "multilang-translate",
    name: "Multilang Translate",
    shortDescription: "Translate product specs into 20+ languages on demand.",
    longDescription:
      "Designed for technical and legal content. Preserves formatting, headings, and key terminology while translating across popular languages.",
    price: "$0.02",
    unit: "per 1k characters",
    chain: "Monad",
    category: "Language",
    rating: 4.6,
    callsToday: 342,
    image:
      "/forge.png",
  },
  {
    id: "clause-guard",
    name: "Clause Guard",
    shortDescription: "Flags risky clauses in contracts and vendor agreements.",
    longDescription:
      "Looks for indemnification, liability caps, termination, and IP ownership clauses. Returns a structured report with risk levels and suggestions.",
    price: "$0.50",
    unit: "per contract",
    chain: "Monad",
    category: "Legal",
    rating: 4.7,
    callsToday: 74,
    image:
      "/forge1.png",
  },
];

export const mockCreatorStats = {
  totalRevenueAUSD: 312,
  totalCalls: 1284,
  activeSkills: 3,
};

