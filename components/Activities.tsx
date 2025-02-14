// components/Activities.tsx
"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import { CalendarIcon, MapPinIcon } from "@heroicons/react/24/outline";

const activities = [
  {
    title: "Philippine Trademark Conference 2024 (TM Con Philippines)",
    organization: "Intellectual Property Office of the Philippines",
    date: "July 2024",
    location: "SM Aura, Taguig City",
    description: [
      "Participated in the exhibit of the first-ever trademark convention in the Philippines with the Kloudtech team.",
      "Acquired greater knowledge about trademarks, patents, and intellectual property rights that allows me to decide on what I can and can't do in developing applications.",
    ],
  },
  {
    title: "V Work: Career Readiness Program",
    organization: "Cognizant Philippines",
    date: "March 2023",
    location: "Quezon City, Metro Manila",
    description: [
      "Participate in discussions about emerging Artificial Intelligence.",
      "Collaborate on researching and presenting the impacts of Artificial Intelligence.",
    ],
  },
];

export default function Activities() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });

  return (
    <section
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
            Professional Activities
          </h2>
          <div className="w-24 h-1 bg-blue-500 dark:bg-blue-400 matcha-theme:bg-matcha-primary mx-auto"></div>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="mb-10 last:mb-0"
            >
              <div className="bg-white dark:bg-gray-800 matcha-theme:bg-matcha-secondary rounded-lg shadow-md p-6">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white matcha-theme:text-matcha-text mb-2">
                  {activity.title}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 matcha-theme:text-matcha-primary font-medium mb-3">
                  {activity.organization}
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-600 dark:text-gray-400 matcha-theme:text-matcha-text/70 mb-4">
                  <div className="flex items-center mb-2 sm:mb-0 sm:mr-4">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    <span>{activity.date}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="h-4 w-4 mr-1" />
                    <span>{activity.location}</span>
                  </div>
                </div>

                <ul className="space-y-2">
                  {activity.description.map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="inline-block w-1.5 h-1.5 bg-blue-500 dark:bg-blue-400 matcha-theme:bg-matcha-primary rounded-full mt-1.5 mr-2"></span>
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
