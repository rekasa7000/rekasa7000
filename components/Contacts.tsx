// components/Contact.tsx
"use client";

import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import {
  EnvelopeIcon,
  PhoneIcon,
  GlobeAltIcon,
} from "@heroicons/react/24/outline";

export default function Contact() {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.1 });
  const [formStatus, setFormStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus("loading");

    // Simulate form submission
    setTimeout(() => {
      setFormStatus("success");

      // Reset form
      const form = e.target as HTMLFormElement;
      form.reset();

      // Reset status after 3 seconds
      setTimeout(() => {
        setFormStatus("idle");
      }, 3000);
    }, 1500);
  };

  return (
    <section id="contact" ref={sectionRef} className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white matcha-theme:text-matcha-text mb-4">
            Get In Touch
          </h2>
          <div className="w-24 h-1 bg-blue-500 dark:bg-blue-400 matcha-theme:bg-matcha-primary mx-auto"></div>
        </motion.div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-gray-800 matcha-theme:bg-matcha-secondary rounded-lg shadow-md p-8"
            >
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white matcha-theme:text-matcha-text mb-6">
                Contact Information
              </h3>

              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-blue-100 dark:bg-blue-900 matcha-theme:bg-matcha-background p-3 rounded-full mr-4">
                    <EnvelopeIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 matcha-theme:text-matcha-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 matcha-theme:text-matcha-text/70">
                      Email
                    </p>
                    <a
                      href="mailto:regeecasana57@gmail.com"
                      className="text-gray-800 dark:text-white matcha-theme:text-matcha-text hover:text-blue-600 dark:hover:text-blue-400 matcha-theme:hover:text-matcha-primary transition-colors"
                    >
                      regeecasana57@gmail.com
                    </a>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-blue-100 dark:bg-blue-900 matcha-theme:bg-matcha-background p-3 rounded-full mr-4">
                    <PhoneIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 matcha-theme:text-matcha-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 matcha-theme:text-matcha-text/70">
                      Phone
                    </p>
                    <a
                      href="tel:+639935996147"
                      className="text-gray-800 dark:text-white matcha-theme:text-matcha-text hover:text-blue-600 dark:hover:text-blue-400 matcha-theme:hover:text-matcha-primary transition-colors"
                    >
                      +63-993-599-6147
                    </a>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-blue-100 dark:bg-blue-900 matcha-theme:bg-matcha-background p-3 rounded-full mr-4">
                    <GlobeAltIcon className="h-6 w-6 text-blue-600 dark:text-blue-400 matcha-theme:text-matcha-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 matcha-theme:text-matcha-text/70">
                      LinkedIn
                    </p>
                    <a
                      href="https://www.linkedin.com/in/rekasa"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-800 dark:text-white matcha-theme:text-matcha-text hover:text-blue-600 dark:hover:text-blue-400 matcha-theme:hover:text-matcha-primary transition-colors"
                    >
                      linkedin.com/in/rekasa
                    </a>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="bg-blue-100 dark:bg-blue-900 matcha-theme:bg-matcha-background p-3 rounded-full mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6 text-blue-600 dark:text-blue-400 matcha-theme:text-matcha-primary"
                    >
                      <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 matcha-theme:text-matcha-text/70">
                      GitHub
                    </p>
                    <a
                      href="https://github.com/rekasa7000"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-800 dark:text-white matcha-theme:text-matcha-text hover:text-blue-600 dark:hover:text-blue-400 matcha-theme:hover:text-matcha-primary transition-colors"
                    >
                      github.com/rekasa7000
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ duration: 0.6 }}
              className="bg-white dark:bg-gray-800 matcha-theme:bg-matcha-secondary rounded-lg shadow-md p-8"
            >
              <h3 className="text-2xl font-semibold text-gray-800 dark:text-white matcha-theme:text-matcha-text mb-6">
                Send Me a Message
              </h3>

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 matcha-theme:text-matcha-text/90 mb-1"
                  >
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 matcha-theme:border-matcha-primary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 matcha-theme:focus:ring-matcha-primary bg-white dark:bg-gray-700 matcha-theme:bg-matcha-background text-gray-800 dark:text-white matcha-theme:text-matcha-text"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 matcha-theme:text-matcha-text/90 mb-1"
                  >
                    Your Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 matcha-theme:border-matcha-primary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 matcha-theme:focus:ring-matcha-primary bg-white dark:bg-gray-700 matcha-theme:bg-matcha-background text-gray-800 dark:text-white matcha-theme:text-matcha-text"
                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="subject"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 matcha-theme:text-matcha-text/90 mb-1"
                  >
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 matcha-theme:border-matcha-primary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 matcha-theme:focus:ring-matcha-primary bg-white dark:bg-gray-700 matcha-theme:bg-matcha-background text-gray-800 dark:text-white matcha-theme:text-matcha-text"
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="message"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 matcha-theme:text-matcha-text/90 mb-1"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 matcha-theme:border-matcha-primary/30 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 matcha-theme:focus:ring-matcha-primary bg-white dark:bg-gray-700 matcha-theme:bg-matcha-background text-gray-800 dark:text-white matcha-theme:text-matcha-text resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={formStatus === "loading"}
                  className={`w-full py-2 px-4 rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    formStatus === "loading"
                      ? "bg-gray-400 dark:bg-gray-600 matcha-theme:bg-matcha-primary/50 text-white cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 matcha-theme:bg-matcha-primary matcha-theme:hover:bg-matcha-primary/90 text-white"
                  }`}
                >
                  {formStatus === "loading" ? "Sending..." : "Send Message"}
                </button>

                {formStatus === "success" && (
                  <div className="mt-4 p-3 bg-green-100 dark:bg-green-900 matcha-theme:bg-matcha-primary/20 border border-green-200 dark:border-green-800 matcha-theme:border-matcha-primary/30 rounded-md">
                    <p className="text-green-700 dark:text-green-300 matcha-theme:text-matcha-text text-sm">
                      Your message has been sent successfully! I'll get back to
                      you soon.
                    </p>
                  </div>
                )}

                {formStatus === "error" && (
                  <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 matcha-theme:bg-red-500/20 border border-red-200 dark:border-red-800 matcha-theme:border-red-500/30 rounded-md">
                    <p className="text-red-700 dark:text-red-300 matcha-theme:text-red-600 text-sm">
                      There was an error sending your message. Please try again
                      later.
                    </p>
                  </div>
                )}
              </form>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
