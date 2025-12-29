import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../utils/axiosClient";
import { useDispatch } from "react-redux";
import { addUser } from "../Utils/userSlice"

export default function Login() {
  const [form, setForm] = useState({ emailId: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => setForm(s => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const res = await api.post("/login", form); // backend sets cookies
      dispatch(addUser(res.data.data.user));
      navigate("/feed");
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.error || "Login failed";
      if (status === 403) {
        // Unverified -> go to verify page with email (backend may have resent OTP)
        navigate("/verify-email", { state: { emailId: form.emailId } });
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Log in</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="emailId" placeholder="Email" value={form.emailId} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <button disabled={loading}>{loading ? "Logging in..." : "Log in"}</button>
      </form>
      <p>Don't have account? <Link to="/signup">Sign up</Link></p>
    </div>
  );
}
