import { useEffect, useRef } from "react";

export default function ConfirmDialog({
  isOpen,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  isConfirming = false,
  onConfirm,
  onCancel,
}) {
  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    window.setTimeout(() => {
      cancelButtonRef.current?.focus();
    }, 0);

    function handleKeyDown(event) {
      if (event.key === "Escape" && !isConfirming) {
        onCancel();
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;

      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, isConfirming, onCancel]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-gray-950/60 px-5 py-10 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isConfirming) {
          onCancel();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        aria-describedby="confirm-dialog-description"
        className="w-full max-w-md overflow-hidden rounded-[2rem] border border-white/20 bg-white shadow-2xl"
      >
        <div className="bg-gray-950 px-7 py-7 text-white">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-500 text-xl">
            <i className="fa-solid fa-trash" />
          </span>

          <h2 id="confirm-dialog-title" className="mt-6 text-3xl font-black">
            {title}
          </h2>
        </div>

        <div className="p-7">
          <p
            id="confirm-dialog-description"
            className="leading-7 text-gray-600"
          >
            {description}
          </p>

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              ref={cancelButtonRef}
              type="button"
              onClick={onCancel}
              disabled={isConfirming}
              className="rounded-xl border-2 border-gray-200 px-6 py-3 font-black text-gray-700 transition-colors hover:border-gray-900 hover:bg-gray-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {cancelLabel}
            </button>

            <button
              type="button"
              onClick={onConfirm}
              disabled={isConfirming}
              className="flex items-center justify-center gap-3 rounded-xl bg-red-600 px-6 py-3 font-black text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isConfirming ? (
                <>
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  Deleting...
                </>
              ) : (
                <>
                  <i className="fa-solid fa-trash" />
                  {confirmLabel}
                </>
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
