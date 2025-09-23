import React from "react";
import Hero from "../components/Home/Hero";
import KeyFeatures from "../components/Home/KeyFeatures";
import Testimonials from "../components/Home/Testimonials";
import Footer from "../components/Home/Footer";

function HomePage({ onShowRegistration, onShowWizard, onShowGuide }) {
  return (
    <div>
      <Hero 
        onGetStarted={onShowRegistration} 
        onWizard={onShowWizard} 
        onGuide={onShowGuide} 
      />
      <KeyFeatures />
      <Testimonials />
      <Footer />
    </div>
  );
}

export default HomePage;
