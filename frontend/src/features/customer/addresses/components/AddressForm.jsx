import { useEffect, useState } from "react";

const EMPTY_FORM = {
  label: "Home",
  recipientName: "",
  addressLine1: "",
  addressLine2: "",
  landmark: "",
  deliveryInstructions: "",
};

function createInitialForm(initialAddress, defaultRecipientName) {
  if (initialAddress) {
    return {
      label: initialAddress.label || "Home",
      recipientName: initialAddress.recipientName || "",
      addressLine1: initialAddress.addressLine1 || "",
      addressLine2: initialAddress.addressLine2 || "",
      landmark: initialAddress.landmark || "",
      deliveryInstructions: initialAddress.deliveryInstructions || "",
    };
  }

  return {
    ...EMPTY_FORM,
    recipientName: defaultRecipientName || "",
  };
}

function validateForm(form, location) {
  const errors = {};

  if (!form.label.trim()) {
    errors.label = "Address label is required.";
  }

  if (!form.recipientName.trim()) {
    errors.recipientName = "Recipient name is required.";
  }

  if (!form.addressLine1.trim()) {
    errors.addressLine1 = "Primary address is required.";
  }

  if (
    !Number.isFinite(location?.latitude) ||
    !Number.isFinite(location?.longitude)
  ) {
    errors.location = "Select the delivery location on the map.";
  }

  return errors;
}

export default function AddressForm({
  mode = "create",
  initialAddress = null,
  defaultRecipientName = "",
  location,
  isSubmitting,
  submissionError,
  onSubmit,
}) {
  const [form, setForm] = useState(() =>
    createInitialForm(initialAddress, defaultRecipientName),
  );

  const [errors, setErrors] = useState({});

  useEffect(() => {
    setForm(createInitialForm(initialAddress, defaultRecipientName));

    setErrors({});
  }, [initialAddress, defaultRecipientName]);

  function updateField(field, value) {
    setForm((currentForm) => ({
      ...currentForm,
      [field]: value,
    }));

    setErrors((currentErrors) => {
      const nextErrors = {
        ...currentErrors,
      };

      delete nextErrors[field];

      return nextErrors;
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const validationErrors = validateForm(form, location);

    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    onSubmit({
      label: form.label.trim(),
      recipientName: form.recipientName.trim(),
      addressLine1: form.addressLine1.trim(),
      addressLine2: form.addressLine2.trim(),
      landmark: form.landmark.trim(),
      latitude: location.latitude,
      longitude: location.longitude,
      deliveryInstructions: form.deliveryInstructions.trim(),
    });
  }

  const isEditMode = mode === "edit";

  return (
    <form onSubmit={handleSubmit} className="space-y-7">
      <div>
        <p className="text-sm font-black uppercase tracking-[0.2em] text-[#f45d52]">
          Address details
        </p>

        <h2 className="mt-3 text-3xl font-black text-gray-950">
          {isEditMode ? "Update delivery details" : "Where should we deliver?"}
        </h2>

        <p className="mt-3 leading-7 text-gray-600">
          {isEditMode
            ? "Review the map pin and update the written address information."
            : "Add enough detail for the delivery partner to locate the entrance easily."}
        </p>
      </div>

      {submissionError && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-700">
          <i className="fa-solid fa-circle-exclamation mt-1" />

          <p className="text-sm font-semibold">{submissionError}</p>
        </div>
      )}

      {errors.location && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
          <i className="fa-solid fa-location-dot mt-1" />

          <p className="text-sm font-semibold">{errors.location}</p>
        </div>
      )}

      <fieldset>
        <legend className="text-sm font-black text-gray-900">
          Address label
        </legend>

        <div className="mt-3 flex flex-wrap gap-3">
          {["Home", "Work", "Other"].map((label) => (
            <button
              key={label}
              type="button"
              onClick={() => updateField("label", label)}
              className={[
                "rounded-xl border-2 px-5 py-3",
                "text-sm font-black transition-colors",
                form.label === label
                  ? "border-[#f45d52] bg-[#fff0ed] text-[#f45d52]"
                  : "border-gray-200 bg-white text-gray-600 hover:border-gray-400",
              ].join(" ")}
            >
              {label}
            </button>
          ))}
        </div>

        <input
          type="text"
          value={form.label}
          onChange={(event) => updateField("label", event.target.value)}
          maxLength={40}
          placeholder="Home, Office, Hostel..."
          className="mt-3 w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 font-semibold text-gray-900 outline-none transition focus:border-[#f45d52] focus:ring-4 focus:ring-[#f45d52]/10"
        />

        {errors.label && (
          <p className="mt-2 text-sm font-semibold text-red-600">
            {errors.label}
          </p>
        )}
      </fieldset>

      <div>
        <label
          htmlFor="recipientName"
          className="text-sm font-black text-gray-900"
        >
          Recipient name
        </label>

        <input
          id="recipientName"
          type="text"
          value={form.recipientName}
          onChange={(event) => updateField("recipientName", event.target.value)}
          maxLength={120}
          autoComplete="name"
          placeholder="Name of the person receiving the order"
          className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 font-semibold text-gray-900 outline-none transition focus:border-[#f45d52] focus:ring-4 focus:ring-[#f45d52]/10"
        />

        {errors.recipientName && (
          <p className="mt-2 text-sm font-semibold text-red-600">
            {errors.recipientName}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="addressLine1"
          className="text-sm font-black text-gray-900"
        >
          House, flat, floor or building
        </label>

        <input
          id="addressLine1"
          type="text"
          value={form.addressLine1}
          onChange={(event) => updateField("addressLine1", event.target.value)}
          maxLength={255}
          autoComplete="address-line1"
          placeholder="House 21, Second Floor"
          className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 font-semibold text-gray-900 outline-none transition focus:border-[#f45d52] focus:ring-4 focus:ring-[#f45d52]/10"
        />

        {errors.addressLine1 && (
          <p className="mt-2 text-sm font-semibold text-red-600">
            {errors.addressLine1}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="addressLine2"
          className="text-sm font-black text-gray-900"
        >
          Street, locality or area
          <span className="ml-2 font-semibold text-gray-400">Optional</span>
        </label>

        <input
          id="addressLine2"
          type="text"
          value={form.addressLine2}
          onChange={(event) => updateField("addressLine2", event.target.value)}
          maxLength={255}
          autoComplete="address-line2"
          placeholder="Sector 10, Main Market Road"
          className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 font-semibold text-gray-900 outline-none transition focus:border-[#f45d52] focus:ring-4 focus:ring-[#f45d52]/10"
        />
      </div>

      <div>
        <label htmlFor="landmark" className="text-sm font-black text-gray-900">
          Nearby landmark
          <span className="ml-2 font-semibold text-gray-400">Optional</span>
        </label>

        <input
          id="landmark"
          type="text"
          value={form.landmark}
          onChange={(event) => updateField("landmark", event.target.value)}
          maxLength={160}
          placeholder="Near community centre"
          className="mt-2 w-full rounded-xl border border-gray-200 bg-white px-4 py-3.5 font-semibold text-gray-900 outline-none transition focus:border-[#f45d52] focus:ring-4 focus:ring-[#f45d52]/10"
        />
      </div>

      <div>
        <label
          htmlFor="deliveryInstructions"
          className="text-sm font-black text-gray-900"
        >
          Delivery instructions
          <span className="ml-2 font-semibold text-gray-400">Optional</span>
        </label>

        <textarea
          id="deliveryInstructions"
          value={form.deliveryInstructions}
          onChange={(event) =>
            updateField("deliveryInstructions", event.target.value)
          }
          maxLength={500}
          rows={4}
          placeholder="Call at the gate, use the side entrance..."
          className="mt-2 w-full resize-none rounded-xl border border-gray-200 bg-white px-4 py-3.5 font-semibold text-gray-900 outline-none transition focus:border-[#f45d52] focus:ring-4 focus:ring-[#f45d52]/10"
        />

        <p className="mt-2 text-right text-xs font-semibold text-gray-400">
          {form.deliveryInstructions.length}/500
        </p>
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#f45d52] px-6 py-4 font-black text-white shadow-lg shadow-[#f45d52]/20 transition-all hover:-translate-y-1 hover:bg-black disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />

            {isEditMode ? "Updating Address..." : "Saving Address..."}
          </>
        ) : (
          <>
            {isEditMode ? "Update Address" : "Save Address"}

            <i className="fa-solid fa-arrow-right" />
          </>
        )}
      </button>
    </form>
  );
}
