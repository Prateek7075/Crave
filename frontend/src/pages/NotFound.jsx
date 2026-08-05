import { Link, useLocation } from "react-router-dom";

export default function NotFound() {
  const location = useLocation();

  return (
    <main className="relative flex min-h-[720px] items-center overflow-hidden bg-[#fff8f6] px-6 py-20 lg:px-8">
      <div className="absolute -left-24 top-20 h-80 w-80 rounded-full bg-[#f45d52]/10 blur-3xl" />
      <div className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-14 lg:grid-cols-[1fr_0.85fr]">
        <section>
          <div className="inline-flex items-center gap-2 rounded-full border border-[#f45d52]/20 bg-white px-4 py-2 text-sm font-black text-[#f45d52] shadow-sm">
            <i className="fa-solid fa-triangle-exclamation" />
            Page not found
          </div>

          <p className="mt-8 text-8xl font-black leading-none tracking-tight text-[#f45d52] sm:text-9xl">
            404
          </p>

          <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
            This craving led to the wrong place.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            The page may have been moved, removed or the address may be
            incorrect.
          </p>

          <div className="mt-5 max-w-2xl rounded-2xl border border-gray-200 bg-white px-5 py-4">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">
              Requested path
            </p>

            <p className="mt-2 break-all font-bold text-gray-700">
              {location.pathname}
            </p>
          </div>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row">
            <Link
              to="/"
              replace
              className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#f45d52] px-7 py-4 font-black text-white shadow-lg shadow-[#f45d52]/20 transition-all hover:-translate-y-1 hover:bg-black"
            >
              <i className="fa-solid fa-house" />
              Return Home
            </Link>

            <Link
              to="/menu"
              className="inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-gray-900 bg-white px-7 py-4 font-black text-gray-900 transition-all hover:-translate-y-1 hover:bg-gray-900 hover:text-white"
            >
              Explore Menu
              <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
        </section>

        <section className="relative mx-auto w-full max-w-md">
          <div className="rounded-[2.5rem] border border-white bg-white p-6 shadow-2xl shadow-gray-300/50">
            <div className="rounded-[2rem] bg-gray-950 px-7 py-12 text-center text-white">
              <span className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#f45d52] text-4xl">
                <i className="fa-solid fa-utensils" />
              </span>

              <h2 className="mt-7 text-3xl font-black">
                Nothing is being served here
              </h2>

              <p className="mt-4 leading-7 text-gray-400">
                Try returning home or continue exploring the sections currently
                available in Crave.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-3">
                <Link
                  to="/about"
                  className="rounded-xl bg-white/10 px-4 py-3 text-sm font-black transition-colors hover:bg-white hover:text-gray-950"
                >
                  About
                </Link>

                <Link
                  to="/dashboard"
                  className="rounded-xl bg-white/10 px-4 py-3 text-sm font-black transition-colors hover:bg-white hover:text-gray-950"
                >
                  Dashboard
                </Link>
              </div>
            </div>
          </div>

          <div className="absolute -bottom-6 -right-3 rounded-2xl bg-[#f45d52] p-5 text-white shadow-xl sm:-right-7">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                <i className="fa-solid fa-compass" />
              </span>

              <p className="font-black">Let’s get you back</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
