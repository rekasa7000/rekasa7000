// components/Projects.tsx
"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

interface Project {
  title: string;
  period: string;
  description: string;
  technologies: string[];
  points: string[];
  link?: string;
}

const projects: Project[] = [
  {
    title: "Kloudtrack",
    period: "June 2024 - Present",
    description:
      "A web dashboard system providing real-time hyperlocal weather data from a monitoring station",
    technologies: [
      "TypeScript",
      "React",
      "Node.js",
      "Express",
      "Prisma ORM",
      "Docker",
    ],
    points: [
      "Developed and deployed the server to facilitate real-time data transmission",
      "Built a responsive dashboard for monitoring weather conditions",
      "Implemented secure authentication and data transmission protocols",
    ],
  },
  {
    title: "CultureConnect",
    period: "September 2023 - June 2024",
    description:
      "A social platform designed to promote cultural events and heritage",
    technologies: ["TypeScript", "React", "PostgreSQL", "Express", "Node.js"],
    points: [
      "Led team development and documentation",
      "Implemented content-based filtering algorithm for personalized recommendations",
      "Designed responsive interface for mobile and desktop users",
    ],
  },
  {
    title: "Knowt",
    period: "March 2023 - May 2023",
    description:
      "Web application for automated article summarization using ML and sentiment analysis",
    technologies: ["HTML", "CSS", "Python", "Flask", "Firebase"],
    points: [
      "Led project development and technical documentation",
      "Integrated machine learning models for text summarization",
      "Implemented responsive design and user authentication",
    ],
  },
  {
    title: "Databox",
    period: "December 2022 - May 2023",
    description:
      "Desktop application for time management featuring scheduler and progress tracker",
    technologies: ["C#", ".NET", "MySQL"],
    points: [
      "Led the team in development and documentation",
      "Designed database schema and implemented CRUD operations",
      "Created intuitive user interface for schedule management",
    ],
  },
];

export default function Projects() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section id="projects" ref={sectionRef} className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white matcha-theme:text-matcha-text mb-4">
            Notable Projects
          </h2>
          <div className="w-24 h-1 bg-blue-500 dark:bg-blue-400 matcha-theme:bg-matcha-primary mx-auto"></div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white dark:bg-gray-800 matcha-theme:bg-matcha-secondary rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white matcha-theme:text-matcha-text">
                    {project.title}
                  </h3>
                  <span className="text-sm text-gray-500 dark:text-gray-400 matcha-theme:text-matcha-text/70">
                    {project.period}
                  </span>
                </div>

                <p className="text-gray-600 dark:text-gray-300 matcha-theme:text-matcha-text/80 mb-4">
                  {project.description}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, i) => (
                    <span
                      key={i}
                      className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 matcha-theme:bg-matcha-background matcha-theme:text-matcha-primary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                <ul className="mb-4 space-y-1">
                  {project.points.map((point, i) => (
                    <li
                      key={i}
                      className="flex items-start text-gray-600 dark:text-gray-300 matcha-theme:text-matcha-text/80 text-sm"
                    >
                      <span className="inline-block w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 matcha-theme:bg-matcha-primary rounded-full mt-1.5 mr-2 flex-shrink-0"></span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>

                {project.link && (
                  <a
                    href={project.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 matcha-theme:text-matcha-primary matcha-theme:hover:text-matcha-accent transition-colors text-sm font-medium"
                  >
                    View Project{" "}
                    <ArrowTopRightOnSquareIcon className="h-4 w-4 ml-1" />
                  </a>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
