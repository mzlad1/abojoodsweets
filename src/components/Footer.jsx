import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPhone,
  faLocationDot,
  faClock,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>للتواصل</h3>
            <div className="contact-item">
              <FontAwesomeIcon icon={faWhatsapp} />
              <a
                href="https://wa.me/970592198804"
                target="_blank"
                rel="noopener noreferrer"
              >
                0592198804
              </a>
            </div>
            <div className="contact-item">
              <FontAwesomeIcon icon={faPhone} />
              <span style={{ color: "var(--text-dark)" }}>022817522</span>
            </div>
          </div>

          <div className="footer-section">
            <h3>فروعنا</h3>
            <div className="contact-item">
              <FontAwesomeIcon icon={faLocationDot} />
              <span style={{ color: "var(--text-dark)" }}>
                الفرع الأول: ابو قش - الشارع الرئيسي
              </span>
            </div>
            <div className="contact-item">
              <FontAwesomeIcon icon={faLocationDot} />
              <span style={{ color: "var(--text-dark)" }}>
                الفرع الثاني: المزعة الغربية - وسط البلد
              </span>
            </div>
          </div>

          <div className="footer-section">
            <h3>أوقات العمل</h3>
            <div className="contact-item">
              <FontAwesomeIcon icon={faClock} />
              <span style={{ color: "var(--text-dark)" }}>
                يومياً من 11 ظهراً حتى 11 ليلاً
              </span>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 حلويات أبو الجود. جميع الحقوق محفوظة.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
