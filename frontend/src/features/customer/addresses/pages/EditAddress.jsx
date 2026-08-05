import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import {
  getCustomerAddress,
  updateCustomerAddress,
} from "../api/customerAddresses.js";

import AddressForm from "../components/AddressForm.jsx";
import LocationPicker from "../components/LocationPicker.jsx";

function normalizeLocation(address) {
  const latitude = Number(address?.latitude);
  const longitude = Number(address?.longitude);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
    return null;
  }

  return {
    latitude,
    longitude,
  };
}

export default function EditAddress() {
  const { addressId } = useParams();
  const navigate = useNavigate();

  const [address, setAddress] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);

  const [status, setStatus] = useState("loading");

  const [loadError, setLoadError] = useState("");

  const [submissionError, setSubmissionError] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isActive = true;

    async function loadAddress() {
      setStatus("loading");
      setLoadError("");

      try {
        const savedAddress = await getCustomerAddress(addressId);

        if (!isActive) {
          return;
        }

        setAddress(savedAddress);
        setSelectedLocation(normalizeLocation(savedAddress));

        setStatus("success");
      } catch (error) {
        if (!isActive) {
          return;
        }

        setLoadError(error?.message || "The address could not be loaded.");

        setStatus("error");
      }
    }

    void loadAddress();

    return () => {
      isActive = false;
    };
  }, [addressId]);

  async function handleUpdateAddress(updatedAddress) {
    setIsSubmitting(true);
    setSubmissionError("");

    try {
      await updateCustomerAddress(addressId, updatedAddress);

      navigate("/dashboard/addresses", {
        replace: true,
      });
    } catch (error) {
      setSubmissionError(error?.message || "The address could not be updated.");
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
              Update delivery location
            </p>

            <h1 className="mt-3 text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
              Edit saved address
            </h1>

            <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600">
              Move the pin or update the written details connected to this
              delivery location.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        {status === "loading" && (
          <div className="rounded-[2rem] border border-gray-100 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-gray-200 border-t-[#f45d52]" />

            <p className="mt-5 font-bold text-gray-600">Loading address...</p>
          </div>
        )}

        {status === "error" && (
          <div className="rounded-[2rem] border border-red-100 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-3xl text-red-600">
              <i className="fa-solid fa-triangle-exclamation" />
            </div>

            <h2 className="mt-6 text-3xl font-black text-gray-950">
              Address could not be loaded
            </h2>

            <p className="mx-auto mt-3 max-w-xl leading-7 text-gray-600">
              {loadError}
            </p>

            <Link
              to="/dashboard/addresses"
              className="mt-7 inline-flex items-center justify-center gap-3 rounded-xl bg-[#f45d52] px-6 py-3 font-black text-white transition-colors hover:bg-black"
            >
              Back to Addresses
            </Link>
          </div>
        )}

        {status === "success" && address && (
          <div className="grid items-start gap-7 xl:grid-cols-[1.15fr_0.85fr]">
            <article className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm sm:p-8">
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

            <aside className="rounded-[2rem] border border-gray-100 bg-white p-6 shadow-sm sm:p-8 xl:sticky xl:top-28">
              <AddressForm
                mode="edit"
                initialAddress={address}
                location={selectedLocation}
                isSubmitting={isSubmitting}
                submissionError={submissionError}
                onSubmit={(updatedAddress) =>
                  void handleUpdateAddress(updatedAddress)
                }
              />
            </aside>
          </div>
        )}
      </section>
    </main>
  );
}
