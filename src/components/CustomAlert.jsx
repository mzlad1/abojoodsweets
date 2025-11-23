import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheckCircle,
  faExclamationTriangle,
  faInfoCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import "./CustomAlert.css";

const CustomAlert = ({ type, message, onClose, onConfirm, showCancel }) => {
  const getIcon = () => {
    switch (type) {
      case "success":
        return faCheckCircle;
      case "error":
        return faExclamationTriangle;
      case "confirm":
        return faExclamationTriangle;
      default:
        return faInfoCircle;
    }
  };

  const getIconColor = () => {
    switch (type) {
      case "success":
        return "#28a745";
      case "error":
        return "#dc3545";
      case "confirm":
        return "#ffc107";
      default:
        return "#17a2b8";
    }
  };

  return (
    <div className="custom-alert-overlay" onClick={onClose}>
      <div className="custom-alert-box" onClick={(e) => e.stopPropagation()}>
        <button className="alert-close-btn" onClick={onClose}>
          <FontAwesomeIcon icon={faTimes} />
        </button>

        <div className="alert-icon" style={{ color: getIconColor() }}>
          <FontAwesomeIcon icon={getIcon()} />
        </div>

        <div className="alert-message">{message}</div>

        <div className="alert-actions">
          {showCancel ? (
            <>
              <button
                className="alert-btn alert-btn-confirm"
                onClick={onConfirm}
              >
                تأكيد
              </button>
              <button className="alert-btn alert-btn-cancel" onClick={onClose}>
                إلغاء
              </button>
            </>
          ) : (
            <button className="alert-btn alert-btn-ok" onClick={onClose}>
              حسناً
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomAlert;
