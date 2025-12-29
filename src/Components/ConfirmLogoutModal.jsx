import { useEffect } from "react";
import { createPortal } from "react-dom";

const ConfirmLogoutModal = ({ onCancel, onConfirm, loading }) => {
    useEffect(() => {
  // modal mounted → stop scroll
  document.body.style.overflow = "hidden";

  // modal unmounted → restore scroll
  return () => {
    document.body.style.overflow = "auto";
  };
}, []);

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-2xl w-[90%] max-w-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800">
          Logout Confirmation
        </h2>

        <p className="text-gray-600 mt-2">
          Are you sure you want to logout?
        </p>

        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2 rounded-lg border text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:opacity-70"
          >
            {loading ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmLogoutModal;
