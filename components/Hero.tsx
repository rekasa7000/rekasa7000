// components/Hero.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-primary-100 via-white to-white opacity-70 dark:from-gray-900 dark:via-gray-900 dark:to-black matcha-theme:from-matcha-secondary matcha-theme:via-matcha-background matcha-theme:to-matcha-background"></div>

      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 mb-12 md:mb-0"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 dark:text-white matcha-theme:text-matcha-text">
              <span className="block">Hi, I'm Regee</span>
              <span className="block mt-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-teal-400 dark:from-blue-400 dark:to-teal-300 matcha-theme:from-matcha-primary matcha-theme:to-matcha-accent">
                Software Engineer
              </span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 matcha-theme:text-matcha-text mb-8 max-w-lg">
              Building scalable web applications and creative solutions with
              modern technologies. Focused on performance, security, and
              exceptional user experiences.
            </p>
            <div className="flex flex-wrap gap-4">
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#projects"
                className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-lg hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600 matcha-theme:bg-matcha-primary matcha-theme:hover:bg-matcha-accent"
              >
                View My Work
              </motion.a>
              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href="#contact"
                className="px-6 py-3 bg-white text-gray-800 font-medium rounded-lg shadow-lg hover:bg-gray-100 transition-colors dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700 matcha-theme:bg-matcha-secondary matcha-theme:text-matcha-text matcha-theme:hover:bg-matcha-background"
              >
                Contact Me
              </motion.a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="md:w-1/2 flex justify-center"
          >
            <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-white shadow-xl dark:border-gray-700 matcha-theme:border-matcha-secondary">
              {/* Replace with your profile image */}
              <div className="w-full h-full bg-gradient-to-r from-blue-300 to-teal-300 dark:from-blue-600 dark:to-teal-600 matcha-theme:from-matcha-primary matcha-theme:to-matcha-accent flex items-center justify-center text-white text-4xl font-bold">
                RC
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        >
          <Link
            href="#experience"
            className="flex flex-col items-center text-gray-500 dark:text-gray-400 matcha-theme:text-matcha-text hover:text-gray-700 dark:hover:text-gray-200 matcha-theme:hover:text-matcha-primary transition-colors"
          >
            <span className="text-sm mb-2">Scroll Down</span>
            <ArrowDownIcon className="h-5 w-5 animate-bounce" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
