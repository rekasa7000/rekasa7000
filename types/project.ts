export interface Project {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  category: "personal" | "academic" | "company";
  featured?: boolean;
  github?: string;
  demo?: string;
}
