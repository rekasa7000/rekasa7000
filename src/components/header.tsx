import Link from "next/link";

interface HeaderProps {
  activePage: "home" | "about-me" | "about-portfolio";
}

export function Header({ activePage }: HeaderProps) {
  return (
    <header
      className="z-50 w-full border-b backdrop-blur-sm relative"
      style={{
        borderColor: "var(--border-color)",
        backgroundColor: "var(--bg-secondary)",
      }}
    >
      <div className="w-full px-4 md:px-6 py-4 md:py-6">
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <Link href="/" className="text-lg md:text-xl font-bold hover:underline">
            Regee Casaña
          </Link>
          <div className="flex gap-4 md:gap-8 text-xs md:text-sm">
            <Link
              href="/"
              className={`hover:underline ${activePage === "home" ? "font-semibold" : ""}`}
            >
              Home
            </Link>
            <Link
              href="/about-me"
              className={`hover:underline ${activePage === "about-me" ? "font-semibold" : ""} ${activePage === "about-portfolio" ? "hidden sm:block" : ""}`}
            >
              About Me
            </Link>
            <Link
              href="/about-portfolio"
              className={`hover:underline ${activePage === "about-portfolio" ? "font-semibold" : ""} ${activePage === "about-me" ? "hidden sm:block" : ""}`}
            >
              About Portfolio
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
