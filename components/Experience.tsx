// components/Experience.tsx
"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

interface ExperienceItem {
  title: string;
  company: string;
  period: string;
  location: string;
  responsibilities: string[];
}

const experiences: ExperienceItem[] = [
  {
    title: "Software Engineer",
    company: "Kloudtech Corporation",
    period: "June 2024 - Present",
    location: "Balanga City, Bataan",
    responsibilities: [
      "Led a team of three developers in building and deploying Kloudtrack, a web application and server, by managing task distribution and overseeing project milestones.",
      "Designed and developed key technical tools, including REST APIs using Node.js, Express, and TypeScript, as well as CI/CD pipelines, to meet business requirements.",
      "Deployed and maintained the application and database on a Virtual Private Server (Ubuntu, Docker), ensuring high availability and scalability.",
      "Designed and prototyped UI/UX improvements using Figma to enhance user engagement and developed the web application with React, TypeScript, Tailwind CSS, and TanStack Query.",
      "Strengthened cybersecurity by implementing CORS policies, token authentication, and secure database queries using Prisma ORM. Optimized performance to enhance both security and user experience.",
    ],
  },
  {
    title: "Web Developer Intern",
    company: "Kloudtech Corporation",
    period: "October 2023 - June 2024",
    location: "Balanga City, Bataan",
    responsibilities: [
      "Designed, developed, and maintained the company website, focusing on usability and performance.",
      "Optimized the codebase by implementing middlewares and enhancing database query efficiency.",
      "Applied normalization and indexing for better organization and to improve database structure and integrity.",
      "Implemented authentication mechanisms, improving security and user management.",
      "Optimized logic and algorithms to enhance application speed and scalability, and implemented version control for better code management and collaboration.",
    ],
  },
];

export default function Experience() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 });

  return (
    <section
      id="experience"
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
            Professional Experience
          </h2>
          <div className="w-24 h-1 bg-blue-500 dark:bg-blue-400 matcha-theme:bg-matcha-primary mx-auto"></div>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {experiences.map((exp, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="mb-12 relative pl-8 before:content-[''] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-blue-400 dark:before:bg-blue-500 matcha-theme:before:bg-matcha-primary before:rounded-full"
            >
              <div className="absolute left-0 top-0 w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 matcha-theme:bg-matcha-primary transform -translate-x-1/2"></div>

              <div className="bg-white dark:bg-gray-800 matcha-theme:bg-matcha-secondary rounded-lg shadow-md p-6 ml-2">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white matcha-theme:text-matcha-text">
                      {exp.title}
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400 matcha-theme:text-matcha-primary font-medium">
                      {exp.company}
                    </p>
                  </div>
                  <div className="mt-2 md:mt-0 text-sm text-gray-600 dark:text-gray-400 matcha-theme:text-matcha-text/80">
                    <p>{exp.period}</p>
                    <p>{exp.location}</p>
                  </div>
                </div>

                <ul className="space-y-2">
                  {exp.responsibilities.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="inline-block w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 matcha-theme:bg-matcha-primary rounded-full mt-2 mr-2"></span>
                      <span className="text-gray-600 dark:text-gray-300 matcha-theme:text-matcha-text/90">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
