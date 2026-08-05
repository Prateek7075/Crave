import { Link } from "react-router-dom";

const benefits = [
  {
    icon: "fa-store",
    title: "Fair for restaurants",
    description:
      "Low transparent platform charges without forced discounts or hidden menu markups.",
  },
  {
    icon: "fa-receipt",
    title: "Clear for customers",
    description:
      "See food, packaging, delivery, platform fees and taxes before placing an order.",
  },
  {
    icon: "fa-motorcycle",
    title: "Better for partners",
    description:
      "Delivery earnings stay clear, predictable and independent from customer tips.",
  },
];

const steps = [
  {
    number: "01",
    title: "Choose your food",
    description:
      "Explore nearby restaurants and discover meals that match your craving.",
  },
  {
    number: "02",
    title: "Review everything",
    description:
      "Check prices, fees, delivery details and your saved address before payment.",
  },
  {
    number: "03",
    title: "Track your order",
    description:
      "Follow clear order updates from restaurant confirmation to doorstep delivery.",
  },
];

export default function Home() {
  return (
    <main className="overflow-hidden">
      <section className="relative bg-[#fff8f6]">
        <div className="absolute -left-32 top-24 h-72 w-72 rounded-full bg-[#f45d52]/10 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl" />

        <div className="relative mx-auto grid min-h-[720px] max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.08fr_0.92fr] lg:px-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f45d52]/20 bg-white px-4 py-2 text-sm font-bold text-[#f45d52] shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[#f45d52]" />
              Fair food delivery, made simple
            </div>

            <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[1.02] tracking-tight text-gray-950 sm:text-6xl lg:text-7xl">
              Good food.
              <span className="block text-[#f45d52]">No hidden surprises.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-600 sm:text-xl">
              Crave connects customers, restaurants and delivery partners
              through a transparent, reliable and fairly priced food-delivery
              experience.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/menu"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#f45d52] px-7 py-4 font-black text-white shadow-lg shadow-[#f45d52]/20 transition-all hover:-translate-y-1 hover:bg-black"
              >
                Explore Our Menu
                <i className="fa-solid fa-arrow-right" />
              </Link>

              <Link
                to="/about"
                className="inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-gray-900 bg-white px-7 py-4 font-black text-gray-900 transition-all hover:-translate-y-1 hover:bg-gray-900 hover:text-white"
              >
                Why Crave?
              </Link>
            </div>

            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4">
              <div>
                <p className="text-2xl font-black text-gray-950">Clear</p>
                <p className="mt-1 text-sm text-gray-500">Fee breakdown</p>
              </div>

              <div className="border-l border-gray-200 pl-4">
                <p className="text-2xl font-black text-gray-950">Fair</p>
                <p className="mt-1 text-sm text-gray-500">Restaurant charges</p>
              </div>

              <div className="border-l border-gray-200 pl-4">
                <p className="text-2xl font-black text-gray-950">Honest</p>
                <p className="mt-1 text-sm text-gray-500">Menu pricing</p>
              </div>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -left-6 top-16 hidden rounded-2xl bg-white p-4 shadow-xl sm:block">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
                  <i className="fa-solid fa-circle-check" />
                </span>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Pricing
                  </p>
                  <p className="font-black text-gray-900">No hidden markup</p>
                </div>
              </div>
            </div>

            <div className="rounded-[2.5rem] border border-white bg-white p-5 shadow-2xl shadow-gray-300/50">
              <div className="rounded-[2rem] bg-gradient-to-br from-[#f45d52] via-[#fb765e] to-[#ffaf78] p-7 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-white/75">
                      Tonight’s craving
                    </p>

                    <h2 className="mt-1 text-3xl font-black">
                      Something delicious
                    </h2>
                  </div>

                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20 backdrop-blur">
                    <i className="fa-solid fa-burger text-2xl" />
                  </span>
                </div>

                <div className="mt-10 rounded-3xl bg-white p-5 text-gray-900 shadow-lg">
                  <div className="flex items-start gap-4">
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-orange-100 text-4xl">
                      🍕
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="text-lg font-black">
                            Your favourite meal
                          </p>

                          <p className="mt-1 text-sm text-gray-500">
                            Fresh, nearby and transparently priced
                          </p>
                        </div>

                        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700">
                          Open
                        </span>
                      </div>

                      <div className="mt-5 flex items-center gap-5 text-sm font-bold text-gray-600">
                        <span className="flex items-center gap-2">
                          <i className="fa-solid fa-clock text-[#f45d52]" />
                          Fast
                        </span>

                        <span className="flex items-center gap-2">
                          <i className="fa-solid fa-location-dot text-[#f45d52]" />
                          Nearby
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-4">
                  <div className="rounded-2xl bg-black/15 p-4 backdrop-blur">
                    <p className="text-xs font-bold uppercase tracking-wider text-white/70">
                      Restaurant price
                    </p>
                    <p className="mt-2 text-xl font-black">Transparent</p>
                  </div>

                  <div className="rounded-2xl bg-black/15 p-4 backdrop-blur">
                    <p className="text-xs font-bold uppercase tracking-wider text-white/70">
                      Delivery status
                    </p>
                    <p className="mt-2 text-xl font-black">Trackable</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-7 -right-4 rounded-2xl bg-gray-950 p-5 text-white shadow-xl sm:-right-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#f45d52]">
                  <i className="fa-solid fa-receipt" />
                </span>

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                    Checkout
                  </p>
                  <p className="font-black">Every charge explained</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#f45d52]">
              Built differently
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
              Food delivery that works fairly for everyone
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Crave is being designed around transparency, operational fairness
              and a simpler ordering experience.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {benefits.map((benefit) => (
              <article
                key={benefit.title}
                className="group rounded-3xl border border-gray-100 bg-[#fbfcfc] p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#f45d52]/20 hover:shadow-xl"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0ed] text-xl text-[#f45d52] transition-colors group-hover:bg-[#f45d52] group-hover:text-white">
                  <i className={`fa-solid ${benefit.icon}`} />
                </span>

                <h3 className="mt-6 text-2xl font-black text-gray-950">
                  {benefit.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {benefit.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f8f7] px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-14 lg:grid-cols-[0.85fr_1.15fr]">
            <div>
              <p className="text-sm font-black uppercase tracking-[0.25em] text-[#f45d52]">
                Simple journey
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
                From craving to doorstep
              </h2>

              <p className="mt-5 text-lg leading-8 text-gray-600">
                Ordering should feel straightforward—not like solving hidden
                prices, unclear statuses or confusing delivery flows.
              </p>

              <Link
                to="/menu"
                className="mt-8 inline-flex items-center gap-3 font-black text-[#f45d52] transition-colors hover:text-black"
              >
                Start exploring
                <i className="fa-solid fa-arrow-right" />
              </Link>
            </div>

            <div className="space-y-5">
              {steps.map((step) => (
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
        </div>
      </section>

      <section className="bg-white px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[2.5rem] bg-gray-950 px-7 py-14 text-white sm:px-12 lg:flex lg:items-center lg:justify-between lg:px-16">
            <div className="max-w-2xl">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-[#f45d52]">
                Hungry already?
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                Your next favourite meal starts here.
              </h2>

              <p className="mt-5 text-lg leading-8 text-gray-400">
                Explore Crave and see how a clearer, fairer food-delivery
                experience can feel.
              </p>
            </div>

            <Link
              to="/menu"
              className="mt-8 inline-flex shrink-0 items-center justify-center gap-3 rounded-2xl bg-[#f45d52] px-7 py-4 font-black text-white transition-all hover:-translate-y-1 hover:bg-white hover:text-gray-950 lg:mt-0"
            >
              Explore Menu
              <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
