export default function Navbar() {
  return (
    <nav className="modern-nav sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <a href="#top" className="text-2xl font-bold text-gray-800 hover:text-blue-600 transition-colors">
              Veltra
            </a>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <a href="#top" className="nav-link">Home</a>
            <a href="#features" className="nav-link">Features</a>
            <a href="#how-it-works" className="nav-link">How it works</a>
            <a href="#why" className="nav-link">Why Veltra</a>
            <a href="#screenshots" className="nav-link">Screenshots</a>
            <a href="#testimonials" className="nav-link">Testimonials</a>
            <a href="#contact" className="nav-link">Contact</a>
          </div>
          
          <div className="flex items-center space-x-4">
            <button className="btn-secondary px-4 py-2 text-sm">Sign In</button>
            <button className="btn-primary px-4 py-2 text-sm">Get Started</button>
          </div>
        </div>
      </div>
    </nav>
  );
}
