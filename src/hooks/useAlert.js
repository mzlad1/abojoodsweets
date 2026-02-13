import { useState } from "react";

export const useAlert = () => {
  const [alert, setAlert] = useState(null);

  const showAlert = (type, message) => {
    return new Promise((resolve) => {
      setAlert({
        type,
        message,
        onClose: () => {
          setAlert(null);
          resolve(false);
        },
        onConfirm: () => {
          setAlert(null);
          resolve(true);
        },
        showCancel: type === "confirm",
      });
    });
  };

  const showSuccess = (message) => showAlert("success", message);
  const showError = (message) => showAlert("error", message);
  const showConfirm = (message) => showAlert("confirm", message);

  return {
    alert,
    showAlert: (message, type = "success") => showAlert(type, message),
    showSuccess,
    showError,
    showConfirm,
  };
};
