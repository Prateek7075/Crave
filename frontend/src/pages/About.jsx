import { Link } from "react-router-dom";

const principles = [
  {
    icon: "fa-receipt",
    title: "Transparent for customers",
    description:
      "Food price, packaging, delivery, platform fee, taxes and tip should be clearly visible before payment.",
  },
  {
    icon: "fa-store",
    title: "Fair for restaurants",
    description:
      "Restaurants should control their menu prices and offers without forced discounts or hidden platform markups.",
  },
  {
    icon: "fa-motorcycle",
    title: "Respectful to delivery partners",
    description:
      "Delivery earnings should be understandable, predictable and separate from customer tips.",
  },
  {
    icon: "fa-shield-halved",
    title: "Built with accountability",
    description:
      "Important actions such as cancellations, refunds, settlements and overrides should remain traceable.",
  },
];

const customerExperience = [
  "Mobile OTP login without password friction",
  "Saved delivery addresses with precise map locations",
  "Clear restaurant and menu availability",
  "Complete checkout fee breakdown",
  "Trackable order progress",
  "Audited refund and support workflows",
];

const platformPromises = [
  {
    label: "Menu pricing",
    value: "No platform-added markup",
  },
  {
    label: "Customer checkout",
    value: "Every major charge explained",
  },
  {
    label: "Restaurant control",
    value: "Own prices and offers",
  },
  {
    label: "Delivery partner tips",
    value: "100% belongs to the partner",
  },
];

export default function About() {
  return (
    <main className="overflow-hidden bg-white">
      <section className="relative border-b border-gray-100 bg-[#fff8f6]">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#f45d52]/10 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-orange-200/30 blur-3xl" />

        <div className="relative mx-auto grid min-h-[640px] max-w-7xl items-center gap-14 px-6 py-20 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#f45d52]/20 bg-white px-4 py-2 text-sm font-black text-[#f45d52] shadow-sm">
              <i className="fa-solid fa-heart" />
              Why Crave exists
            </div>

            <h1 className="mt-7 max-w-3xl text-5xl font-black leading-[1.03] tracking-tight text-gray-950 sm:text-6xl lg:text-7xl">
              Food delivery should feel
              <span className="block text-[#f45d52]">fair to everyone.</span>
            </h1>

            <p className="mt-7 max-w-2xl text-lg leading-8 text-gray-600 sm:text-xl">
              Crave is being built around a simple idea: customers deserve
              clarity, restaurants deserve control and delivery partners deserve
              transparent earnings.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row">
              <Link
                to="/menu"
                className="inline-flex items-center justify-center gap-3 rounded-2xl bg-[#f45d52] px-7 py-4 font-black text-white shadow-lg shadow-[#f45d52]/20 transition-all hover:-translate-y-1 hover:bg-black"
              >
                Explore Crave
                <i className="fa-solid fa-arrow-right" />
              </Link>

              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-3 rounded-2xl border-2 border-gray-900 bg-white px-7 py-4 font-black text-gray-900 transition-all hover:-translate-y-1 hover:bg-gray-900 hover:text-white"
              >
                Customer Login
              </Link>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="rounded-[2.5rem] bg-gray-950 p-6 shadow-2xl shadow-gray-400/30 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.2em] text-[#f45d52]">
                    Crave principle
                  </p>

                  <h2 className="mt-3 text-3xl font-black text-white">
                    Nothing important should be hidden.
                  </h2>
                </div>

                <span className="hidden h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#f45d52] text-2xl text-white sm:flex">
                  <i className="fa-solid fa-eye" />
                </span>
              </div>

              <div className="mt-8 space-y-4">
                {platformPromises.map((promise) => (
                  <div
                    key={promise.label}
                    className="flex flex-col gap-2 rounded-2xl border border-gray-800 bg-white/5 p-5 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <p className="text-sm font-bold text-gray-400">
                      {promise.label}
                    </p>

                    <p className="font-black text-white">{promise.value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute -bottom-7 -left-3 rounded-2xl bg-white p-5 shadow-xl sm:-left-8">
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-100 text-green-700">
                  <i className="fa-solid fa-circle-check" />
                </span>

                <div>
                  <p className="text-xs font-black uppercase tracking-wider text-gray-400">
                    Customer trust
                  </p>

                  <p className="font-black text-gray-950">
                    Clear before checkout
                  </p>
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
              Our approach
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
              A platform designed around balance
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              Crave is not only an ordering interface. Its product rules are
              designed to balance the needs of every participant involved in
              delivering a meal.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {principles.map((principle) => (
              <article
                key={principle.title}
                className="group rounded-3xl border border-gray-100 bg-[#fafcfc] p-7 transition-all duration-300 hover:-translate-y-2 hover:border-[#f45d52]/20 hover:bg-white hover:shadow-xl sm:p-8"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0ed] text-xl text-[#f45d52] transition-colors group-hover:bg-[#f45d52] group-hover:text-white">
                  <i className={`fa-solid ${principle.icon}`} />
                </span>

                <h3 className="mt-6 text-2xl font-black text-gray-950">
                  {principle.title}
                </h3>

                <p className="mt-3 leading-7 text-gray-600">
                  {principle.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#f5f8f7] px-6 py-24 lg:px-8">
        <div className="mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-[0.88fr_1.12fr]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.25em] text-[#f45d52]">
              Customer experience
            </p>

            <h2 className="mt-4 text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
              Simple on the surface.
              <span className="block">Responsible underneath.</span>
            </h2>

            <p className="mt-5 text-lg leading-8 text-gray-600">
              The customer journey should remain straightforward while important
              business rules, security checks and audit records operate reliably
              behind it.
            </p>

            <Link
              to="/dashboard"
              className="mt-8 inline-flex items-center gap-3 font-black text-[#f45d52] transition-colors hover:text-black"
            >
              Open customer dashboard
              <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>

          <div className="rounded-[2rem] border border-gray-100 bg-white p-7 shadow-sm sm:p-9">
            <div className="grid gap-4 sm:grid-cols-2">
              {customerExperience.map((experienceItem) => (
                <div
                  key={experienceItem}
                  className="flex items-start gap-4 rounded-2xl border border-gray-100 bg-[#fafbfb] p-5"
                >
                  <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm text-green-700">
                    <i className="fa-solid fa-check" />
                  </span>

                  <p className="font-bold leading-6 text-gray-800">
                    {experienceItem}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-24 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-[#f45d52] to-[#ff8a68] px-7 py-14 text-white sm:px-12 lg:flex lg:items-center lg:justify-between lg:px-16">
            <div className="max-w-2xl">
              <p className="text-sm font-black uppercase tracking-[0.25em] text-white/70">
                Crave is being built
              </p>

              <h2 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl">
                A clearer way to order and deliver food.
              </h2>

              <p className="mt-5 text-lg leading-8 text-white/80">
                Customer authentication and saved delivery addresses are already
                taking shape. Restaurants, menus, checkout and orders come next.
              </p>
            </div>

            <Link
              to="/menu"
              className="mt-8 inline-flex shrink-0 items-center justify-center gap-3 rounded-2xl bg-white px-7 py-4 font-black text-gray-950 transition-all hover:-translate-y-1 hover:bg-gray-950 hover:text-white lg:mt-0"
            >
              View Progress
              <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
