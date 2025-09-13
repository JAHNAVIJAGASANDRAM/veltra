import React from "react";

function Hero({ onGetStarted, onWizard, onGuide }) {
  return (
    <section id="hero" className="hero-section py-20 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto text-center">
        {/* Main Heading */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Your Virtual Office for Seamless Content Creation & Team Collaboration
        </h1>

        {/* Subheading */}
        <p className="text-xl md:text-2xl text-gray-600 mb-8">
          From idea to publishing — manage tasks, track progress, and create together in one place.
        </p>

        {/* Call-to-Action Buttons */}
        <div className="flex justify-center gap-6">
          <button
            className="btn-primary px-8 py-4 text-lg"
            onClick={onGetStarted}
          >
            Get Started
          </button>
          <button
            className="btn-secondary px-8 py-4 text-lg"
            onClick={onGuide}
          >
            See Demo
          </button>
        </div>

        {/* Optional: Animated Illustration or Screenshot */}
        <div className="mt-12">
          <img
            src="https://via.placeholder.com/800x400?text=Veltra+Dashboard+Preview"
            alt="Veltra Preview"
            className="rounded-lg shadow-lg mx-auto"
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
