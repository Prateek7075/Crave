import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <div className="bg-white">
      {/* Contact Top Section */}
      <div id="contact" className="text-center py-16 px-4">
        <p className="text-gray-600 mb-2">Our customer service team is available to assist you.</p>
        <h2 className="text-4xl font-bold mb-2">Contact Us</h2>
        <p className="text-gray-600 mb-12">Have a question or feedback? Reach out to us!</p>

        <div className="flex flex-wrap justify-center gap-16 max-w-6xl mx-auto">
          <div className="w-64">
            <i className="fa-regular fa-envelope text-5xl mb-4 text-black"></i>
            <h3 className="text-2xl font-bold mb-2">Email</h3>
            <p className="text-gray-600 mb-2 text-sm">Contact us on mail for updates and promotions.</p>
            <p className="font-semibold">crave123@gmail.com</p>
          </div>
          <div className="w-64">
            <i className="fa-solid fa-phone text-5xl mb-4 text-black"></i>
            <h3 className="text-2xl font-bold mb-2">Call</h3>
            <p className="text-gray-600 mb-2 text-sm">We value your input and strive to provide the best service.</p>
            <p className="font-semibold">+91 123-456-789</p>
          </div>
          <div className="w-64">
            <i className="fa-solid fa-location-dot text-5xl mb-4 text-black"></i>
            <h3 className="text-2xl font-bold mb-2">Office</h3>
            <p className="text-gray-600 mb-2 text-sm">Stay connected with us!</p>
            <p className="font-semibold">Chitkara University, Rajpura</p>
          </div>
        </div>
      </div>

      <hr className="border-black border-t-2 mx-8" />
      
      {/* Main Footer */}
      <footer className="flex flex-wrap justify-between items-start py-12 px-12 max-w-7xl mx-auto gap-8">
        <div className="w-full md:w-5/12">
          <img src="/images/CRAVE.png" alt="Crave Logo" className="h-10 mb-4" />
          <p className="text-gray-600 mb-4 text-sm">Subscribe for the latest updates on new features and food services.</p>
          <div className="flex w-full">
            <input type="email" placeholder="Enter Your Email" className="border border-[#fd5e53] px-4 py-2 w-full outline-none text-[#fd5e53] placeholder:text-[#fd5e53]/70" /> 
            <button className="bg-[#fd5e53] text-white px-6 py-2 border border-[#fd5e53] font-semibold hover:bg-black hover:border-black transition-colors">Subscribe</button>
          </div>
        </div>

        <div className="w-full md:w-2/12 leading-loose">
          <Link to="/" className="hover:underline block font-semibold text-black">Home</Link>
          <Link to="/menu" className="hover:underline block font-semibold text-gray-700">Menu</Link>
          <Link to="/about" className="hover:underline block font-semibold text-gray-700">About Us</Link>
          <a href="#contact" className="hover:underline block font-semibold text-gray-700">Contact Us</a>
        </div>

        <div className="w-full md:w-3/12 leading-loose">
          <b className="block mb-2 text-black">Follow Us</b>
          <a href="#" className="hover:underline block text-gray-700"><i className="fa-brands fa-facebook w-6 text-black"></i> Facebook </a>
          <a href="#" className="hover:underline block text-gray-700"><i className="fa-brands fa-instagram w-6 text-black"></i> Instagram </a>
          <a href="#" className="hover:underline block text-gray-700"><i className="fa-brands fa-linkedin w-6 text-black"></i> Linkedin </a>
          <a href="#" className="hover:underline block text-gray-700"><i className="fa-brands fa-x-twitter w-6 text-black"></i> Twitter </a>
        </div>
      </footer>

      <div className="bg-gray-50 text-right pr-8 py-4 text-sm text-black font-semibold border-t border-gray-200">
          © {new Date().getFullYear()} Crave. All Rights Reserved.
      </div>
    </div>
  );
}