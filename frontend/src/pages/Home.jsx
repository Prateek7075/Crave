import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [deliveryImg, setDeliveryImg] = useState('/images/quickdelivery.jpg');
  const [subImg, setSubImg] = useState('/images/subscription.jpg');
  const [billing, setBilling] = useState('monthly');

  return (
    <div className="pb-20">
      {/* 1. Hero Section */}
      <section className="text-center pt-24 pb-16 px-4 max-w-4xl mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Delecious Food Delivered to <span className="text-[#fd5e53]">Your Doorstep</span>
        </h1>
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          Order from a wide selection of mouth-watering dishes and have them delivered straight to your home. Enjoy the convenience of having your favorite meals brought to you hassle-free.
        </p>
        <Link to="/menu" className="bg-black text-white px-10 py-3 text-lg font-bold rounded hover:bg-[#fd5e53] transition-colors">
          Order Now
        </Link>
      </section>

      {/* 2. Scrolling Image Carousel */}
      <section className="flex gap-4 overflow-x-auto px-8 py-8 hide-scrollbar">
        {[1, 2, 3, 4, 5, 6].map((num) => (
          <img key={num} src={`/images/${num}.jpg`} alt={`Food ${num}`} className="h-48 w-72 object-cover rounded-lg shadow-md flex-shrink-0" />
        ))}
      </section>

      {/* 3. Quick Delivery Features */}
      <section className="flex flex-col md:flex-row items-center justify-between px-10 py-16 max-w-7xl mx-auto gap-12">
        <div className="flex-1">
          <img src={deliveryImg} alt="Delivery Feature" className="w-full rounded-2xl shadow-xl" />
        </div>
        <div className="flex-1 space-y-8">
          <div className="cursor-pointer group" onClick={() => setDeliveryImg('/images/quickdelivery.jpg')}>
            <h3 className="text-2xl font-bold group-hover:text-[#fd5e53] transition-colors">Quick Delivery</h3>
            <p className="text-gray-600 text-lg mt-1">Get Your Food Delivered Quickly</p>
          </div>
          <div className="cursor-pointer group" onClick={() => setDeliveryImg('/images/cuisine.jpg')}>
            <h3 className="text-2xl font-bold group-hover:text-[#fd5e53] transition-colors">Multiple Cuisines</h3>
            <p className="text-gray-600 text-lg mt-1">Wide Variety of Cuisines</p>
          </div>
          <div className="cursor-pointer group" onClick={() => setDeliveryImg('/images/ordertrack.jpg')}>
            <h3 className="text-2xl font-bold group-hover:text-[#fd5e53] transition-colors">Bulk Food Delivery</h3>
            <p className="text-gray-600 text-lg mt-1">Deliver For larger groups or events</p>
          </div>
        </div>
      </section>

      {/* 4. Red Banner */}
      <section className="bg-[#fd5e53] text-white text-center py-16 mx-4 md:mx-16 rounded-xl shadow-lg my-10">
        <h2 className="text-4xl font-bold">Craving Delecious Food Delivered to Your Doorstep?</h2>
      </section>

      {/* 5. Subscription Features */}
      <section className="flex flex-col md:flex-row items-center justify-between px-10 py-16 max-w-7xl mx-auto gap-12">
        <div className="flex-1 space-y-8">
          <div className="cursor-pointer group" onClick={() => setSubImg('/images/subscription.jpg')}>
            <h3 className="text-2xl font-bold group-hover:text-[#fd5e53] transition-colors">Subscription Services</h3>
            <p className="text-gray-600 text-lg mt-1">Offering convenience and customization</p>
          </div>
          <div className="cursor-pointer group" onClick={() => setSubImg('/images/time.jpg')}>
            <h3 className="text-2xl font-bold group-hover:text-[#fd5e53] transition-colors">Scheduled Deliveries</h3>
            <p className="text-gray-600 text-lg mt-1">Order Food Anytime</p>
          </div>
          <div className="cursor-pointer group" onClick={() => setSubImg('/images/donation.jpg')}>
            <h3 className="text-2xl font-bold group-hover:text-[#fd5e53] transition-colors">Donation Programs</h3>
            <p className="text-gray-600 text-lg mt-1">Contribute to food banks</p>
          </div>
        </div>
        <div className="flex-1">
          <img src={subImg} alt="Subscription Feature" className="w-full rounded-2xl shadow-xl" />
        </div>
      </section>

      {/* 6. Pricing Plans */}
      <section className="text-center py-16 px-4 bg-white">
        <p className="text-lg text-gray-600">Choose the Perfect Plan for Yourself!</p>
        <h2 className="text-4xl font-bold my-4">Pricing Plan</h2>
        <p className="text-lg text-gray-600 mb-8">A World Of Flavor Delivered</p>
        
        {/* Toggle */}
        <div className="inline-flex border-2 border-[#fd5e53] mb-12">
          <button onClick={() => setBilling('monthly')} className={`px-8 py-2 text-lg font-bold transition-colors ${billing === 'monthly' ? 'bg-[#fd5e53] text-white' : 'text-[#fd5e53] bg-white'}`}>Monthly</button>
          <button onClick={() => setBilling('yearly')} className={`px-8 py-2 text-lg font-bold transition-colors ${billing === 'yearly' ? 'bg-[#fd5e53] text-white' : 'text-[#fd5e53] bg-white'}`}>Yearly</button>
        </div>

        {/* Cards */}
        <div className="flex flex-wrap justify-center gap-8 max-w-7xl mx-auto">
          {[{
            name: 'Basic Plan', monthly: '₹ 59/Month', yearly: '₹ 599/Year', features: ['✔ 10% off on first order.', '✔ Standard shipping.', '✘ Free delivery on all orders.', '✘ Advanced customization options.']
          }, {
            name: 'Business Plan', monthly: '₹ 119/Month', yearly: '₹ 1199/Year', features: ['✔ Free delivery on all orders.', '✔ 30% off on all orders.', '✔ Wider range of meal options.', '✔ Corporate discounts.', '✘ Bulk ordering capabilities', '✘ Special events catering']
          }, {
            name: 'Enterprise Plan', monthly: '₹ 299/Month', yearly: '₹ 2999/Year', features: ['✔ Free delivery on all orders.', '✔ 45% off on all orders.', '✔ Exclusive meal plans.', '✔ Bulk ordering capabilities', '✔ Special events catering', '✔ Comprehensive solutions for large organizations']
          }].map((plan, index) => (
            <div key={index} className="bg-[#fd5e53] text-white p-8 rounded-xl shadow-xl w-80 flex flex-col items-center hover:-translate-y-2 transition-transform duration-300">
              <p className="text-xl mb-4">{plan.name}</p>
              <h3 className="text-3xl font-bold mb-6">{billing === 'monthly' ? plan.monthly : plan.yearly}</h3>
              <div className="text-left space-y-3 mb-8 w-full">
                {plan.features.map((f, i) => <p key={i}>{f}</p>)}
              </div>
              <Link to="/register" className="mt-auto bg-white text-[#fd5e53] font-bold py-3 w-full rounded hover:bg-black hover:text-white transition-colors border-2 border-transparent hover:border-black">
                Choose Plan
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Discover CRAVE Ladder */}
      <section className="flex flex-col md:flex-row justify-between items-center px-10 py-20 max-w-7xl mx-auto gap-16">
        <div className="flex-1">
          <h2 className="text-4xl font-bold mb-6">Discover <span className="text-[#fd5e53] underline">CRAVE</span></h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-8">
            Crave is your ultimate culinary companion, dedicated to delivering exceptional food experiences right to your doorstep. With a passion for taste and convenience, we've curated a diverse selection of restaurants, from local gems to international favorites.
          </p>
          <Link to="/about" className="bg-[#fd5e53] text-white px-8 py-3 rounded font-bold hover:bg-black transition-colors">
            About Us
          </Link>
        </div>
        <div className="flex-1 space-y-6">
          <div className="bg-white p-6 shadow-md rounded-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">01 &emsp; Browse Menu</h3>
            <p className="text-gray-600">Explore our wide range of delicious dishes on the menu.</p>
          </div>
          <div className="bg-white p-6 shadow-md rounded-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">02 &emsp; Place Order</h3>
            <p className="text-gray-600">Select your favorite items and place your order with ease.</p>
          </div>
          <div className="bg-white p-6 shadow-md rounded-lg border border-gray-100">
            <h3 className="text-xl font-bold text-gray-900 mb-2">03 &emsp; Track Delivery</h3>
            <p className="text-gray-600">Monitor the status of your order and track the delivery in real-time.</p>
          </div>
          <div className="bg-[#fd5e53] text-white p-6 shadow-lg rounded-lg -translate-x-4">
            <h3 className="text-xl font-bold mb-2">04 &emsp; Enjoy Your Meal</h3>
            <p className="text-white opacity-90">Sit back, relax, and enjoy a tasty meal delivered right to your doorstep.</p>
          </div>
        </div>
      </section>

      {/* 8. Reviews */}
      <section className="text-center py-16 px-4 bg-gray-50">
        <h2 className="text-4xl font-bold mb-2">Reviews</h2>
        <p className="text-lg text-gray-600 mb-10">Some Testimonials</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto text-left">
          {[{
            name: 'Rajesh Gupta', img: 'review1.png', stars: 5, text: "I've been using CRAVE for years. Their app is user-friendly, and the delivery is usually prompt. I love the variety of restaurants they offer. The food always arrives hot and fresh."
          }, {
            name: 'Aanya Patel', img: 'review2.png', stars: 4, text: "This is my go-to for food delivery. They have a wide range of cuisines and often offer great deals. The delivery drivers are always polite and efficient."
          }, {
            name: 'Aryan Singh', img: 'review3.png', stars: 4, text: "Crave is convenient to order food and track your delivery in one place. The food quality is generally good, and the delivery times are reliable."
          }, {
            name: 'Aarav Sharma', img: 'review4.png', stars: 4, text: "It is great for quick and easy deliveries. I've used it to order groceries, essentials, and even small items from local stores. The delivery is usually very fast."
          }].map((review, index) => (
            <div key={index} className="bg-white p-8 border-2 border-black rounded-lg">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4 font-bold text-lg">
                  <img src={`/images/${review.img}`} alt={review.name} className="w-12 h-12 rounded-full border border-gray-200" />
                  {review.name}
                </div>
                <div className="text-black text-xl">
                  {[...Array(5)].map((_, i) => (
                    <i key={i} className={`fa-star ${i < review.stars ? 'fa-solid' : 'fa-regular'}`}></i>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}