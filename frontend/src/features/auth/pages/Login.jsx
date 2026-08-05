import { useContext, useEffect, useState } from "react";

import { Link, useLocation, useNavigate } from "react-router-dom";

import {
  requestCustomerCode,
  verifyCustomerCode,
} from "../api/customerAuth.js";

import { AuthContext } from "../context/AuthContext.jsx";

const STEP = {
  MOBILE: "MOBILE",
  NAME: "NAME",
  OTP: "OTP",
};

const STEP_CONTENT = {
  [STEP.MOBILE]: {
    eyebrow: "Customer access",
    title: "Continue with your mobile",
    description:
      "Login or create your Crave customer account using secure mobile verification.",
    icon: "fa-phone",
  },

  [STEP.NAME]: {
    eyebrow: "Create your account",
    title: "What should we call you?",
    description:
      "This mobile number is new. Enter your full name to create a customer profile.",
    icon: "fa-user",
  },

  [STEP.OTP]: {
    eyebrow: "Mobile verification",
    title: "Enter your verification code",
    description:
      "Use the four-digit code sent to your registered mobile number.",
    icon: "fa-shield-halved",
  },
};

function resolveReturnPath(locationState) {
  const from = locationState?.from;

  if (
    typeof from !== "string" ||
    !from.startsWith("/") ||
    from.startsWith("//") ||
    from === "/login"
  ) {
    return "/dashboard";
  }

  return from;
}

function formatSeconds(totalSeconds) {
  const safeSeconds = Math.max(0, Number(totalSeconds) || 0);

  const minutes = Math.floor(safeSeconds / 60);

  const seconds = safeSeconds % 60;

  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const returnPath = resolveReturnPath(location.state);

  const { login } = useContext(AuthContext);

  const [step, setStep] = useState(STEP.MOBILE);

  const [mobile, setMobile] = useState("");
  const [fullName, setFullName] = useState("");
  const [code, setCode] = useState("");

  const [challengeId, setChallengeId] = useState(null);

  const [developmentCode, setDevelopmentCode] = useState(null);

  const [resendSeconds, setResendSeconds] = useState(0);

  const [expiresInSeconds, setExpiresInSeconds] = useState(0);

  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentContent = STEP_CONTENT[step];

  useEffect(() => {
    if (step !== STEP.OTP || (resendSeconds <= 0 && expiresInSeconds <= 0)) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      setResendSeconds((currentValue) => Math.max(0, currentValue - 1));

      setExpiresInSeconds((currentValue) => Math.max(0, currentValue - 1));
    }, 1000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [step, resendSeconds, expiresInSeconds]);

  function clearErrors() {
    setError("");
    setFieldErrors({});
  }

  function clearFieldError(fieldName) {
    setFieldErrors((currentErrors) => {
      if (!currentErrors[fieldName]) {
        return currentErrors;
      }

      return {
        ...currentErrors,
        [fieldName]: null,
      };
    });
  }

  function showApiError(apiError) {
    if (apiError.code === "VALIDATION_ERROR") {
      setFieldErrors({
        mobile: apiError.getFirstFieldMessage?.("mobile") ?? null,

        fullName: apiError.getFirstFieldMessage?.("fullName") ?? null,

        code: apiError.getFirstFieldMessage?.("code") ?? null,

        challengeId: apiError.getFirstFieldMessage?.("challengeId") ?? null,
      });

      setError(apiError.message);

      return;
    }

    if (apiError.code === "OTP_CODE_INVALID") {
      const remainingAttempts = apiError.details?.remainingAttempts;

      setFieldErrors({
        code:
          typeof remainingAttempts === "number"
            ? `Incorrect code. ${remainingAttempts} attempts remaining.`
            : "The verification code is incorrect.",
      });

      return;
    }

    if (apiError.code === "OTP_COOLDOWN") {
      const retryAfterSeconds = apiError.details?.retryAfterSeconds;

      if (typeof retryAfterSeconds === "number") {
        setResendSeconds(retryAfterSeconds);
      }

      setError(apiError.message);

      return;
    }

    if (
      apiError.code === "OTP_CHALLENGE_EXPIRED" ||
      apiError.code === "OTP_ATTEMPTS_EXCEEDED"
    ) {
      setChallengeId(null);
      setCode("");
      setDevelopmentCode(null);
      setExpiresInSeconds(0);
      setResendSeconds(0);
      setStep(STEP.MOBILE);

      setError(
        apiError.code === "OTP_ATTEMPTS_EXCEEDED"
          ? "Too many incorrect attempts. Request a new code."
          : "Your verification code expired. Request a new code.",
      );

      return;
    }

    setError(apiError.message ?? "The request could not be completed.");
  }

  function openOtpStep(responseData) {
    setChallengeId(responseData.challengeId);

    setCode("");

    setDevelopmentCode(responseData.developmentCode ?? null);

    setResendSeconds(responseData.resendAfterSeconds ?? 30);

    setExpiresInSeconds(responseData.expiresInSeconds ?? 300);

    setStep(STEP.OTP);
  }

  async function handleMobileSubmit(event) {
    event.preventDefault();

    clearErrors();
    setIsSubmitting(true);

    try {
      const responseData = await requestCustomerCode({
        mobile: mobile.trim(),
      });

      if (responseData.nextStep === "ENTER_REGISTRATION_DETAILS") {
        setStep(STEP.NAME);

        return;
      }

      if (responseData.nextStep === "VERIFY_CODE") {
        openOtpStep(responseData);

        return;
      }

      throw new Error("The server returned an unknown authentication step.");
    } catch (apiError) {
      showApiError(apiError);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleNameSubmit(event) {
    event.preventDefault();

    clearErrors();
    setIsSubmitting(true);

    try {
      const responseData = await requestCustomerCode({
        mobile: mobile.trim(),
        fullName: fullName.trim(),
      });

      if (responseData.nextStep !== "VERIFY_CODE") {
        throw new Error("The server did not create a verification challenge.");
      }

      openOtpStep(responseData);
    } catch (apiError) {
      showApiError(apiError);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleOtpSubmit(event) {
    event.preventDefault();

    clearErrors();

    if (expiresInSeconds <= 0) {
      setError("This code has expired. Request a new code.");

      return;
    }

    setIsSubmitting(true);

    try {
      const responseData = await verifyCustomerCode({
        challengeId,
        code: code.trim(),
      });

      login(responseData);

      navigate(returnPath, {
        replace: true,
      });
    } catch (apiError) {
      showApiError(apiError);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResendCode() {
    if (resendSeconds > 0 || isSubmitting) {
      return;
    }

    clearErrors();
    setIsSubmitting(true);

    try {
      const responseData = await requestCustomerCode({
        mobile: mobile.trim(),

        fullName: fullName.trim() !== "" ? fullName.trim() : undefined,
      });

      if (responseData.nextStep !== "VERIFY_CODE") {
        setStep(STEP.NAME);

        return;
      }

      openOtpStep(responseData);
    } catch (apiError) {
      showApiError(apiError);
    } finally {
      setIsSubmitting(false);
    }
  }

  function returnToMobileStep() {
    clearErrors();

    setStep(STEP.MOBILE);
    setCode("");
    setChallengeId(null);
    setDevelopmentCode(null);
    setResendSeconds(0);
    setExpiresInSeconds(0);
  }

  function renderFieldError(fieldName) {
    const message = fieldErrors[fieldName];

    if (!message) {
      return null;
    }

    return (
      <p className="mt-2 flex items-start gap-2 text-sm font-semibold text-red-600">
        <i className="fa-solid fa-circle-exclamation mt-1 text-xs" />
        <span>{message}</span>
      </p>
    );
  }

  return (
    <main className="relative overflow-hidden bg-[#fff8f6]">
      <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-[#f45d52]/10 blur-3xl" />
      <div className="absolute -right-32 bottom-0 h-[28rem] w-[28rem] rounded-full bg-orange-200/30 blur-3xl" />

      <div className="relative mx-auto grid min-h-[calc(100vh-80px)] max-w-7xl items-center gap-12 px-6 py-14 lg:grid-cols-[0.92fr_1.08fr] lg:px-8 lg:py-20">
        <section className="hidden lg:block">
          <Link to="/" className="inline-flex items-center gap-3">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f45d52] text-white shadow-lg shadow-[#f45d52]/20">
              <i className="fa-solid fa-utensils" />
            </span>

            <span className="text-3xl font-black text-[#f45d52]">Crave</span>
          </Link>

          <h1 className="mt-10 max-w-xl text-5xl font-black leading-[1.05] tracking-tight text-gray-950 xl:text-6xl">
            Your favourite meals start with
            <span className="block text-[#f45d52]">one secure login.</span>
          </h1>

          <p className="mt-6 max-w-xl text-lg leading-8 text-gray-600">
            No passwords to remember. Verify your mobile number and continue to
            your customer dashboard, saved addresses and future orders.
          </p>

          <div className="mt-10 space-y-4">
            <div className="flex items-center gap-4 rounded-2xl border border-white bg-white/80 p-5 shadow-sm backdrop-blur">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-green-100 text-green-700">
                <i className="fa-solid fa-shield-halved" />
              </span>

              <div>
                <p className="font-black text-gray-950">
                  Secure OTP verification
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Your account is linked to your verified mobile number.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-white bg-white/80 p-5 shadow-sm backdrop-blur">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff0ed] text-[#f45d52]">
                <i className="fa-solid fa-key" />
              </span>

              <div>
                <p className="font-black text-gray-950">No password required</p>

                <p className="mt-1 text-sm text-gray-500">
                  Login and registration happen through the same simple flow.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 rounded-2xl border border-white bg-white/80 p-5 shadow-sm backdrop-blur">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
                <i className="fa-solid fa-location-dot" />
              </span>

              <div>
                <p className="font-black text-gray-950">
                  Your delivery details
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Manage precise map-based saved addresses after login.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-xl">
          <div className="overflow-hidden rounded-[2rem] border border-white bg-white shadow-2xl shadow-gray-300/40">
            <div className="border-b border-gray-100 bg-gray-950 px-6 py-7 text-white sm:px-9">
              <div className="flex items-center justify-between gap-5">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.22em] text-[#f45d52]">
                    {currentContent.eyebrow}
                  </p>

                  <p className="mt-2 text-sm font-semibold text-gray-400">
                    Secure customer authentication
                  </p>
                </div>

                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#f45d52] text-xl">
                  <i className={`fa-solid ${currentContent.icon}`} />
                </span>
              </div>

              <div className="mt-7 grid grid-cols-3 gap-2">
                {[STEP.MOBILE, STEP.NAME, STEP.OTP].map((stepName, index) => {
                  const steps = [STEP.MOBILE, STEP.NAME, STEP.OTP];

                  const currentIndex = steps.indexOf(step);

                  const isReached = index <= currentIndex;

                  return (
                    <div key={stepName} className="space-y-2">
                      <div
                        className={[
                          "h-1.5 rounded-full transition-colors",
                          isReached ? "bg-[#f45d52]" : "bg-gray-800",
                        ].join(" ")}
                      />

                      <p
                        className={[
                          "text-[10px] font-black uppercase tracking-wider",
                          isReached ? "text-white" : "text-gray-600",
                        ].join(" ")}
                      >
                        {index + 1}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="px-6 py-8 sm:px-9 sm:py-10">
              <h2 className="text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
                {currentContent.title}
              </h2>

              <p className="mt-4 leading-7 text-gray-600">
                {step === STEP.OTP
                  ? `Enter the code sent to ${mobile}.`
                  : currentContent.description}
              </p>

              {error && (
                <div
                  role="alert"
                  className="mt-6 flex items-start gap-3 rounded-2xl border border-red-100 bg-red-50 p-4 text-red-700"
                >
                  <i className="fa-solid fa-circle-exclamation mt-1" />

                  <p className="text-sm font-semibold leading-6">{error}</p>
                </div>
              )}

              {step === STEP.MOBILE && (
                <form onSubmit={handleMobileSubmit} className="mt-8">
                  <label
                    htmlFor="mobile"
                    className="text-sm font-black text-gray-900"
                  >
                    Mobile number
                  </label>

                  <div className="mt-2 flex overflow-hidden rounded-2xl border border-gray-200 bg-white transition focus-within:border-[#f45d52] focus-within:ring-4 focus-within:ring-[#f45d52]/10">
                    <span className="flex items-center border-r border-gray-200 bg-[#f7f9f8] px-4 font-black text-gray-700">
                      +91
                    </span>

                    <input
                      id="mobile"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel"
                      required
                      value={mobile}
                      placeholder="98765 43210"
                      onChange={(event) => {
                        setMobile(event.target.value);

                        clearFieldError("mobile");
                      }}
                      className="min-w-0 flex-1 bg-transparent px-4 py-4 font-bold text-gray-950 outline-none placeholder:font-semibold placeholder:text-gray-400"
                    />
                  </div>

                  {renderFieldError("mobile")}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#f45d52] px-6 py-4 font-black text-white shadow-lg shadow-[#f45d52]/20 transition-all hover:-translate-y-1 hover:bg-black disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Checking Number...
                      </>
                    ) : (
                      <>
                        Continue
                        <i className="fa-solid fa-arrow-right" />
                      </>
                    )}
                  </button>
                </form>
              )}

              {step === STEP.NAME && (
                <form onSubmit={handleNameSubmit} className="mt-8">
                  <div className="rounded-2xl bg-[#f7f9f8] p-4">
                    <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">
                      Mobile number
                    </p>

                    <p className="mt-2 font-black text-gray-900">{mobile}</p>
                  </div>

                  <div className="mt-6">
                    <label
                      htmlFor="fullName"
                      className="text-sm font-black text-gray-900"
                    >
                      Full name
                    </label>

                    <input
                      id="fullName"
                      type="text"
                      autoComplete="name"
                      required
                      value={fullName}
                      placeholder="Your full name"
                      onChange={(event) => {
                        setFullName(event.target.value);

                        clearFieldError("fullName");
                      }}
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-4 py-4 font-bold text-gray-950 outline-none transition placeholder:font-semibold placeholder:text-gray-400 focus:border-[#f45d52] focus:ring-4 focus:ring-[#f45d52]/10"
                    />

                    {renderFieldError("fullName")}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#f45d52] px-6 py-4 font-black text-white shadow-lg shadow-[#f45d52]/20 transition-all hover:-translate-y-1 hover:bg-black disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Sending Code...
                      </>
                    ) : (
                      <>
                        Send Verification Code
                        <i className="fa-solid fa-arrow-right" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={returnToMobileStep}
                    className="mt-5 flex w-full items-center justify-center gap-2 font-black text-gray-500 transition-colors hover:text-[#f45d52]"
                  >
                    <i className="fa-solid fa-arrow-left" />
                    Change Mobile Number
                  </button>
                </form>
              )}

              {step === STEP.OTP && (
                <form onSubmit={handleOtpSubmit} className="mt-8">
                  <div className="rounded-2xl bg-[#f7f9f8] p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">
                          Verification sent to
                        </p>

                        <p className="mt-2 font-black text-gray-900">
                          {mobile}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={returnToMobileStep}
                        className="text-sm font-black text-[#f45d52] transition-colors hover:text-black"
                      >
                        Change
                      </button>
                    </div>
                  </div>

                  <div className="mt-6">
                    <label
                      htmlFor="verificationCode"
                      className="text-sm font-black text-gray-900"
                    >
                      Four-digit code
                    </label>

                    <input
                      id="verificationCode"
                      type="text"
                      inputMode="numeric"
                      autoComplete="one-time-code"
                      maxLength={4}
                      required
                      value={code}
                      placeholder="••••"
                      onChange={(event) => {
                        const numericCode = event.target.value
                          .replace(/\D/g, "")
                          .slice(0, 4);

                        setCode(numericCode);

                        clearFieldError("code");
                      }}
                      className="mt-2 w-full rounded-2xl border border-gray-200 bg-white px-5 py-4 text-center text-3xl font-black tracking-[0.55em] text-gray-950 outline-none transition placeholder:text-gray-300 focus:border-[#f45d52] focus:ring-4 focus:ring-[#f45d52]/10"
                    />

                    {renderFieldError("code")}
                  </div>

                  {developmentCode && (
                    <div className="mt-5 flex items-center justify-between gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-800">
                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.16em]">
                          Development code
                        </p>

                        <p className="mt-1 text-sm font-semibold">
                          Available only in the development environment.
                        </p>
                      </div>

                      <span className="rounded-xl bg-white px-4 py-2 text-xl font-black tracking-[0.25em] shadow-sm">
                        {developmentCode}
                      </span>
                    </div>
                  )}

                  <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-[#f7f9f8] p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <span
                        className={[
                          "flex h-10 w-10 items-center justify-center rounded-xl",
                          expiresInSeconds > 0
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700",
                        ].join(" ")}
                      >
                        <i className="fa-solid fa-clock" />
                      </span>

                      <div>
                        <p className="text-xs font-black uppercase tracking-[0.16em] text-gray-400">
                          Code expiry
                        </p>

                        <p className="mt-1 font-black text-gray-900">
                          {expiresInSeconds > 0
                            ? formatSeconds(expiresInSeconds)
                            : "Expired"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      disabled={resendSeconds > 0 || isSubmitting}
                      onClick={() => void handleResendCode()}
                      className="font-black text-[#f45d52] transition-colors hover:text-black disabled:cursor-not-allowed disabled:text-gray-400"
                    >
                      {resendSeconds > 0
                        ? `Resend in ${resendSeconds}s`
                        : "Resend Code"}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={
                      isSubmitting || code.length !== 4 || expiresInSeconds <= 0
                    }
                    className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#f45d52] px-6 py-4 font-black text-white shadow-lg shadow-[#f45d52]/20 transition-all hover:-translate-y-1 hover:bg-black disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        Verifying...
                      </>
                    ) : (
                      <>
                        Verify and Continue
                        <i className="fa-solid fa-arrow-right" />
                      </>
                    )}
                  </button>
                </form>
              )}

              <div className="mt-8 border-t border-gray-100 pt-6">
                <p className="flex items-start justify-center gap-2 text-center text-sm leading-6 text-gray-500">
                  <i className="fa-solid fa-lock mt-1 text-[#f45d52]" />
                  Customer accounts use secure mobile verification. No password
                  is required.
                </p>
              </div>
            </div>
          </div>

          <p className="mt-6 text-center text-sm font-semibold text-gray-500">
            By continuing, you agree to use Crave responsibly and provide
            accurate account information.
          </p>
        </section>
      </div>
    </main>
  );
}
