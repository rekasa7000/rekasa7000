// components/Skills.tsx
"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const skillCategories = [
  {
    title: "Programming Languages",
    skills: [
      "JavaScript/TypeScript",
      "Java",
      "C#",
      "Python",
      "PHP",
      "HTML",
      "CSS",
      "SQL",
    ],
  },
  {
    title: "Libraries & Frameworks",
    skills: [
      "React",
      "Next.js",
      "Node.js",
      "Express",
      ".NET",
      "Prisma ORM",
      "MySQL",
      "PostgreSQL",
    ],
  },
  {
    title: "Tools & Platforms",
    skills: [
      "Bash",
      "Git",
      "GitHub",
      "Vercel",
      "Docker",
      "Firebase",
      "VPS",
      "Office Suite",
    ],
  },
  {
    title: "Design",
    skills: ["Figma", "Canva", "UI/UX Design", "Responsive Design"],
  },
];

export default function Skills() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section
      id="skills"
      ref={sectionRef}
      className="py-20 bg-gray-50 dark:bg-gray-900 matcha-theme:bg-matcha-background/50"
    >
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white matcha-theme:text-matcha-text mb-4">
            Technical Skills
          </h2>
          <div className="w-24 h-1 bg-blue-500 dark:bg-blue-400 matcha-theme:bg-matcha-primary mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {skillCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 matcha-theme:bg-matcha-secondary rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white matcha-theme:text-matcha-text mb-4">
                  {category.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 matcha-theme:bg-matcha-background matcha-theme:text-matcha-primary"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
