import { useLocation, useNavigate } from "react-router-dom";
import api from "../utils/axiosClient";
import { useDispatch } from "react-redux";
import { addUser } from "../Utils/userSlice";
import { useEffect, useRef, useState } from "react";

const OTP_LENGTH = 4;
const RESEND_DELAY = 60;

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const emailId = location.state?.emailId || "";
  const [otp, setOtp] = useState(Array(OTP_LENGTH).fill(""));
  const [error, setError] = useState("");
  const [info, setInfo] = useState(
    emailId ? `OTP sent to ${emailId}` : ""
  );
  const [loading, setLoading] = useState(false);

  // resend timer
  const [secondsLeft, setSecondsLeft] = useState(RESEND_DELAY);
  const [resendLoading, setResendLoading] = useState(false);

  const inputsRef = useRef([]);

  useEffect(() => {
    if (secondsLeft === 0) return;

    const timer = setInterval(() => {
      setSecondsLeft((s) => s - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsLeft]);

  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);

    if (value && index < OTP_LENGTH - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(""); setInfo("");
    setLoading(true);

    try {
      const res = await api.post("/verify-email", {
        emailId,
        otp: otp.join(""),
      });
      dispatch(addUser(res.data.data.user));
      navigate("/feed");
    } catch (err) {
      setError(err.response?.data?.error || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError(""); setInfo("");
    setResendLoading(true);

    try {
      await api.post("/resend-otp", { emailId });
      setInfo("A new OTP has been sent.");
      setSecondsLeft(RESEND_DELAY); // restart timer
    } catch (err) {
      setError(err.response?.data?.error || "Could not resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gray-50">

      {/* Background */}
      <div className="absolute -top-40 -left-40 w-[500px] h-[500px] bg-purple-300/30 rounded-full blur-3xl" />
      <div className="absolute top-1/3 -right-40 w-[400px] h-[400px] bg-violet-300/30 rounded-full blur-3xl" />

      {/* Card */}
      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-xl border border-gray-200 rounded-2xl p-8 shadow-lg">

        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Verify your email
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Enter the 4-digit code sent to your email
          </p>
        </div>

        {/* Info / Error */}
        {info && (
          <div className="mb-4 rounded-lg bg-green-50 px-4 py-2 text-sm text-green-700 border border-green-100">
            {info}
          </div>
        )}
        {error && (
          <div className="mb-4 rounded-lg bg-red-50 px-4 py-2 text-sm text-red-600 border border-red-100">
            {error}
          </div>
        )}

        {/* Email (locked) */}
        <input
          value={emailId}
          disabled
          className="mb-5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm bg-gray-100 cursor-not-allowed"
        />

        {/* OTP blocks */}
        <form onSubmit={handleVerify}>
          <div className="flex justify-center gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputsRef.current[index] = el)}
                value={digit}
                onChange={(e) => handleOtpChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                maxLength={1}
                className="w-14 h-14 text-center text-lg font-semibold rounded-lg border border-gray-300 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading || otp.join("").length !== OTP_LENGTH}
            className="w-full rounded-lg bg-purple-600 py-2.5 text-sm font-medium text-white hover:bg-purple-700 transition disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify email"}
          </button>
        </form>

        {/* Resend */}
        <div className="mt-5 text-center">
          <button
            onClick={handleResend}
            disabled={secondsLeft > 0 || resendLoading}
            className="text-sm text-purple-600 hover:underline disabled:text-gray-400 disabled:no-underline"
          >
            {resendLoading
              ? "Resending..."
              : secondsLeft > 0
              ? `Resend OTP in 00:${String(secondsLeft).padStart(2, "0")}`
              : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}
