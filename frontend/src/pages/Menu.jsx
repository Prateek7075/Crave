import { Link } from "react-router-dom";

const catalogueFeatures = [
  {
    icon: "fa-store",
    title: "Verified restaurants",
    description:
      "Only approved and active restaurants will appear in the customer catalogue.",
  },
  {
    icon: "fa-bowl-food",
    title: "Live menu availability",
    description:
      "Customers will only see items currently marked available by the restaurant.",
  },
  {
    icon: "fa-tags",
    title: "Transparent pricing",
    description:
      "Menu prices remain restaurant-controlled, without platform-added food markup.",
  },
  {
    icon: "fa-location-dot",
    title: "Serviceable locations",
    description:
      "Delivery availability will depend on your selected address and restaurant radius.",
  },
];

const deliveryFlow = [
  {
    number: "01",
    title: "Choose an address",
    description:
      "Crave checks which restaurants can deliver to your saved location.",
  },
  {
    number: "02",
    title: "Explore available menus",
    description:
      "Browse active restaurants, categories and currently available dishes.",
  },
  {
    number: "03",
    title: "Review the complete price",
    description:
      "See food, packaging, delivery, platform fees and taxes before payment.",
  },
];

export default function Menu() {
  return (
    <main className="overflow-hidden bg-white">
      <section className="relative border-b border-gray-100 bg-[#fff8f6]">
        <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-[#f45d52]/10 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl" />

        <div className="relative mx-auto grid min-h-[620px] max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f45d52]/20 bg-white px-4 py-2 text-sm font-black text-[#f45d52] shadow-sm">
              <i className="fa-solid fa-utensils" />
              Restaurant catalogue
            </div>

            <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[1.03] tracking-tight text-gray-950 sm:text-6xl lg:text-7xl">
              Your next meal is
              <span className="block text-[#f45d52]">being prepared.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-600 sm:text-xl">
              Restaurant onboarding, menu management, serviceability and live
              item availability will power this page next.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/dashboard/addresses"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#f45d52] px-7 py-4 font-black text-white shadow-lg shadow-[#f45d52]/20 transition-all hover:-translate-y-1 hover:bg-black"
              >
                Manage Addresses
                <i className="fa-solid fa-location-dot" />
              </Link>

              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-gray-900 bg-white px-7 py-4 font-black text-gray-900 transition-all hover:-translate-y-1 hover:bg-gray-900 hover:text-white"
              >
                How Crave Works
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="rounded-[2.5rem] border border-white bg-white p-5 shadow-2xl shadow-gray-300/50">
              <div className="rounded-[2rem] bg-gray-950 p-7 text-white sm:p-8">
                <div className="flex items-start justify-between gap-5">
                  <div>
                    <p className="text-sm font-black uppercase tracking-[0.2em] text-[#f45d52]">
                      Catalogue status
                    </p>

                    <h2 className="mt-3 text-3xl font-black">
                      Menus are coming next
                    </h2>
                  </div>

                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f45d52] text-2xl">
                    <i className="fa-solid fa-burger" />
                  </span>
                </div>

                <div className="mt-8 space-y-4">
                  <div className="flex items-center gap-4 rounded-2xl border border-gray-800 bg-white/5 p-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/15 text-green-400">
                      <i className="fa-solid fa-check" />
                    </span>

                    <div>
                      <p className="font-black">Customer authentication</p>

                      <p className="mt-1 text-sm text-gray-400">
                        Mobile OTP and session login ready
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl border border-gray-800 bg-white/5 p-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-green-500/15 text-green-400">
                      <i className="fa-solid fa-check" />
                    </span>

                    <div>
                      <p className="font-black">Saved delivery addresses</p>

                      <p className="mt-1 text-sm text-gray-400">
                        Map-based address management ready
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 rounded-2xl border border-gray-800 bg-white/5 p-5">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f45d52]/15 text-[#f45d52]">
                      <i className="fa-solid fa-spinner" />
                    </span>

                    <div>
                      <p className="font-black">Restaurants and menus</p>

                      <p className="mt-1 text-sm text-gray-400">
                        Backend implementation pending
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-7 -right-3 rounded-2xl bg-[#f45d52] p-5 text-white shadow-xl sm:-right-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
                  <i className="fa-solid fa-receipt" />
                </span>

                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-white/70">
                    Future checkout
                  </p>

                  <p className="font-black">Every charge explained</p>
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
              Catalogue principles
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
              What customers will experience
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              The menu catalogue will be driven by verified restaurants, real
              availability and transparent operational rules.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {catalogueFeatures.map((feature) => (
              <article
                key={feature.title}
                className="group rounded-3xl border border-gray-100 bg-[#fafcfc] p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#f45d52]/20 hover:bg-white hover:shadow-xl"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0ed] text-xl text-[#f45d52] transition-colors group-hover:bg-[#f45d52] group-hover:text-white">
                  <i className={`fa-solid ${feature.icon}`} />
                </span>

                <h3 className="mt-6 text-xl font-black text-gray-950">
                  {feature.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f8f7] px-6 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#f45d52]">
              Planned ordering journey
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
              Relevant food for your location
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              The catalogue will not show an identical list to every customer.
              Saved location, restaurant availability and delivery
              serviceability will determine what can actually be ordered.
            </p>

            <Link
              to="/dashboard/addresses/new"
              className="mt-8 inline-flex items-center gap-3 font-black text-[#f45d52] transition-colors hover:text-black"
            >
              Add a delivery address
              <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>

          <div className="space-y-5">
            {deliveryFlow.map((step) => (
              <article
                key={step.number}
                className="flex gap-5 rounded-3xl border border-gray-100 bg-white p-6 shadow-sm transition-transform hover:translate-x-2"
              >
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gray-950 text-sm font-black text-white">
                  {step.number}
                </span>

                <div>
                  <h3 className="text-xl font-black text-gray-950">
                    {step.title}
                  </h3>

                  <p className="mt-2 leading-7 text-gray-600">
                    {step.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[2.5rem] bg-gray-950 px-7 py-14 text-white sm:px-12 lg:flex lg:items-center lg:justify-between lg:px-16">
            <div className="max-w-2xl">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-[#f45d52]">
                Prepare your account
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                Save your delivery location now.
              </h2>

              <p className="mt-5 text-lg leading-8 text-gray-400">
                Your saved addresses will later be used to find nearby
                restaurants and validate delivery availability.
              </p>
            </div>

            <Link
              to="/dashboard/addresses"
              className="mt-8 inline-flex shrink-0 items-center justify-center gap-3 rounded-2xl bg-[#f45d52] px-7 py-4 font-black text-white transition-all hover:-translate-y-1 hover:bg-white hover:text-gray-950 lg:mt-0"
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
