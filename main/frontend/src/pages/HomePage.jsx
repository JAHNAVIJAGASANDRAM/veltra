import Hero from "../components/Home/Hero";
import KeyFeatures from "../components/Home/KeyFeatures";
import Testimonials from "../components/Home/Testimonials";
import Footer from "../components/Home/Footer";

function HomePage({ onShowRegistration, onShowWizard, onShowGuide }) {
  return (
    <div>
      {/* Hero Section */}
      <Hero 
        onGetStarted={onShowRegistration} 
        onWizard={onShowWizard} 
        onGuide={onShowGuide} 
      />

      {/* Key Features */}
      <KeyFeatures />

      {/* Testimonials */}
      <Testimonials />

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default HomePage;
