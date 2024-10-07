import React, { useState, useEffect } from "react";

const Navigation = () => {
  const [activeSection, setActiveSection] = useState("#about");

  const handleSetActive = (sectionId: string) => {
    setActiveSection(sectionId);
  };

  return (
    <nav
      className="nav hidden lg:flex justify-end"
      aria-label="In-page jump links"
    >
      <ul className="mt-16 w-max">
        <li>
          <a
            className={`group flex items-center py-3 ${
              activeSection === "#about" ? "active" : ""
            }`}
            href="#about"
            onClick={() => handleSetActive("#about")}
          >
            <span className="text-xs w-full font-bold uppercase tracking-widest text-slate-600 group-hover:text-slate-400 group-focus-visible:text-slate-200">
              About
            </span>
          </a>
        </li>
        <li>
          <a
            className={`group flex items-center py-3 ${
              activeSection === "#experience" ? "active" : ""
            }`}
            href="#experience"
            onClick={() => handleSetActive("#experience")}
          >
            <span className="text-xs w-full font-bold uppercase tracking-widest text-slate-600 group-hover:text-slate-400 group-focus-visible:text-slate-200">
              Experience
            </span>
          </a>
        </li>
        <li>
          <a
            className={`group flex items-center py-3 ${
              activeSection === "#projects" ? "active" : ""
            }`}
            href="#projects"
            onClick={() => handleSetActive("#projects")}
          >
            <span className="text-xs w-full font-bold uppercase tracking-widest text-slate-600 group-hover:text-slate-400 group-focus-visible:text-slate-200">
              Projects
            </span>
          </a>
        </li>
        <li>
          <a
            className={`group flex items-center py-3 ${
              activeSection === "#projects" ? "active" : ""
            }`}
            href="#education"
            onClick={() => handleSetActive("#education")}
          >
            <span className="text-xs w-full font-bold uppercase tracking-widest text-slate-600 group-hover:text-slate-400 group-focus-visible:text-slate-200">
              Education
            </span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
