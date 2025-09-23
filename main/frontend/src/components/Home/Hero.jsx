import React from "react";

function Hero({ onGetStarted, onWizard, onGuide }) {
  return (
    <section id="hero" className="py-20 px-6 bg-gray-50 relative z-0">
      <div className="max-w-7xl mx-auto text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Your Virtual Office for Seamless Content Creation & Team Collaboration
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8">
          From idea to publishing — manage tasks, track progress, and create together in one place.
        </p>

        {/* Buttons */}
        <div className="flex justify-center gap-6">
          <button
            className="px-8 py-4 bg-blue-500 text-white font-bold rounded hover:bg-blue-600 transition"
            onClick={onGetStarted}
          >
            Get Started
          </button>
          <button
            className="px-8 py-4 bg-gray-200 text-gray-800 font-bold rounded hover:bg-gray-300 transition"
            onClick={onGuide}
          >
            See Demo
          </button>
        </div>

        {/* Placeholder Image */}
        <div className="mt-12">
          <img
            src="https://via.placeholder.com/800x400"
            alt="Veltra Preview"
            className="rounded-lg shadow-lg mx-auto"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
