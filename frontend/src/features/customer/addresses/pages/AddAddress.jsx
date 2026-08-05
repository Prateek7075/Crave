import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { AuthContext } from "../../../auth/context/AuthContext.jsx";
import { createCustomerAddress } from "../api/customerAddresses.js";

import AddressForm from "../components/AddressForm.jsx";
import LocationPicker from "../components/LocationPicker.jsx";

export default function AddAddress() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [selectedLocation, setSelectedLocation] = useState(null);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submissionError, setSubmissionError] = useState("");

  const customerName = user?.customerProfile?.fullName || user?.username || "";

  async function handleCreateAddress(address) {
    setIsSubmitting(true);
    setSubmissionError("");

    try {
      await createCustomerAddress(address);

      navigate("/dashboard/addresses", {
        replace: true,
      });
    } catch (error) {
      setSubmissionError(error?.message || "The address could not be saved.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f8f7]">
      <section className="border-b border-gray-200 bg-[#fff8f6]">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <Link
            to="/dashboard/addresses"
            className="inline-flex items-center gap-3 font-black text-gray-600 transition-colors hover:text-[#f45d52]"
          >
            <i className="fa-solid fa-arrow-left" />
            Saved Addresses
          </Link>

          <div className="mt-8">
            <p className="text-sm font-black uppercase tracking-[0.22em] text-[#f45d52]">
              New delivery location
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
              Add a saved address
            </h1>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600">
              Pin the exact location and add the written details needed for a
              smooth delivery.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid items-start gap-7 xl:grid-cols-[1.15fr_0.85fr]">
          <article className="rounded-4xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
            <LocationPicker
              value={selectedLocation}
              onChange={(coordinates) => {
                setSelectedLocation(coordinates);
                setSubmissionError("");
              }}
            />

            {selectedLocation && (
              <div className="mt-6 grid gap-4 rounded-2xl bg-[#f7f9f8] p-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">
                    Latitude
                  </p>

                  <p className="mt-2 font-bold text-gray-900">
                    {selectedLocation.latitude}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">
                    Longitude
                  </p>

                  <p className="mt-2 font-bold text-gray-900">
                    {selectedLocation.longitude}
                  </p>
                </div>
              </div>
            )}
          </article>

          <aside className="rounded-4xl border border-gray-100 bg-white p-6 shadow-sm sm:p-8 xl:sticky xl:top-28">
            <AddressForm
              defaultRecipientName={customerName}
              location={selectedLocation}
              isSubmitting={isSubmitting}
              submissionError={submissionError}
              onSubmit={(address) => void handleCreateAddress(address)}
            />
          </aside>
        </div>
      </section>
    </main>
  );
}
