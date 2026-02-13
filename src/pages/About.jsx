import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCakeCandles,
  faStar,
  faHeart,
} from "@fortawesome/free-solid-svg-icons";
import "./About.css";

const About = () => {
  return (
    <div className="about-page">
      <div className="container">
        <motion.div
          className="about-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>من نحن</h1>
        </motion.div>

        <div className="about-content">
          <motion.div
            className="about-logo"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <img
              src="/assets/abojoodlogo.png"
              alt="حلويات أبو الجود"
              className="logo-image-large"
            />
          </motion.div>

          <motion.div
            className="about-text"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-block">
              <h3>من نحن</h3>
              <p>
                في حلويات أبو الجود، شغفنا هو تقديم أشهى وأجود الحلويات الشرقية
                والغربية. منذ يوم تأسيسنا، كان هدفنا أن نكون جزءًا من لحظاتكم
                الحلوة وأفراحكم.
              </p>
            </div>

            <div className="text-block">
              <h3>رسالتنا</h3>
              <p>
                كل قطعة حلوى نقدمها مصنوعة بحب وإتقان، مستخدمين أفضل المكونات
                لنضمن لكم الطعم الأصيل والجودة العالية.
              </p>
            </div>

            <div className="text-block">
              <h3>التزامنا</h3>
              <p>
                نلتزم بتقديم منتجات طازجة يومياً، مع الحفاظ على التقاليد العريقة
                في صناعة الحلويات ودمجها مع أحدث الطرق لضمان رضاكم التام.
              </p>
            </div>
          </motion.div>

          <motion.div
            className="about-features"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faCakeCandles} />
              </div>
              <h4>منتجات طازجة</h4>
              <p>نصنع حلوياتنا يومياً بأجود المكونات</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faStar} />
              </div>
              <h4>جودة عالية</h4>
              <p>نختار أفضل الخامات لضمان الطعم الأصيل</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faHeart} />
              </div>
              <h4>صنع بحب</h4>
              <p>كل قطعة مصنوعة بعناية واهتمام</p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default About;
