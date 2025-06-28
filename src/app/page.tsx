"use client";

import { Button } from "@/components/ui/button";
import {
  Github,
  Moon,
  Sun,
  Mail,
  ExternalLink,
  Code,
  ArrowUpRight,
  Menu,
  X,
  MapPin,
  Calendar,
  Coffee,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function Home() {
  const { setTheme, theme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const projects = [
    {
      title: "E-Commerce Platform",
      description: "Modern e-commerce solution with real-time inventory, secure payments, and analytics dashboard.",
      tech: ["Next.js", "TypeScript", "Stripe", "Prisma"],
      github: "#",
      live: "#",
      year: "2024",
    },
    {
      title: "Task Management System",
      description: "Collaborative workspace with real-time updates, team management, and project analytics.",
      tech: ["React", "Node.js", "Socket.io", "MongoDB"],
      github: "#",
      live: "#",
      year: "2024",
    },
    {
      title: "AI Code Assistant",
      description: "VS Code extension providing intelligent code suggestions and automated documentation.",
      tech: ["TypeScript", "Python", "OpenAI API", "VS Code API"],
      github: "#",
      live: "#",
      year: "2023",
    },
  ];

  const skills = [
    "JavaScript",
    "TypeScript",
    "React",
    "Next.js",
    "Node.js",
    "Python",
    "PostgreSQL",
    "MongoDB",
    "AWS",
    "Docker",
    "Git",
    "Tailwind CSS",
  ];

  const experience = [
    {
      role: "Full-Stack Developer",
      company: "Tech Startup",
      period: "2023 - Present",
      description: "Building scalable web applications with modern technologies",
    },
    {
      role: "Software Engineer Intern",
      company: "Innovation Lab",
      period: "2022 - 2023",
      description: "Developed microservices and improved system performance",
    },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) return null;

  return (
    <div className={`min-h-screen w-full flex flex-col relative ${theme === "matcha" ? "matcha-theme" : ""}`}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="absolute right-10 top-3 z-50">
            <Sun
              className={`h-[1.2rem] w-[1.2rem] transition-all ${
                theme === "light" ? "scale-100 rotate-0" : "scale-0 -rotate-90"
              }`}
            />
            <Moon
              className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
                theme === "dark" ? "scale-100 rotate-0" : "scale-0 rotate-90"
              }`}
            />
            <Coffee
              className={`absolute h-[1.2rem] w-[1.2rem] transition-all ${
                theme === "matcha" ? "scale-100 rotate-0" : "scale-0 rotate-90"
              }`}
            />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setTheme("light")}>☀️ Light</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("dark")}>🌙 Dark</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setTheme("matcha")}>🍃 Matcha</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div
        className="fixed w-4 h-4 bg-secondary rounded-full pointer-events-none z-40 mix-blend-difference transition-transform duration-150 ease-out"
        style={{
          left: mousePosition.x - 8,
          top: mousePosition.y - 8,
          transform: "scale(1)",
        }}
      />

      <nav className="fixed top-0 w-full backdrop-blur-md z-30 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <div className="font-medium text-lg">Regee Casana</div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {["Work", "About", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="transition-colors font-medium"
                >
                  {item}
                </button>
              ))}
              <a
                href="https://github.com/rekasa7000"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <Github size={20} />
              </a>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-100">
            <div className="px-6 py-4 space-y-4">
              {["Work", "About", "Contact"].map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item.toLowerCase())}
                  className="block transition-colors font-medium"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="min-h-screen flex items-center justify-center px-6 pt-16">
        <div className="max-w-4xl text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-tight">Full-Stack Developer</h1>
            <p className="text-xl md:text-2xl max-w-2xl mx-auto leading-relaxed">
              Computer Science graduate building clean, efficient software solutions. Passionate about modern web
              technologies and thoughtful design.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <button
              onClick={() => scrollToSection("work")}
              className="group px-8 py-3 bg-gray-900 rounded-full hover:bg-gray-800 transition-all duration-300 flex items-center gap-2"
            >
              View Work
              <ArrowUpRight
                size={18}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              />
            </button>
            <a
              href="mailto:regee@example.com"
              className="px-8 py-3 border border-gray-300 rounded-full hover:border-gray-400 transition-colors flex items-center gap-2"
            >
              <Mail size={18} />
              Get in touch
            </a>
          </div>

          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              Available worldwide
            </div>
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              Open to opportunities
            </div>
          </div>
        </div>
      </section>

      {/* Work Section */}
      <section id="work" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-20">
            <h2 className="text-4xl md:text-5xl font-light mb-6">Selected Work</h2>
            <p className="text-xl max-w-2xl">
              A collection of projects showcasing my experience with modern web technologies and software engineering
              principles.
            </p>
          </div>

          <div className="space-y-24">
            {projects.map((project, index) => (
              <div key={index} className="group">
                <div className="grid md:grid-cols-2 gap-12 items-start">
                  <div className={`space-y-6 ${index % 2 === 1 ? "md:order-2" : ""}`}>
                    <div className="flex items-center gap-4">
                      <span className="text-sm font-medium">{project.year}</span>
                      <div className="h-px bg-gray-300 flex-1"></div>
                    </div>

                    <h3 className="text-2xl md:text-3xl font-light">{project.title}</h3>
                    <p className="text-lg leading-relaxed">{project.description}</p>

                    <div className="flex flex-wrap gap-2">
                      {project.tech.map((tech, techIndex) => (
                        <span key={techIndex} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                          {tech}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-6 pt-4">
                      <a href={project.github} className="group flex items-center gap-2 transition-colors">
                        <Github size={18} />
                        <span className="group-hover:underline">Code</span>
                      </a>
                      <a href={project.live} className="group flex items-center gap-2 transition-colors">
                        <ExternalLink size={18} />
                        <span className="group-hover:underline">Live Demo</span>
                      </a>
                    </div>
                  </div>

                  <div className={`${index % 2 === 1 ? "md:order-1" : ""}`}>
                    <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl group-hover:shadow-xl transition-shadow duration-500 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-purple-50 opacity-50"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Code size={48} className="text-gray-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-light mb-8">About</h2>
              <div className="space-y-6 text-lg leading-relaxed">
                <p>
                  I'm a passionate Full-Stack Developer and Software Engineer with a Computer Science degree earned with
                  distinction. I specialize in building modern web applications with clean, maintainable code and
                  thoughtful user experiences.
                </p>
                <p>
                  My approach combines technical expertise with creative problem-solving, always focusing on writing
                  code that not only works but is also elegant and scalable. When I'm not coding, you'll find me
                  exploring new technologies or enjoying a perfectly brewed cup of matcha.
                </p>
                <p>
                  I believe in continuous learning and staying updated with the latest industry trends and best
                  practices. My goal is to create software that makes a meaningful impact.
                </p>
              </div>
            </div>

            <div className="space-y-12">
              <div>
                <h3 className="text-xl font-medium mb-6">Experience</h3>
                <div className="space-y-6">
                  {experience.map((exp, index) => (
                    <div key={index} className="border-l-2 border-gray-200 pl-6">
                      <div className="flex items-center gap-4 mb-2">
                        <h4 className="font-medium">{exp.role}</h4>
                        <span className="text-sm">{exp.period}</span>
                      </div>
                      <p className="mb-2">{exp.company}</p>
                      <p className="text-sm">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-6">Skills</h3>
                <div className="grid grid-cols-2 gap-3">
                  {skills.map((skill, index) => (
                    <div key={index} className="">
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="contact" className="py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-light mb-8">Let's work together</h2>
          <p className="text-xl mb-12 max-w-2xl mx-auto">
            I'm always interested in hearing about new opportunities and exciting projects. Let's create something
            amazing together.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <a
              href="mailto:regee@example.com"
              className="group px-8 py-4 bg-gray-900 rounded-full hover:bg-gray-800 transition-all duration-300 flex items-center gap-3"
            >
              <Mail size={20} />
              <span>regeecasana57@gmail.com</span>
              <ArrowUpRight
                size={18}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              />
            </a>

            <a
              href="https://github.com/rekasa7000"
              target="_blank"
              rel="noopener noreferrer"
              className="group px-8 py-4 border border-gray-300 rounded-full hover:border-gray-400 transition-all duration-300 flex items-center gap-3"
            >
              <Github size={20} />
              <span>GitHub</span>
              <ArrowUpRight
                size={18}
                className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform"
              />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto text-center">
          <p>© 2025 Regee Casana. Designed & developed with care.</p>
        </div>
      </footer>
    </div>
  );
}
