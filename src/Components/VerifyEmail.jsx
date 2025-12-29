import { useLocation, useNavigate } from "react-router-dom";
import api from "../utils/axiosClient";
import { useDispatch } from "react-redux";
import { addUser } from "../Utils/userSlice";
import { useState } from "react";

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialEmail = location.state?.emailId || "";
  const [emailId, setEmailId] = useState(initialEmail);
  const [otp, setOtp] = useState("");
  const [info, setInfo] = useState(initialEmail ? `OTP sent to ${initialEmail}` : "");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(""); setInfo("");
    setLoading(true);
    try {
      const res = await api.post("/verify-email", { emailId, otp }); // backend sets cookies
      dispatch(addUser(res.data.data.user)); // set sanitized user in Redux
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
      setInfo("A new OTP has been sent to your email.");
    } catch (err) {
      setError(err.response?.data?.error || "Could not resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Verify email</h2>
      {info && <p style={{ color: "green" }}>{info}</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleVerify}>
        <input placeholder="Email" value={emailId} onChange={(e) => setEmailId(e.target.value)} required />
        <input placeholder="OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
        <button type="submit" disabled={loading}>{loading ? "Verifying..." : "Verify"}</button>
      </form>

      <button onClick={handleResend} disabled={resendLoading || !emailId}>
        {resendLoading ? "Resending..." : "Resend OTP"}
      </button>
    </div>
  );
}
