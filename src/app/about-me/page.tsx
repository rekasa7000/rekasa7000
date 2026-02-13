import type { Metadata } from "next";
import { AboutMeContent } from "./about-me-content";

export const metadata: Metadata = {
  title: "About Me - Regee Casaña",
  description:
    "Learn more about my background, philosophy, and journey as a software engineer",
};

export default function AboutMe() {
  return <AboutMeContent />;
}
