import React from "react";

const Navigation = () => {
  return (
    <nav
      className="nav hidden lg:flex justify-end"
      aria-label="In-page jump links"
    >
      <ul className="mt-16 w-max ">
        <li>
          <a className="group flex items-center py-3 active" href="#about">
            <span className="nav-text text-xs font-bold uppercase tracking-widest text-slate-600 group-hover:text-slate-400 group-focus-visible:text-slate-200">
              About
            </span>
            <span className="nav-indicator ml-4 h-px w-8 bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-400 group-focus-visible:w-16 group-focus-visible:bg-slate-600 motion-reduce:transition-none"></span>
          </a>
        </li>
        <li>
          <a className="group flex items-center py-3 active" href="#experience">
            <span className="nav-text text-xs font-bold uppercase tracking-widest text-slate-600 group-hover:text-slate-400 group-focus-visible:text-slate-200">
              Experience
            </span>
            <span className="nav-indicator ml-4 h-px w-8 bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-400 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none"></span>
          </a>
        </li>
        <li>
          <a className="group flex items-center py-3 active" href="#projects">
            <span className="nav-text text-xs font-bold uppercase tracking-widest text-slate-600 group-hover:text-slate-400 group-focus-visible:text-slate-200">
              Projects
            </span>
            <span className="nav-indicator ml-4 h-px w-8 bg-slate-600 transition-all group-hover:w-16 group-hover:bg-slate-400 group-focus-visible:w-16 group-focus-visible:bg-slate-200 motion-reduce:transition-none"></span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
