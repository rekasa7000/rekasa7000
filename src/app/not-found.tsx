import Link from "next/link";
import { Carlos } from "@/components/carlos";

/** 404: Carlos knocked the pot over. */
export default function NotFound() {
  return (
    <main
      className="min-h-screen grid place-items-center px-6 relative z-10"
      style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <div className="text-center max-w-md">
        <Carlos pose="oops" size={210} className="mx-auto mb-8" />
        <p className="session-tag mb-6">Page not found</p>
        <h1 className="font-display text-4xl md:text-5xl mt-6 mb-5">Carlos knocked it over.</h1>
        <p className="text-base mb-9" style={{ color: "var(--text-secondary)" }}>
          This page was never planted, or it was on a shelf Carlos could reach. He says it wasn&apos;t him.
        </p>
        <Link href="/" className="btn-ink">
          Back to the garden
        </Link>
      </div>
    </main>
  );
}
