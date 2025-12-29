// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosClient";

export default function Signup() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    emailId: "",
    password: "",
    age: "",
    gender: "male",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm((s) => ({ ...s, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await api.post("/signup", {
        ...form,
        age: form.age ? Number(form.age) : undefined,
      });
      // navigate to verify page; passing email in state for convenience
      navigate("/verify-email", { state: { emailId: form.emailId } });
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h2>Sign up</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input name="firstName" placeholder="First name" value={form.firstName} onChange={handleChange} required />
        <input name="lastName" placeholder="Last name" value={form.lastName} onChange={handleChange} />
        <input name="emailId" placeholder="Email" value={form.emailId} onChange={handleChange} required />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={handleChange} required />
        <input name="age" placeholder="Age" value={form.age} onChange={handleChange} />
        <select name="gender" value={form.gender} onChange={handleChange}>
          <option value="male">Male</option><option value="female">Female</option><option value="other">Other</option>
        </select>
        <button type="submit" disabled={loading}>{loading ? "Creating..." : "Sign up"}</button>
      </form>
    </div>
  );
}
