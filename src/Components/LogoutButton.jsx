import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { removeUser } from "../Utils/userSlice";
import { useState } from "react";
import api from "../utils/axiosClient";
import ConfirmLogoutModal from "./ConfirmLogoutModal";

const LogoutButton = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);
      await api.post("/logout", {}, { withCredentials: true });
      dispatch({ type: 'LOGOUT' });
    } catch (error) {
      console.error("Logout API failed:", error);
    } finally {
      dispatch(removeUser());
      dispatch(remove)
      navigate("/login", { replace: true });
    }
  };

  return (
    <>
      <button
        onClick={() => setShowConfirm(true)}
        className="text-red-600 hover:text-red-700 font-medium"
      >
        Logout
      </button>

      {showConfirm && (
        <ConfirmLogoutModal
          loading={loading}
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleLogout}
        />
      )}
    </>
  );
};

export default LogoutButton;
