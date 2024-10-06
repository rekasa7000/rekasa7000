import Parallax from "@/components/Parallax";

export default function Home() {
  return (
    <div>
      <Parallax backgroundImage="/hero.svg">
        <h1 className="text-5xl text-white font-bold">
          Welcome to My Portfolio
        </h1>
      </Parallax>
      <section className="py-20  text-center">
        <h2 className="text-4xl mb-4 font-semibold">About Me</h2>
        <p className="max-w-2xl mx-auto text-lg">
          I am currently the lead full-stack developer of{" "}
          <a href="https://kloudtechsea.com" target="_blank">
            Kloudtech
          </a>
        </p>
        <p className="max-w-2xl mx-auto text-lg">
          I'm a passionate web developer with a focus on creating responsive,
          high-quality websites using modern technologies like TypeScript,
          React, and Next.js.
        </p>
      </section>

      <Parallax backgroundImage="/projects.svg">
        <h2 className="text-4xl text-white font-semibold">My Projects</h2>
      </Parallax>
      <section className="py-20 bg-gray-100 text-center">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 px-10">
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-2xl font-semibold">CultureConnect</h3>
            <p className="mt-4">Description of the project.</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-2xl font-semibold">Databox</h3>
            <p className="mt-4">Description of the project.</p>
          </div>
          <div className="bg-white shadow-lg rounded-lg p-6">
            <h3 className="text-2xl font-semibold">Knowt</h3>
            <p className="mt-4">Description of the project.</p>
          </div>
        </div>
      </section>

      <Parallax backgroundImage="/contact.svg">
        <h2 className="text-4xl text-white font-semibold">Contact Me</h2>
      </Parallax>
      <section className="py-20 bg-gray-100 text-center">
        <h2 className="text-3xl font-semibold">Get In Touch</h2>
        <form className="max-w-lg mx-auto mt-6">
          <input
            type="text"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
            placeholder="Your Name"
          />
          <input
            type="email"
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
            placeholder="Your Email"
          />
          <textarea
            className="w-full p-3 mb-4 border border-gray-300 rounded-lg"
            placeholder="Your Message"
          />
          <button className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold">
            Send Message
          </button>
        </form>
      </section>
    </div>
  );
}
