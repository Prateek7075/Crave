import { Link } from "react-router-dom";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-gray-800 bg-[#111111] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 md:grid-cols-3 lg:px-8">
        <section>
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f45d52]">
              <i className="fa-solid fa-utensils" />
            </span>

            <span className="text-3xl font-black text-[#f45d52]">Crave</span>
          </Link>

          <p className="mt-5 max-w-sm leading-7 text-gray-400">
            A fair and transparent food-delivery experience for customers,
            restaurants and delivery partners.
          </p>
        </section>

        <section>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">
            Explore
          </h2>

          <div className="mt-5 flex flex-col items-start gap-3">
            <Link
              to="/"
              className="text-gray-300 transition-colors hover:text-[#f45d52]"
            >
              Home
            </Link>

            <Link
              to="/menu"
              className="text-gray-300 transition-colors hover:text-[#f45d52]"
            >
              Explore Menu
            </Link>

            <Link
              to="/about"
              className="text-gray-300 transition-colors hover:text-[#f45d52]"
            >
              About Crave
            </Link>

            <Link
              to="/cart"
              className="text-gray-300 transition-colors hover:text-[#f45d52]"
            >
              Cart
            </Link>
          </div>
        </section>

        <section>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-gray-400">
            Customer
          </h2>

          <div className="mt-5 flex flex-col items-start gap-3">
            <Link
              to="/login"
              className="text-gray-300 transition-colors hover:text-[#f45d52]"
            >
              Login
            </Link>

            <Link
              to="/dashboard"
              className="text-gray-300 transition-colors hover:text-[#f45d52]"
            >
              Dashboard
            </Link>

            <Link
              to="/dashboard/addresses"
              className="text-gray-300 transition-colors hover:text-[#f45d52]"
            >
              Saved Addresses
            </Link>
          </div>
        </section>
      </div>

      <div className="border-t border-gray-800">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>© {currentYear} Crave. All rights reserved.</p>

          <p>Fair food delivery, built transparently.</p>
        </div>
      </div>
    </footer>
  );
}
