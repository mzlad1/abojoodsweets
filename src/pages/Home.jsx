import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faFire, faStar } from "@fortawesome/free-solid-svg-icons";
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
        limit(3)
      );
      const offersSnapshot = await getDocs(offersQuery);
      setOffers(
        offersSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
      );

      // Fetch featured products
      const productsQuery = query(
        collection(db, "products"),
        where("featured", "==", true),
        where("visible", "==", true),
        limit(6)
      );
      const productsSnapshot = await getDocs(productsQuery);
      setFeaturedProducts(
        productsSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
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
      "_blank"
    );
  };

  return (
    <div className="home">
      {/* Hero Section */}
      <section
        className="hero"
        style={{ backgroundImage: "url(/assets/image.png)" }}
      >
        <div className="hero-overlay"></div>
        <div className="container">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="hero-title">حلويات أبو الجود</h1>
            <div className="hero-subtitle">
              <motion.span
                key={currentText}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                {subtitles[currentText]}
              </motion.span>
            </div>
            <Link to="/products" className="hero-btn">
              اكتشف منتجاتنا
              <FontAwesomeIcon icon={faArrowLeft} />
            </Link>
            <p className="hero-message">
              جاهزون لتلبية كافة مناسباتكم <br />
              <br />
              <span
                className="highlight"
                onClick={() =>
                  window.open(
                    "https://wa.me/970592198804?text=" +
                      encodeURIComponent("مرحباً، أريد الاستفسار عن الحجز"),
                    "_blank"
                  )
                }
              >
                للحجز تواصلوا عبر الواتساب
              </span>
            </p>
          </motion.div>
        </div>
      </section>

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

      {/* Partners Section */}
      <Partners />

      {loading && (
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
};

export default Home;
