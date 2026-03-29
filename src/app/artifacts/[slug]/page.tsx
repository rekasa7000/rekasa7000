import { notFound } from "next/navigation";
import Link from "next/link";
import { Piano } from "@/components/artifacts/piano";
import { Matrix } from "@/components/artifacts/matrix";
import { Snake } from "@/components/artifacts/snake";

const artifacts: Record<string, React.ComponentType> = {
  piano: Piano,
  matrix: Matrix,
  snake: Snake,
};

export function generateStaticParams() {
  return Object.keys(artifacts).map((slug) => ({ slug }));
}

export default async function ArtifactPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const Component = artifacts[slug];
  if (!Component) notFound();

  return (
    <div
      className="min-h-screen font-mono"
      style={{ backgroundColor: "var(--bg-primary)", color: "var(--text-primary)" }}
    >
      <div
        className="flex items-center justify-between px-6 py-4 border-b"
        style={{ borderColor: "var(--border-color)" }}
      >
        <Link href="/" className="text-sm neon-accent hover:underline">
          ← cd ..
        </Link>
        <span className="text-xs" style={{ color: "var(--text-secondary)" }}>
          ~/artifacts/{slug}
        </span>
      </div>
      <Component />
    </div>
  );
}
