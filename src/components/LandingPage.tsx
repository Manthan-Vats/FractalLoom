import React from 'react';
import { Link } from 'react-router-dom';
import { Eye, Palette, ArrowRight, Sparkles, Infinity, Zap } from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a2238] via-[#1a2238] to-[#1a2238]">
      {/* Header */}
      <header className="relative z-10 bg-[#1a2238]/90 backdrop-blur-md border-b border-[#9daaf2]/20">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#9daaf2] to-[#f4db7d] bg-clip-text text-transparent">
              FractalLoom
            </h1>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-6">
        <div className="container mx-auto text-center">
          <div className="mb-8">
            <Infinity className="w-16 h-16 text-[#ff6a3d] mx-auto mb-6 animate-pulse" />
            <h2 className="text-5xl md:text-6xl font-bold text-[#f4db7d] mb-6">
              Explore the Beauty of
              <span className="block bg-gradient-to-r from-[#9daaf2] to-[#ff6a3d] bg-clip-text text-transparent">
                Mathematical Fractals
              </span>
            </h2>
            <p className="text-xl text-[#e0e6ff] max-w-3xl mx-auto leading-relaxed">
              "Mathematics is not about numbers, equations, computations, or algorithms: 
              it is about understanding." - William Paul Thurston
            </p>
          </div>

          <div className="mb-16">
            <p className="text-lg text-[#d1d9ff] max-w-2xl mx-auto mb-8">
              Discover the infinite complexity hidden within simple mathematical rules. 
              FractalLoom reveals the stunning patterns that emerge from the intersection 
              of mathematics and art, where chaos meets order in perfect harmony.
            </p>
          </div>

          {/* Main Navigation Cards */}
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Explore Fractals Card */}
            <Link 
              to="/explore" 
              className="group relative p-8 bg-[#1a2238]/60 backdrop-blur-md rounded-2xl border border-[#9daaf2]/30 hover:border-[#ff6a3d]/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#9daaf2]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#9daaf2]/10 to-[#ff6a3d]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <Eye className="w-12 h-12 text-[#9daaf2] mb-4 mx-auto group-hover:text-[#f4db7d] transition-colors duration-300" />
                <h3 className="text-2xl font-bold text-[#f4db7d] mb-4">Explore Famous Fractals</h3>
                <p className="text-[#e0e6ff] mb-6">
                  Journey through the most iconic fractals in mathematics. From the mysterious 
                  Mandelbrot set to the elegant Julia sets, discover the patterns that have 
                  captivated mathematicians for generations.
                </p>
                <div className="flex items-center justify-center text-[#ff6a3d] group-hover:text-[#f4db7d] transition-colors duration-300">
                  <span className="mr-2">Start Exploring</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Link>

            {/* Create Patterns Card */}
            <Link 
              to="/generator" 
              className="group relative p-8 bg-[#1a2238]/60 backdrop-blur-md rounded-2xl border border-[#9daaf2]/30 hover:border-[#ff6a3d]/50 transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-[#9daaf2]"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#ff6a3d]/10 to-[#f4db7d]/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <Palette className="w-12 h-12 text-[#ff6a3d] mb-4 mx-auto group-hover:text-[#f4db7d] transition-colors duration-300" />
                <h3 className="text-2xl font-bold text-[#f4db7d] mb-4">Create Beautiful Patterns</h3>
                <p className="text-[#e0e6ff] mb-6">
                  Unleash your creativity with our interactive fractal generator. Adjust parameters 
                  in real-time and watch as mathematical equations transform into stunning visual 
                  masterpieces.
                </p>
                <div className="flex items-center justify-center text-[#ff6a3d] group-hover:text-[#f4db7d] transition-colors duration-300">
                  <span className="mr-2">Start Creating</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          </div>

          {/* Features Section */}
          <div className="mt-20">
            <h3 className="text-3xl font-bold text-[#f4db7d] mb-12">Why FractalLoom?</h3>
            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center p-6">
                <Zap className="w-10 h-10 text-[#ff6a3d] mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-[#f4db7d] mb-3">Real-Time Rendering</h4>
                <p className="text-[#d1d9ff]">
                  Experience instant visual feedback as you adjust parameters. Our optimized 
                  rendering engine ensures smooth, lag-free interactions.
                </p>
              </div>
              <div className="text-center p-6">
                <Sparkles className="w-10 h-10 text-[#9daaf2] mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-[#f4db7d] mb-3">Mathematical Beauty</h4>
                <p className="text-[#d1d9ff]">
                  Witness the profound beauty that emerges from simple mathematical rules. 
                  Each fractal tells a story of infinite complexity.
                </p>
              </div>
              <div className="text-center p-6">
                <Infinity className="w-10 h-10 text-[#f4db7d] mx-auto mb-4" />
                <h4 className="text-xl font-semibold text-[#f4db7d] mb-3">Infinite Exploration</h4>
                <p className="text-[#d1d9ff]">
                  Dive deep into fractal landscapes with unlimited zoom capabilities. 
                  Discover new patterns at every scale.
                </p>
              </div>
            </div>
          </div>

          {/* Quote Section */}
          <div className="mt-20 p-8 bg-[#1a2238]/40 backdrop-blur-md rounded-2xl border border-[#9daaf2]/20 max-w-4xl mx-auto">
            <blockquote className="text-2xl text-[#9daaf2] italic mb-4">
              "Clouds are not spheres, mountains are not cones, coastlines are not circles, 
              and bark is not smooth, nor does lightning travel in a straight line."
            </blockquote>
            <cite className="text-[#f4db7d] font-semibold">— Benoit Mandelbrot</cite>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 bg-[#1a2238]/90 backdrop-blur-md border-t border-[#9daaf2]/20 py-8">
        <div className="container mx-auto px-6 text-center">
          <div className="mb-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-[#9daaf2] to-[#f4db7d] bg-clip-text text-transparent mb-2">
              FractalLoom
            </h3>
            <p className="text-[#d1d9ff]">
              Designed and built by Manthan
            </p>
          </div>
          <div className="text-[#c4d0ff] text-sm">
            © 2025 FractalLoom. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};