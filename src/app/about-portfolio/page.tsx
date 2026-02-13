import type { Metadata } from "next";
import { AboutPortfolioContent } from "./about-portfolio-content";

export const metadata: Metadata = {
  title: "About Portfolio - Regee Casaña",
  description:
    "Learn about the technologies, design decisions, and philosophy behind this portfolio",
};

export default function AboutPortfolio() {
  return <AboutPortfolioContent />;
}
