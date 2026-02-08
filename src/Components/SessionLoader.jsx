
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
        const res = await api.get("/me"); 
        if (mounted && res?.data?.data) {
          dispatch(addUser(res.data.data));
        }
      } catch (err) {

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
