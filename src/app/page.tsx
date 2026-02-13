import type { Metadata } from "next";
import { HomeContent } from "./home-content";

export const metadata: Metadata = {
  title: "Regee Casaña",
  description: "Software Engineer",
};

export default function Home() {
  return <HomeContent />;
}
