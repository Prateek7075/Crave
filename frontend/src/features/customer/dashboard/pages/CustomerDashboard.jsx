import {
  useContext,
  useEffect,
  useState,
} from 'react';
import { Link } from 'react-router-dom';

import { AuthContext } from '../../../auth/context/AuthContext.jsx';
import { getCustomerAddresses } from '../../addresses/api/customerAddresses.js';

export default function CustomerDashboard() {
  const { user } = useContext(AuthContext);

  const [addressCount, setAddressCount] =
    useState(null);

  const [addressStatus, setAddressStatus] =
    useState('loading');

  const customerName =
    user?.customerProfile?.fullName
    || user?.username
    || 'Customer';

  const mobile =
    user?.mobile
    || user?.account?.mobile
    || 'Not available';

  useEffect(() => {
    let isActive = true;

    async function loadAddressCount() {
      setAddressStatus('loading');

      try {
        const addresses =
          await getCustomerAddresses();

        if (!isActive) {
          return;
        }

        setAddressCount(
          Array.isArray(addresses)
            ? addresses.length
            : 0,
        );

        setAddressStatus('success');
      } catch {
        if (!isActive) {
          return;
        }

        setAddressCount(null);
        setAddressStatus('error');
      }
    }

    void loadAddressCount();

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#f5f8f7]">
      <section className="border-b border-gray-200 bg-[#fff8f6]">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8 lg:py-18">
          <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#f45d52]/20 bg-white px-4 py-2 text-sm font-bold text-[#f45d52] shadow-sm">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Customer account active
              </div>

              <h1 className="mt-6 text-4xl font-black tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">
                Welcome back,
                <span className="block text-[#f45d52]">
                  {customerName}
                </span>
              </h1>

              <p className="mt-5 max-w-2xl text-lg leading-8 text-gray-600">
                Manage your delivery addresses,
                explore restaurants and keep track
                of your Crave account from one place.
              </p>
            </div>

            <Link
              to="/menu"
              className="inline-flex w-fit items-center justify-center gap-3 rounded-2xl bg-[#f45d52] px-7 py-4 font-black text-white shadow-lg shadow-[#f45d52]/20 transition-all hover:-translate-y-1 hover:bg-black"
            >
              Explore Menu
              <i className="fa-solid fa-arrow-right" />
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[0.72fr_1.28fr]">
          <aside className="space-y-6">
            <article className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
              <div className="bg-gray-950 px-7 py-8 text-white">
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#f45d52] text-2xl">
                    <i className="fa-solid fa-user" />
                  </div>

                  <div className="min-w-0">
                    <p className="text-xs font-black uppercase tracking-[0.2em] text-gray-400">
                      Your profile
                    </p>

                    <h2 className="mt-2 truncate text-2xl font-black">
                      {customerName}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="space-y-5 p-7">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">
                    Verified mobile
                  </p>

                  <div className="mt-2 flex items-center gap-3">
                    <p className="font-bold text-gray-900">
                      {mobile}
                    </p>

                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700">
                      Verified
                    </span>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-5">
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">
                    Account role
                  </p>

                  <p className="mt-2 font-bold text-gray-900">
                    Customer
                  </p>
                </div>
              </div>
            </article>

            <article className="rounded-3xl border border-gray-100 bg-white p-7 shadow-sm">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-[#f45d52]">
                    Delivery details
                  </p>

                  <h2 className="mt-3 text-2xl font-black text-gray-950">
                    Saved Addresses
                  </h2>
                </div>

                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#fff0ed] text-[#f45d52]">
                  <i className="fa-solid fa-location-dot" />
                </span>
              </div>

              <div className="mt-7">
                {addressStatus === 'loading' && (
                  <div className="h-9 w-32 animate-pulse rounded-lg bg-gray-200" />
                )}

                {addressStatus === 'success' && (
                  <p className="text-4xl font-black text-gray-950">
                    {addressCount}
                  </p>
                )}

                {addressStatus === 'error' && (
                  <p className="font-bold text-gray-500">
                    Count unavailable
                  </p>
                )}

                <p className="mt-2 text-sm leading-6 text-gray-500">
                  Saved delivery locations connected
                  to your account.
                </p>
              </div>

              <Link
                to="/dashboard/addresses"
                className="mt-7 inline-flex w-full items-center justify-center gap-3 rounded-xl border-2 border-gray-900 px-5 py-3 font-black text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
              >
                Manage Addresses
                <i className="fa-solid fa-arrow-right" />
              </Link>
            </article>
          </aside>

          <div className="space-y-6">
            <section>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-[#f45d52]">
                    Quick actions
                  </p>

                  <h2 className="mt-3 text-3xl font-black text-gray-950">
                    What would you like to do?
                  </h2>
                </div>
              </div>

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <Link
                  to="/menu"
                  className="group rounded-3xl border border-gray-100 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-[#f45d52]/20 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0ed] text-xl text-[#f45d52] transition-colors group-hover:bg-[#f45d52] group-hover:text-white">
                      <i className="fa-solid fa-utensils" />
                    </span>

                    <i className="fa-solid fa-arrow-up-right-from-square text-gray-300 transition-colors group-hover:text-[#f45d52]" />
                  </div>

                  <h3 className="mt-6 text-2xl font-black text-gray-950">
                    Explore Menu
                  </h3>

                  <p className="mt-3 leading-7 text-gray-600">
                    Discover restaurants and menu
                    items as the catalogue becomes
                    available.
                  </p>
                </Link>

                <Link
                  to="/dashboard/addresses"
                  className="group rounded-3xl border border-gray-100 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-[#f45d52]/20 hover:shadow-xl"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0ed] text-xl text-[#f45d52] transition-colors group-hover:bg-[#f45d52] group-hover:text-white">
                      <i className="fa-solid fa-map-location-dot" />
                    </span>

                    <i className="fa-solid fa-arrow-up-right-from-square text-gray-300 transition-colors group-hover:text-[#f45d52]" />
                  </div>

                  <h3 className="mt-6 text-2xl font-black text-gray-950">
                    Delivery Addresses
                  </h3>

                  <p className="mt-3 leading-7 text-gray-600">
                    View and manage the locations
                    available during checkout.
                  </p>
                </Link>

                <Link
                  to="/cart"
                  className="group rounded-3xl border border-gray-100 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-[#f45d52]/20 hover:shadow-xl sm:col-span-2"
                >
                  <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-5">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#fff0ed] text-xl text-[#f45d52] transition-colors group-hover:bg-[#f45d52] group-hover:text-white">
                        <i className="fa-solid fa-cart-shopping" />
                      </span>

                      <div>
                        <h3 className="text-2xl font-black text-gray-950">
                          View Cart
                        </h3>

                        <p className="mt-2 leading-7 text-gray-600">
                          Cart and checkout will activate
                          after restaurant menus and order
                          pricing are implemented.
                        </p>
                      </div>
                    </div>

                    <span className="inline-flex shrink-0 items-center gap-2 font-black text-[#f45d52]">
                      Open Cart
                      <i className="fa-solid fa-arrow-right" />
                    </span>
                  </div>
                </Link>
              </div>
            </section>

            <section className="rounded-[2rem] border border-gray-100 bg-white p-7 shadow-sm sm:p-9">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="text-sm font-black uppercase tracking-[0.22em] text-[#f45d52]">
                    Your orders
                  </p>

                  <h2 className="mt-3 text-3xl font-black text-gray-950">
                    Order history
                  </h2>
                </div>

                <span className="rounded-full bg-gray-100 px-4 py-2 text-xs font-black uppercase tracking-wider text-gray-500">
                  Coming later
                </span>
              </div>

              <div className="mt-9 rounded-3xl border border-dashed border-gray-200 bg-[#fafbfb] px-6 py-12 text-center">
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fff0ed] text-3xl text-[#f45d52]">
                  <i className="fa-solid fa-receipt" />
                </div>

                <h3 className="mt-6 text-2xl font-black text-gray-950">
                  No orders to show yet
                </h3>

                <p className="mx-auto mt-3 max-w-xl leading-7 text-gray-600">
                  Your real order history will appear
                  here after restaurant catalogues,
                  checkout, payments and order services
                  are implemented.
                </p>

                <Link
                  to="/menu"
                  className="mt-7 inline-flex items-center gap-3 font-black text-[#f45d52] transition-colors hover:text-black"
                >
                  View menu status
                  <i className="fa-solid fa-arrow-right" />
                </Link>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  );
}