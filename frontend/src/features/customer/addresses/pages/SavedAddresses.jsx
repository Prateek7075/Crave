import { useCallback, useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  deleteCustomerAddress,
  getCustomerAddresses,
} from "../api/customerAddresses.js";

import AddressCard from "../components/AddressCard.jsx";
import ConfirmDialog from "../../../../components/feedback/ConfirmDialog.jsx";
import Toast from "../../../../components/feedback/Toast.jsx";

export default function SavedAddresses() {

  const location = useLocation();
  const navigate = useNavigate();

  const [successMessage, setSuccessMessage] = useState(
    location.state?.successMessage || "",
  );

  const [addresses, setAddresses] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const [deletingAddressId, setDeletingAddressId] = useState(null);

  const [actionError, setActionError] = useState("");

  const [addressPendingDeletion, setAddressPendingDeletion] = useState(null);

  const loadAddresses = useCallback(async () => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const savedAddresses = await getCustomerAddresses();

      setAddresses(Array.isArray(savedAddresses) ? savedAddresses : []);

      setStatus("success");
    } catch (error) {
      setErrorMessage(error?.message || "Saved addresses could not be loaded.");

      setStatus("error");
    }
  }, []);

  useEffect(() => {
    void loadAddresses();
  }, [loadAddresses]);

  useEffect(() => {
    if (!location.state?.successMessage) {
      return;
    }

    setSuccessMessage(location.state.successMessage);

    navigate(location.pathname, {
      replace: true,
      state: null,
    });
  }, [location.pathname, location.state, navigate]);

  async function handleDeleteConfirmed() {
    if (!addressPendingDeletion) {
      return;
    }

    const addressId = addressPendingDeletion.id;

    setDeletingAddressId(addressId);
    setActionError("");

    try {
      await deleteCustomerAddress(addressId);

      setAddresses((currentAddresses) =>
        currentAddresses.filter(
          (currentAddress) => currentAddress.id !== addressId,
        ),
      );
      setSuccessMessage("The saved address was deleted successfully.");

      setAddressPendingDeletion(null);
    } catch (error) {
      setActionError(error?.message || "The address could not be deleted.");
    } finally {
      setDeletingAddressId(null);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f8f7]">
      <section className="border-b border-gray-200 bg-[#fff8f6]">
        <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
          <div className="flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-[#f45d52]/20 bg-white px-4 py-2 text-sm font-bold text-[#f45d52] shadow-sm">
                <i className="fa-solid fa-map-location-dot" />
                Delivery locations
              </div>

              <h1 className="mt-6 text-4xl font-black tracking-tight text-gray-950 sm:text-5xl">
                Saved Addresses
              </h1>

              <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-600">
                Manage the locations connected to your Crave customer account.
              </p>
            </div>

            <Link
              to="/dashboard/addresses/new"
              className="inline-flex w-fit items-center justify-center gap-3 rounded-2xl bg-[#f45d52] px-6 py-4 font-black text-white shadow-lg shadow-[#f45d52]/20 transition-all hover:-translate-y-1 hover:bg-black"
            >
              <i className="fa-solid fa-plus" />
              Add Address
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Link
            to="/dashboard"
            className="inline-flex w-fit items-center gap-3 font-black text-gray-600 transition-colors hover:text-[#f45d52]"
          >
            <i className="fa-solid fa-arrow-left" />
            Back to Dashboard
          </Link>

          {status === "success" && (
            <p className="text-sm font-bold text-gray-500">
              {addresses.length}{" "}
              {addresses.length === 1 ? "saved address" : "saved addresses"}
            </p>
          )}
        </div>

        {actionError && (
          <div className="mb-7 flex items-start gap-4 rounded-2xl border border-red-100 bg-red-50 p-5 text-red-700">
            <i className="fa-solid fa-circle-exclamation mt-1" />

            <div>
              <p className="font-black">Address action failed</p>

              <p className="mt-1 text-sm">{actionError}</p>
            </div>
          </div>
        )}

        {status === "loading" && (
          <section className="rounded-3xl border border-gray-100 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto h-11 w-11 animate-spin rounded-full border-4 border-gray-200 border-t-[#f45d52]" />

            <p className="mt-5 font-bold text-gray-600">
              Loading your addresses...
            </p>
          </section>
        )}

        {status === "error" && (
          <section className="rounded-3xl border border-red-100 bg-white px-6 py-16 text-center shadow-sm">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-50 text-3xl text-red-600">
              <i className="fa-solid fa-triangle-exclamation" />
            </div>

            <h2 className="mt-6 text-3xl font-black text-gray-950">
              Addresses could not be loaded
            </h2>

            <p className="mx-auto mt-3 max-w-xl leading-7 text-gray-600">
              {errorMessage}
            </p>

            <button
              type="button"
              onClick={() => void loadAddresses()}
              className="mt-7 rounded-xl bg-[#f45d52] px-6 py-3 font-black text-white transition-colors hover:bg-black"
            >
              Try Again
            </button>
          </section>
        )}

        {status === "success" && addresses.length === 0 && (
          <section className="rounded-4xl border border-gray-100 bg-white px-6 py-20 text-center shadow-sm">
            <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-[#fff0ed] text-4xl text-[#f45d52]">
              <i className="fa-solid fa-location-dot" />
            </div>

            <h2 className="mt-7 text-3xl font-black text-gray-950">
              No saved addresses yet
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-600">
              Your first delivery address will appear here after the map-based
              address form is connected.
            </p>
          </section>
        )}

        {status === "success" && addresses.length > 0 && (
          <section className="grid gap-6 md:grid-cols-2">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                isDeleting={deletingAddressId === address.id}
                onDelete={(selectedAddress) => {
                  setActionError("");

                  setAddressPendingDeletion(selectedAddress);
                }}
              />
            ))}
          </section>
        )}
      </section>

      <ConfirmDialog
        isOpen={addressPendingDeletion !== null}
        title="Delete saved address?"
        description={
          addressPendingDeletion
            ? `Your "${addressPendingDeletion.label}" address will be permanently removed from your Crave account.`
            : ""
        }
        confirmLabel="Delete Address"
        isConfirming={deletingAddressId !== null}
        onCancel={() => {
          if (deletingAddressId === null) {
            setAddressPendingDeletion(null);
          }
        }}
        onConfirm={() => void handleDeleteConfirmed()}
      />
      <Toast message={successMessage} onClose={() => setSuccessMessage("")} />
    </main>
  );
}
