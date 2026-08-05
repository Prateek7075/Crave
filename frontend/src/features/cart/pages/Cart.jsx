import { Link } from "react-router-dom";

const checkoutRequirements = [
  {
    icon: "fa-store",
    title: "Restaurant catalogue",
    description:
      "Customers need verified restaurants and live menu items before building a cart.",
    status: "Pending",
  },
  {
    icon: "fa-location-dot",
    title: "Delivery serviceability",
    description:
      "The selected address must be inside the restaurant delivery radius.",
    status: "Planned",
  },
  {
    icon: "fa-calculator",
    title: "Server-side pricing",
    description:
      "Laravel will calculate food, packaging, delivery, platform fees and taxes.",
    status: "Planned",
  },
  {
    icon: "fa-credit-card",
    title: "Online payment",
    description:
      "Payment confirmation will happen before the order becomes active.",
    status: "Planned",
  },
];

const futurePriceBreakdown = [
  "Food subtotal",
  "Restaurant discount",
  "Packaging charges",
  "Delivery fee",
  "Crave platform fee",
  "Applicable taxes",
  "Delivery-partner tip",
];

export default function Cart() {
  return (
    <main className="overflow-hidden bg-white">
      <section className="relative border-b border-gray-100 bg-[#fff8f6]">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#f45d52]/10 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl" />

        <div className="relative mx-auto grid min-h-[610px] max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.02fr_0.98fr] lg:px-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f45d52]/20 bg-white px-4 py-2 text-sm font-black text-[#f45d52] shadow-sm">
              <i className="fa-solid fa-cart-shopping" />
              Your Crave cart
            </div>

            <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[1.03] tracking-tight text-gray-950 sm:text-6xl lg:text-7xl">
              Checkout is being
              <span className="block text-[#f45d52]">built carefully.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-600 sm:text-xl">
              Cart ordering will activate after restaurant menus, delivery
              eligibility, trusted pricing and online payments are ready.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/menu"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#f45d52] px-7 py-4 font-black text-white shadow-lg shadow-[#f45d52]/20 transition-all hover:-translate-y-1 hover:bg-black"
              >
                Explore Menu Status
                <i className="fa-solid fa-arrow-right" />
              </Link>

              <Link
                to="/dashboard/addresses"
                className="inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-gray-900 bg-white px-7 py-4 font-black text-gray-900 transition-all hover:-translate-y-1 hover:bg-gray-900 hover:text-white"
              >
                Manage Addresses
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="rounded-[2.5rem] border border-white bg-white p-5 shadow-2xl shadow-gray-300/50">
              <div className="rounded-[2rem] bg-gray-950 p-7 text-white sm:p-8">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-[#f45d52]">
                      Order summary
                    </p>

                    <h2 className="mt-3 text-3xl font-black">
                      Your cart is empty
                    </h2>
                  </div>

                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f45d52] text-2xl">
                    <i className="fa-solid fa-basket-shopping" />
                  </span>
                </div>

                <div className="mt-8 rounded-3xl border border-dashed border-gray-700 bg-white/5 px-6 py-10 text-center">
                  <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/10 text-3xl text-[#f45d52]">
                    <i className="fa-solid fa-utensils" />
                  </span>

                  <p className="mt-5 text-lg font-black">No menu items added</p>

                  <p className="mt-2 leading-7 text-gray-400">
                    Real items will appear here after the restaurant catalogue
                    is connected.
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-between rounded-2xl bg-white/5 p-5">
                  <span className="font-bold text-gray-400">
                    Payable amount
                  </span>

                  <span className="text-2xl font-black text-gray-500">—</span>
                </div>

                <button
                  type="button"
                  disabled
                  className="mt-5 flex w-full cursor-not-allowed items-center justify-center gap-3 rounded-2xl bg-gray-800 px-6 py-4 font-black text-gray-500"
                >
                  Proceed to Checkout
                  <i className="fa-solid fa-lock" />
                </button>
              </div>
            </div>

            <div className="absolute -bottom-7 -right-3 rounded-2xl bg-[#f45d52] p-5 text-white shadow-xl sm:-right-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
                  <i className="fa-solid fa-shield-halved" />
                </span>

                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-white/70">
                    Future pricing
                  </p>

                  <p className="font-black">Verified by Laravel</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#f45d52]">
              Checkout foundation
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
              What must be ready first
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Checkout depends on multiple backend rules. These will be
              implemented before customers can place real orders.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {checkoutRequirements.map((requirement) => (
              <article
                key={requirement.title}
                className="group rounded-3xl border border-gray-100 bg-[#fafcfc] p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#f45d52]/20 hover:bg-white hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-5">
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0ed] text-xl text-[#f45d52] transition-colors group-hover:bg-[#f45d52] group-hover:text-white">
                    <i className={`fa-solid ${requirement.icon}`} />
                  </span>

                  <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-black uppercase tracking-wider text-gray-500">
                    {requirement.status}
                  </span>
                </div>

                <h3 className="mt-6 text-2xl font-black text-gray-950">
                  {requirement.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {requirement.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f8f7] px-6 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#f45d52]">
              Transparent checkout
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
              One total, every charge explained
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              The customer will see a compact total with an expandable breakdown
              before making the payment.
            </p>

            <Link
              to="/about"
              className="mt-8 inline-flex items-center gap-3 font-black text-[#f45d52] transition-colors hover:text-black"
            >
              Read Crave principles
              <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>

          <div className="rounded-[2rem] border border-gray-100 bg-white p-7 shadow-sm sm:p-9">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                  Future fee details
                </p>

                <h3 className="mt-2 text-2xl font-black text-gray-950">
                  Checkout breakdown
                </h3>
              </div>

              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#fff0ed] text-[#f45d52]">
                <i className="fa-solid fa-receipt" />
              </span>
            </div>

            <div className="mt-7 divide-y divide-gray-100">
              {futurePriceBreakdown.map((item) => (
                <div
                  key={item}
                  className="flex items-center justify-between gap-5 py-4"
                >
                  <span className="font-bold text-gray-700">{item}</span>

                  <span className="text-sm font-black text-gray-300">—</span>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between rounded-2xl bg-gray-950 p-5 text-white">
              <span className="font-black">Final payable</span>

              <span className="text-2xl font-black text-gray-500">—</span>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#f45d52] to-[#ff8a68] px-7 py-14 text-white sm:px-12 lg:flex lg:items-center lg:justify-between lg:px-16">
            <div className="max-w-2xl">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-white/70">
                Prepare for ordering
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                Save an accurate delivery address.
              </h2>

              <p className="mt-5 text-lg leading-8 text-white/80">
                Your saved location will later determine restaurant availability
                and delivery serviceability.
              </p>
            </div>

            <Link
              to="/dashboard/addresses"
              className="mt-8 inline-flex shrink-0 items-center justify-center gap-3 rounded-2xl bg-white px-7 py-4 font-black text-gray-950 transition-all hover:-translate-y-1 hover:bg-gray-950 hover:text-white lg:mt-0"
            >
              Manage Addresses
              <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
