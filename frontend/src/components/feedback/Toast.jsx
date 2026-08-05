import { useEffect } from "react";

export default function Toast({
  message,
  type = "success",
  duration = 4000,
  onClose,
}) {
  useEffect(() => {
    if (!message) {
      return undefined;
    }

    const timer = window.setTimeout(onClose, duration);

    return () => {
      window.clearTimeout(timer);
    };
  }, [message, duration, onClose]);

  if (!message) {
    return null;
  }

  const isSuccess = type === "success";

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 left-1/2 z-[110] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 sm:bottom-8 sm:left-auto sm:right-8 sm:w-full sm:translate-x-0"
    >
      <div
        className={[
          "flex items-start gap-4 rounded-2xl border p-5 shadow-2xl",
          isSuccess
            ? "border-green-200 bg-white text-green-800"
            : "border-red-200 bg-white text-red-700",
        ].join(" ")}
      >
        <span
          className={[
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
            isSuccess
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700",
          ].join(" ")}
        >
          <i
            className={
              isSuccess
                ? "fa-solid fa-circle-check"
                : "fa-solid fa-circle-exclamation"
            }
          />
        </span>

        <div className="min-w-0 flex-1">
          <p className="font-black text-gray-950">
            {isSuccess ? "Success" : "Something went wrong"}
          </p>

          <p className="mt-1 text-sm leading-6">{message}</p>
        </div>

        <button
          type="button"
          onClick={onClose}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-900"
          aria-label="Close notification"
        >
          <i className="fa-solid fa-xmark" />
        </button>
      </div>
    </div>
  );
}
