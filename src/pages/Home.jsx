import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faFire, faStar } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { collection, query, where, getDocs, limit } from "firebase/firestore";
import { db } from "../firebase";
import Partners from "../components/Partners";
import "./Home.css";

const Home = () => {
  const [offers, setOffers] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentText, setCurrentText] = useState(0);

  const subtitles = [
    "حلويات شرقية",
    "حلويات غربية",
    "أفراح",
    "جاتو",
    "كب كيك",
    "كنافة",
    "بقلاوة",
    "معمول",
    "بسبوسة",
    "قطايف",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentText((prev) => (prev + 1) % subtitles.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch offers
      const offersQuery = query(
        collection(db, "offers"),
        where("active", "==", true),
        limit(3),
      );
      const offersSnapshot = await getDocs(offersQuery);
      setOffers(
        offersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      );

      // Fetch featured products
      const productsQuery = query(
        collection(db, "products"),
        where("featured", "==", true),
        where("visible", "==", true),
        limit(6),
      );
      const productsSnapshot = await getDocs(productsQuery);
      setFeaturedProducts(
        productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      );

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const orderWhatsApp = (productName) => {
    const message = `مرحباً، أريد طلب ${productName}`;
    window.open(
      `https://wa.me/970592198804?text=${encodeURIComponent(message)}`,
      "_blank",
    );
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg">
          <img src="/assets/image.png" alt="" className="hero-bg-img" />
          <div className="hero-overlay"></div>
        </div>

        {/* Decorative floating shapes */}
        <div className="hero-shapes"></div>

        <div className="container hero-container">
          {/* Left side - Logo */}
          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <div className="hero-logo-wrapper">
              <img
                src="/assets/abojoodlogo.png"
                alt="حلويات أبو الجود"
                className="hero-logo-img"
              />
            </div>
          </motion.div>

          {/* Right side - Content */}
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <span className="hero-badge-dot"></span>
              أجود الحلويات الشرقية والغربية
            </motion.div>

            <h1 className="hero-title">
              حلويات
              <span className="hero-title-accent"> أبو الجود</span>
            </h1>

            <div className="hero-subtitle-wrapper">
              <span className="hero-subtitle-label">نقدّم لكم</span>
              <AnimatePresence mode="wait">
                <motion.span
                  className="hero-subtitle-text"
                  key={currentText}
                  initial={{ opacity: 0, y: 20, filter: "blur(4px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -20, filter: "blur(4px)" }}
                  transition={{ duration: 0.4 }}
                >
                  {subtitles[currentText]}
                </motion.span>
              </AnimatePresence>
            </div>

            <p className="hero-description">
              جاهزون لتلبية كافة مناسباتكم بأشهى الحلويات وأرقى التقديمات
            </p>

            <div className="hero-actions">
              <Link to="/products" className="hero-btn hero-btn-primary">
                اكتشف منتجاتنا
                <FontAwesomeIcon icon={faArrowLeft} />
              </Link>
              <button
                className="hero-btn hero-btn-whatsapp"
                onClick={() =>
                  window.open(
                    "https://wa.me/970592198804?text=" +
                      encodeURIComponent("مرحباً، أريد الاستفسار عن الحجز"),
                    "_blank",
                  )
                }
              >
                <FontAwesomeIcon icon={faWhatsapp} />
                تواصل معنا
              </button>
            </div>

            {/* Stats */}
            {/* <motion.div
              className="hero-stats"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <div className="hero-stat">
                <span className="hero-stat-number">+١٠٠</span>
                <span className="hero-stat-label">منتج مميز</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <span className="hero-stat-number">+٥٠٠٠</span>
                <span className="hero-stat-label">عميل سعيد</span>
              </div>
              <div className="hero-stat-divider"></div>
              <div className="hero-stat">
                <span className="hero-stat-number">+١٥</span>
                <span className="hero-stat-label">سنة خبرة</span>
              </div>
            </motion.div> */}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        {/* <motion.div
          className="hero-scroll-indicator"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="hero-scroll-mouse">
            <div className="hero-scroll-dot"></div>
          </div>
        </motion.div> */}
      </section>

      {/* Partners Section */}
      <Partners />

      {/* Offers Section */}
      {offers.length > 0 && (
        <section className="offers-section">
          <div className="container">
            <motion.div
              className="section-header"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <FontAwesomeIcon icon={faFire} className="section-icon" />
              <h2>العروض الخاصة</h2>
            </motion.div>
            <div className="offers-grid">
              {offers.map((offer, index) => (
                <motion.div
                  key={offer.id}
                  className="offer-card"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="offer-badge">عرض خاص</div>
                  <img src={offer.image} alt={offer.title} />
                  <div className="offer-content">
                    <h3>{offer.title}</h3>
                    <p>{offer.description}</p>
                    {offer.discount && (
                      <span className="discount">{offer.discount}% خصم</span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Section */}
      {featuredProducts.length > 0 && (
        <section className="featured-section">
          <div className="container">
            <motion.div
              className="section-header"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <FontAwesomeIcon icon={faStar} className="section-icon" />
              <h2>منتجاتنا المميزة</h2>
            </motion.div>
            <div className="products-grid">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="product-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                >
                  <Link to={`/product/${product.id}`}>
                    <div className="product-image">
                      <img
                        src={product.mainImage}
                        alt={product.name}
                        onError={(e) => {
                          e.target.src = "/assets/placeholder.png";
                        }}
                      />
                    </div>
                    <div className="product-info">
                      <h3>{product.name}</h3>
                      <div className="product-footer">
                        <span className="product-price">{product.price} ₪</span>
                        <button
                          className="order-btn"
                          onClick={(e) => {
                            e.preventDefault();
                            orderWhatsApp(product.name);
                          }}
                        >
                          اطلب الآن
                        </button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default Home;
