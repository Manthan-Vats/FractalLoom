// src/components/LandingPage.tsx
import React from "react";
import { Link } from "react-router-dom";
import HeroPreview from "./HeroPreview";

export const LandingPage: React.FC = () => {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0f1422] to-[#071023] text-white antialiased">
      {/* Header */}
      <header className="py-6 border-b border-white/6">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          <div className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-[#cbb7ff] to-[#ffb86b]">
            FractalLoom
          </div>
          <nav className="flex items-center gap-3">
            <Link
              to="/explore"
              className="text-sm text-white/80 hover:text-white focus:outline-none"
              aria-label="Explore examples"
            >
              Examples
            </Link>
            <Link
              to="/generator"
              className="px-3 py-2 rounded-full bg-gradient-to-r from-[#ff6a3d] to-[#f4db7d] text-[#081022] font-semibold text-sm shadow"
              aria-label="Open Generator"
            >
              Create
            </Link>
          </nav>
        </div>
      </header>

      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-sm uppercase tracking-wide text-[#9daaf2] mb-4">
              Explore · Create · Understand
            </p>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6 text-[#f4db7d] max-w-2xl">
              Fractals — patterns from simple rules
            </h1>

            <p className="text-base sm:text-lg text-white/80 max-w-xl mb-8">
              Tiny mathematical rules repeated produce striking complexity.
              Watch how detail emerges, then create your own.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                to="/generator"
                className="inline-flex items-center gap-3 px-5 py-3 rounded-lg bg-gradient-to-r from-[#ff6a3d] to-[#f4db7d] text-[#081022] font-semibold shadow-sm"
                aria-label="Open generator"
              >
                Open Generator
              </Link>

              <Link
                to="/explore"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-lg border border-white/10 text-white/90 bg-transparent text-sm hover:bg-white/3 focus:outline-none"
                aria-label="Explore examples"
              >
                Explore examples
              </Link>
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div style={{ width: 520 }} className="w-full">
              <HeroPreview className="w-full h-[320px]" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-8 border-t border-white/6">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="text-sm text-white/80 max-w-xl">
            <strong className="text-white">Where you see fractals:</strong>{" "}
            nature (ferns, Romanesco), technology (antennas), and art.
          </div>

          <div className="flex gap-4">
            <a
              href="https://en.wikipedia.org/wiki/Fractal"
              target="_blank"
              rel="noreferrer"
              className="text-sm text-white/70 underline"
            >
              Learn more
            </a>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-sm text-white/70">
        <div className="max-w-6xl mx-auto px-6">
          © 2025 FractalLoom — designed & built by{" "}
          <span className="font-semibold text-white">Manthan Vats</span>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
