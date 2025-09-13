import Hero from "../components/Home/Hero";
import KeyFeatures from "../components/Home/KeyFeatures";
import Testimonials from "../components/Home/Testimonials";

function HomePage({ onShowRegistration, onShowWizard, onShowGuide }) {
  return (
    <>
      <Hero onGetStarted={onShowRegistration} onWizard={onShowWizard} onGuide={onShowGuide} />
      <KeyFeatures />
      <Testimonials />
    </>
  );
}

export default HomePage;
