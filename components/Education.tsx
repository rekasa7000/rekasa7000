// components/Education.tsx
"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { AcademicCapIcon, TicketIcon } from "@heroicons/react/24/outline";

const education = {
  university: "BATAAN PENINSULA STATE UNIVERSITY",
  degree: "BS in Computer Science, Major in Software Development",
  graduation: "September 2024",
  location: "Balanga City, Bataan",
  achievements: ["Graduated Cum Laude", "GWA: 1.37"],
  coursework: [
    "Software Engineering",
    "Data Structures & Algorithms",
    "Database Management Systems",
    "Object-Oriented Programming",
    "Software Development",
    "Application Development",
    "Web Programming",
  ],
};

const certifications = [
  {
    provider: "Pearson",
    certs: [
      "Information Technology Specialist in Network Security (2024)",
      "Information Technology Specialist in Cybersecurity (2023)",
    ],
  },
  {
    provider: "Cisco",
    certs: [
      "Cyber Threat Management (2024)",
      "Certified Support Technician Cybersecurity (2023)",
    ],
  },
  {
    provider: "Microsoft",
    certs: [
      "Associate Microsoft Office Specialist, Powerpoint, Word, & Excel (2024)",
    ],
  },
  {
    provider: "Cognizant",
    certs: ["Outreach V Work Career Readiness Program (2023)"],
  },
];

export default function Education() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section ref={sectionRef} className="py-20">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Education */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center mb-6">
                <AcademicCapIcon className="w-10 h-10 text-blue-500 dark:text-blue-400 matcha-theme:text-matcha-primary mr-4" />
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white matcha-theme:text-matcha-text">
                  Education
                </h2>
              </div>

              <div className="bg-white dark:bg-gray-800 matcha-theme:bg-matcha-secondary rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white matcha-theme:text-matcha-text mb-2">
                  {education.university}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 matcha-theme:text-matcha-primary font-medium mb-2">
                  {education.degree}
                </p>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 matcha-theme:text-matcha-text/70 mb-4">
                  <span>{education.graduation}</span>
                  <span>{education.location}</span>
                </div>

                <div className="mb-4">
                  <h4 className="text-md font-semibold text-gray-700 dark:text-gray-200 matcha-theme:text-matcha-text mb-2">
                    Achievements
                  </h4>
                  <ul className="list-disc list-inside text-gray-600 dark:text-gray-300 matcha-theme:text-matcha-text/80">
                    {education.achievements.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-md font-semibold text-gray-700 dark:text-gray-200 matcha-theme:text-matcha-text mb-2">
                    Relevant Coursework
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {education.coursework.map((course, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 matcha-theme:bg-matcha-background matcha-theme:text-matcha-primary"
                      >
                        {course}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Certifications */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center mb-6">
                <TicketIcon className="w-10 h-10 text-blue-500 dark:text-blue-400 matcha-theme:text-matcha-primary mr-4" />
                <h2 className="text-3xl font-bold text-gray-800 dark:text-white matcha-theme:text-matcha-text">
                  Certifications
                </h2>
              </div>

              <div className="bg-white dark:bg-gray-800 matcha-theme:bg-matcha-secondary rounded-lg shadow-md p-6">
                {certifications.map((cert, index) => (
                  <div key={index} className={index !== 0 ? "mt-6" : ""}>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white matcha-theme:text-matcha-text mb-3">
                      {cert.provider}
                    </h3>
                    <ul className="space-y-2">
                      {cert.certs.map((item, i) => (
                        <li key={i} className="flex items-start">
                          <span className="inline-block w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 matcha-theme:bg-matcha-primary rounded-full mt-1.5 mr-2"></span>
                          <span className="text-gray-600 dark:text-gray-300 matcha-theme:text-matcha-text/90">
                            {item}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
