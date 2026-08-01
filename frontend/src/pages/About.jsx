export default function About() {
  return (
    <div className="bg-[#F9FCFB] pb-24">
      
      {/* 1. The Giant Red Header */}
      <div className="bg-[#fd5e53] text-white text-center py-24 md:py-32">
        <h1 className="text-[100px] md:text-[200px] font-black tracking-widest leading-none drop-shadow-md">
          CRAVE
        </h1>
      </div>

      {/* 2. The Overlapping White Box */}
      <div className="flex justify-center px-6 -mt-16 md:-mt-24 relative z-10">
        <div className="bg-white border-2 border-black p-10 md:p-16 w-full max-w-4xl shadow-2xl rounded-2xl text-center">
          <h2 className="text-4xl font-bold text-[#fd5e53] mb-8 underline decoration-4 underline-offset-8">
            About Crave
          </h2>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-6 font-medium">
            Crave is your ultimate culinary companion, dedicated to delivering exceptional food experiences right to your doorstep. With a passion for taste and convenience, we've curated a diverse selection of restaurants, from local gems to international favorites.
          </p>
          <p className="text-lg md:text-xl text-gray-700 leading-relaxed font-medium">
            Whether you're craving comforting classics, healthy options, or adventurous flavors, Crave has something to satisfy every appetite. Our user-friendly platform makes ordering a breeze, and our reliable delivery partners ensure your food arrives hot and fresh.
          </p>
        </div>
      </div>

      {/* 3. The 3-Column Info Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-8 mt-24 text-center items-stretch">
        
        <div className="bg-[#fd5e53] text-white p-10 md:p-12 rounded-2xl shadow-xl hover:-translate-y-2 transition-transform duration-300 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 underline decoration-2 underline-offset-4">Our Story</h2>
          <p className="text-lg leading-relaxed">
            Founded with the vision to bridge the gap between food lovers and their favorite local restaurants, Crave started as a small idea in a college dorm. Today, we are proud to connect thousands of hungry customers with the best culinary experiences their city has to offer.
          </p>
        </div>
        
        <div className="rounded-2xl overflow-hidden shadow-xl h-full min-h-[300px]">
          <img src="/images/aboutback4.jpg" alt="The Team" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
        </div>
        
        <div className="bg-[#fd5e53] text-white p-10 md:p-12 rounded-2xl shadow-xl hover:-translate-y-2 transition-transform duration-300 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 underline decoration-2 underline-offset-4">Our Mission</h2>
          <p className="text-lg leading-relaxed">
            To provide a seamless, reliable, and delightful food delivery experience while empowering local restaurants to reach a wider audience. We believe that good food brings people together, and we strive to make every meal memorable.
          </p>
        </div>
        
      </div>
    </div>
  );
}