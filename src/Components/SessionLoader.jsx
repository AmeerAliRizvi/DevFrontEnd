// src/components/SessionLoader.jsx
// Wrap your app with this to check /auth/me once at boot.
// It sets Redux user if session exists and prevents UI flash while checking.

import React, { useEffect, useState } from "react";
import api from "../utils/axiosClient";
import { useDispatch } from "react-redux";
import { addUser, removeUser } from "../Utils/userSlice";

export default function SessionLoader({ children }) {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    let mounted = true;
    const checkSession = async () => {
      try {
        const res = await api.get("/me"); // will use cookies
        if (mounted && res?.data?.data) {
          dispatch(addUser(res.data.data));
        }
      } catch (err) {
        // no session or refresh failed -> ensure store cleared
        dispatch(removeUser());
      } finally {
        if (mounted) setLoading(false);
      }
    };

    checkSession();
    return () => {
      mounted = false;
    };
  }, [dispatch]);

  if (loading) {
    return (
      <div style={{ padding: 24, textAlign: "center" }}>
        <h3>Checking session…</h3>
      </div>
    );
  }

  return children;
}
