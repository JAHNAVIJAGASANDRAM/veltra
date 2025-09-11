export default function Hero({ onGetStarted }) {
  return (
    <section
      id="top"
      className="relative bg-gradient-to-b from-blue-50 to-white pt-32 pb-20"
    >
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
        
        {/* Left Content */}
        <div className="text-center lg:text-left space-y-6">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 leading-tight">
            Build Smarter, Faster with{" "}
            <span className="text-blue-600">Veltra</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-xl mx-auto lg:mx-0">
            Veltra helps you manage, publish, and grow your content with ease.
            Designed for speed, simplicity, and scalability.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start pt-4">
            <button
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 hover:scale-105 transition shadow-lg"
              onClick={onGetStarted}
            >
              Get Started Free
            </button>
            <button className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-100 transition shadow-sm">
              Learn More
            </button>
          </div>
        </div>

        {/* Right Side Image */}
        <div className="relative">
          <img
            src="/hero-illustration.svg"
            alt="Veltra Dashboard"
            className="w-full max-w-lg mx-auto drop-shadow-2xl rounded-2xl"
          />
          <div className="absolute -z-10 top-10 left-10 w-72 h-72 bg-blue-200 blur-3xl rounded-full opacity-40"></div>
          <div className="absolute -z-10 bottom-10 right-10 w-72 h-72 bg-purple-200 blur-3xl rounded-full opacity-40"></div>
        </div>
      </div>
    </section>
  );
}
