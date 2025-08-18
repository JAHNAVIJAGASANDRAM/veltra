export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center sticky top-0 z-50">
      <a href="#top" className="text-2xl font-bold text-blue-500">Veltra</a>
      <div className="space-x-4 text-sm md:text-base">
        <a href="#hero" className="hover:text-blue-500">Home</a>
        <a href="#features" className="hover:text-blue-500">Features</a>
        <a href="#how" className="hover:text-blue-500">How it works</a>
        <a href="#why" className="hover:text-blue-500">Why Veltra</a>
        <a href="#screenshots" className="hover:text-blue-500">Screenshots</a>
        <a href="#testimonials" className="hover:text-blue-500">Testimonials</a>
        <a href="#contact" className="hover:text-blue-500">Contact</a>
      </div>
    </nav>
  );
}
