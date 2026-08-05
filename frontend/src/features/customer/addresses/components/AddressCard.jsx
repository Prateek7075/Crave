import { Link } from "react-router-dom";

function formatAddress(address) {
  return [
    address.addressLine1,
    address.addressLine2,
    address.landmark ? `Near ${address.landmark}` : null,
  ].filter(Boolean);
}

export default function AddressCard({ address, isDeleting, onDelete }) {
  const addressLines = formatAddress(address);

  return (
    <article className="group overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-[#f45d52]/20 hover:shadow-xl">
      <div className="flex items-start justify-between gap-5 border-b border-gray-100 bg-[#fffaf8] p-6">
        <div className="flex min-w-0 items-center gap-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#fff0ed] text-xl text-[#f45d52]">
            <i className="fa-solid fa-location-dot" />
          </span>

          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">
              Saved location
            </p>

            <h2 className="mt-1 truncate text-2xl font-black text-gray-950">
              {address.label}
            </h2>
          </div>
        </div>

        <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-black text-green-700">
          Active
        </span>
      </div>

      <div className="p-6">
        <p className="text-lg font-black text-gray-950">
          {address.recipientName}
        </p>

        <div className="mt-4 space-y-1 leading-7 text-gray-600">
          {addressLines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>

        {address.deliveryInstructions && (
          <div className="mt-5 rounded-2xl bg-[#f7f9f8] p-4">
            <p className="text-xs font-black uppercase tracking-[0.16em] text-gray-400">
              Delivery instructions
            </p>

            <p className="mt-2 text-sm leading-6 text-gray-600">
              {address.deliveryInstructions}
            </p>
          </div>
        )}

        <div className="mt-6 flex items-center gap-3 text-sm text-gray-500">
          <i className="fa-solid fa-map-pin text-[#f45d52]" />

          <span>
            {address.latitude}, {address.longitude}
          </span>
        </div>

        <div className="mt-7 flex flex-col gap-3 border-t border-gray-100 pt-5 sm:flex-row">
          <Link
            to={`/dashboard/addresses/${address.id}/edit`}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border-2 border-gray-900 px-4 py-3 font-black text-gray-900 transition-colors hover:bg-gray-900 hover:text-white"
          >
            <i className="fa-solid fa-pen" />
            Edit
          </Link>

          <button
            type="button"
            onClick={() => onDelete(address)}
            disabled={isDeleting}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 font-black text-red-600 transition-colors hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            <i className="fa-solid fa-trash" />

            {isDeleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
}
