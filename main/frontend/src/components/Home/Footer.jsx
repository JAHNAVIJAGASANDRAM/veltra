import React from "react";

function TestimonialCard({ quote, name, role, initials }) {
  return (
    <div className="modern-card p-8 bg-white rounded-lg shadow-lg">
      <p className="text-xl text-gray-700 mb-6 italic">"{quote}"</p>
      <div className="flex items-center">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold mr-4">
          {initials}
        </div>
        <div className="text-left">
          <p className="font-semibold">{name}</p>
          <p className="text-gray-600">{role}</p>
        </div>
      </div>
    </div>
  );
}

function Testimonials() {
  const testimonials = [
    {
      quote: "Veltra helped us streamline content publishing for our podcast team.",
      name: "John Doe",
      role: "Content Manager, TechPod",
      initials: "JD",
    },
    {
      quote: "The workflow automation saved us hours every week!",
      name: "Sarah Lee",
      role: "Podcast Producer, LearnCast",
      initials: "SL",
    },
    {
      quote: "Finally, one platform where our team can collaborate seamlessly.",
      name: "Alex Kim",
      role: "Founder, AudioHub",
      initials: "AK",
    },
  ];

  return (
    <section id="testimonials" className="py-20 px-6 bg-gray-100">
      <div className="max-w-4xl mx-auto text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold">Testimonials</h2>
        <p className="text-gray-600 mt-4">
          Hear what our users have to say about Veltra.
        </p>
      </div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {testimonials.map((t, idx) => (
          <TestimonialCard
            key={idx}
            quote={t.quote}
            name={t.name}
            role={t.role}
            initials={t.initials}
          />
        ))}
      </div>
    </section>
  );
}

export default Testimonials;
