import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faExclamationTriangle,
} from "@fortawesome/free-solid-svg-icons";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="container">
        <motion.div
          className="not-found-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="not-found-icon">
            <FontAwesomeIcon icon={faExclamationTriangle} />
          </div>

          <h1 className="not-found-title">404</h1>

          <h2 className="not-found-subtitle">الصفحة غير موجودة</h2>

          <p className="not-found-text">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها
          </p>

          <Link to="/" className="home-btn">
            <FontAwesomeIcon icon={faHome} />
            <span>العودة للرئيسية</span>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
