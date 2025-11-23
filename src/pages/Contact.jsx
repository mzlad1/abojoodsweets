import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faLocationDot,
  faClock,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import "./Contact.css";

const Contact = () => {
  return (
    <div className="contact-page">
      <div className="container">
        <motion.div
          className="contact-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>تواصل معنا</h1>
          <p>نسعد بخدمتكم والإجابة على استفساراتكم</p>
        </motion.div>

        <div className="contact-content">
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <h2>معلومات التواصل</h2>

            <div className="contact-item">
              <div className="contact-icon">
                <FontAwesomeIcon
                  icon={faWhatsapp}
                  style={{ color: "var(--white)" }}
                />
              </div>
              <div className="contact-details">
                <h3>واتساب</h3>
                <a
                  href="https://wa.me/970592198804"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  0592198804
                </a>
              </div>
            </div>

            <div className="contact-item">
              <div className="contact-icon">
                <FontAwesomeIcon
                  icon={faPhone}
                  style={{ color: "var(--white)" }}
                />
              </div>
              <div className="contact-details">
                <h3>الهاتف</h3>
                <a href="tel:022817522">022817522</a>
              </div>
            </div>

            {/* <div className="contact-item">
              <div className="contact-icon">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  style={{ color: "var(--white)" }}
                />
              </div>
              <div className="contact-details">
                <h3>البريد الإلكتروني</h3>
                <a href="mailto:info@abojoodsweets.com">
                  info@abojoodsweets.com
                </a>
              </div>
            </div> */}

            <div className="contact-item">
              <div className="contact-icon">
                <FontAwesomeIcon
                  icon={faClock}
                  style={{ color: "var(--white)" }}
                />
              </div>
              <div className="contact-details">
                <h3>أوقات العمل</h3>
                <p>يومياً من 11 ظهراً حتى 11 ليلاً</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="branches-section"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2>فروعنا</h2>

            <div className="branch-card">
              <div className="branch-icon">
                <FontAwesomeIcon icon={faLocationDot} />
              </div>
              <div className="branch-info">
                <h3>الفرع الأول</h3>
                <p>ابو قش - الشارع الرئيسي</p>
              </div>
            </div>

            <div className="branch-card">
              <div className="branch-icon">
                <FontAwesomeIcon icon={faLocationDot} />
              </div>
              <div className="branch-info">
                <h3>الفرع الثاني</h3>
                <p>المزعة الغربية - وسط البلد</p>
              </div>
            </div>

            <div className="whatsapp-cta">
              <h3>اطلب الآن عبر الواتساب</h3>
              <a
                href="https://wa.me/970592198804?text=مرحباً، أريد الاستفسار عن منتجاتكم"
                target="_blank"
                rel="noopener noreferrer"
                className="whatsapp-btn"
              >
                <FontAwesomeIcon icon={faWhatsapp} />
                <span>تواصل معنا</span>
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
