import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useCart } from "../context/CartContext";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState("");
  const [showFullImage, setShowFullImage] = useState(false);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedFreeFillings, setSelectedFreeFillings] = useState([]);
  const [selectedPaidFillings, setSelectedPaidFillings] = useState([]);
  const [showAddedMessage, setShowAddedMessage] = useState(false);

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const productDoc = await getDoc(doc(db, "products", id));
      if (productDoc.exists()) {
        const productData = { id: productDoc.id, ...productDoc.data() };
        setProduct(productData);
        setSelectedImage(productData.mainImage);
      } else {
        navigate("/products");
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching product:", error);
      setLoading(false);
    }
  };

  const toggleFreeFilling = (filling) => {
    setSelectedFreeFillings((prev) => {
      if (prev.includes(filling)) {
        return prev.filter((f) => f !== filling);
      } else if (prev.length < 2) {
        return [...prev, filling];
      }
      return prev;
    });
  };

  const togglePaidFilling = (filling) => {
    setSelectedPaidFillings((prev) => {
      if (prev.includes(filling)) {
        return prev.filter((f) => f !== filling);
      }
      return [...prev, filling];
    });
  };

  const calculateTotalPrice = () => {
    let total =
      product.hasVariants && selectedVariant
        ? selectedVariant.price
        : product.price;

    if (selectedPaidFillings.length > 0 && selectedVariant) {
      const isSmall = selectedVariant.size.includes("صغير");
      selectedPaidFillings.forEach((fillingName) => {
        const filling = product.paidFillings.find(
          (f) => f.name === fillingName
        );
        if (filling) {
          total += isSmall ? filling.smallPrice : filling.largePrice;
        }
      });
    }

    return total;
  };

  const handleAddToCart = () => {
    // Calculate total price including paid fillings
    let totalPrice =
      product.hasVariants && selectedVariant
        ? selectedVariant.price
        : product.price;

    if (selectedPaidFillings.length > 0 && selectedVariant) {
      const isSmall = selectedVariant.size.includes("صغير");
      selectedPaidFillings.forEach((fillingName) => {
        const filling = product.paidFillings.find(
          (f) => f.name === fillingName
        );
        if (filling) {
          totalPrice += isSmall ? filling.smallPrice : filling.largePrice;
        }
      });
    }

    // Create product with calculated price
    const productToAdd = {
      ...product,
      price: totalPrice,
    };

    addToCart(
      productToAdd,
      selectedVariant,
      selectedFreeFillings,
      selectedPaidFillings
    );

    setShowAddedMessage(true);
    setTimeout(() => setShowAddedMessage(false), 2000);
  };

  const orderWhatsApp = () => {
    let message = `مرحباً، أريد طلب ${product.name}`;

    if (product.hasVariants && selectedVariant) {
      message += `\n- الحجم: ${selectedVariant.size}`;
    }

    if (product.hasFillings) {
      if (selectedFreeFillings.length > 0) {
        message += `\n- الحشوات المجانية: ${selectedFreeFillings.join(", ")}`;
      }
      if (selectedPaidFillings.length > 0) {
        message += `\n- الحشوات الإضافية: ${selectedPaidFillings.join(", ")}`;
      }
    }

    const totalPrice = calculateTotalPrice();
    message += `\n\n💰 السعر الإجمالي: ${totalPrice} شيكل`;

    window.open(
      `https://wa.me/970592198804?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const allImages = [product.mainImage, ...(product.additionalImages || [])];

  return (
    <div className="product-details-page">
      <div className="container">
        <button className="back-btn" onClick={() => navigate("/products")}>
          <FontAwesomeIcon icon={faArrowRight} />
          <span>العودة للمنتجات</span>
        </button>

        <div className="product-details">
          <motion.div
            className="product-images"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="main-image" onClick={() => setShowFullImage(true)}>
              <img
                src={selectedImage}
                alt={product.name}
                onError={(e) => {
                  e.target.src = "/assets/placeholder.png";
                }}
              />
            </div>
            {allImages.length > 1 && (
              <div className="thumbnail-gallery">
                {allImages.map((image, index) => (
                  <div
                    key={index}
                    className={`thumbnail ${
                      selectedImage === image ? "active" : ""
                    }`}
                    onClick={() => setSelectedImage(image)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      onError={(e) => {
                        e.target.src = "/assets/placeholder.png";
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div
            className="product-content"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1>{product.name}</h1>
            <span className="product-origin">{product.origin}</span>

            {product.hasVariants && product.variants?.length > 0 ? (
              <div className="variants-selection">
                <h3>اختر الحجم</h3>
                <div className="variants-options">
                  {product.variants.map((variant, index) => (
                    <button
                      key={index}
                      className={`variant-option ${
                        selectedVariant?.size === variant.size ? "active" : ""
                      }`}
                      onClick={() => setSelectedVariant(variant)}
                    >
                      <span className="variant-size">{variant.size}</span>
                      <span className="variant-price">{variant.price} ₪</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="productdetails-price">
                <span className="price">{product.price} ₪</span>
              </div>
            )}

            {product.hasFillings && (
              <div className="fillings-selection">
                {product.freeFillings?.length > 0 && (
                  <div className="free-fillings">
                    <h3>الحشوات المجانية</h3>
                    <p className="fillings-subtitle">اختر حشوتين مجانيتين</p>
                    <div className="fillings-options">
                      {product.freeFillings.map((filling, index) => (
                        <label key={index} className="filling-checkbox">
                          <input
                            type="checkbox"
                            checked={selectedFreeFillings.includes(filling)}
                            onChange={() => toggleFreeFilling(filling)}
                            disabled={
                              !selectedFreeFillings.includes(filling) &&
                              selectedFreeFillings.length >= 2
                            }
                          />
                          <span className="filling-name">{filling}</span>
                          <span className="filling-badge free">مجاناً</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {product.paidFillings?.length > 0 && selectedVariant && (
                  <div className="paid-fillings">
                    <h3>الحشوات الإضافية</h3>
                    <p className="fillings-subtitle">حشوات مدفوعة (اختياري)</p>
                    <div className="fillings-options">
                      {product.paidFillings.map((filling, index) => {
                        const isSmall = selectedVariant.size.includes("صغير");
                        const price = isSmall
                          ? filling.smallPrice
                          : filling.largePrice;
                        return (
                          <label key={index} className="filling-checkbox">
                            <input
                              type="checkbox"
                              checked={selectedPaidFillings.includes(
                                filling.name
                              )}
                              onChange={() => togglePaidFilling(filling.name)}
                            />
                            <span className="filling-name">{filling.name}</span>
                            <span className="filling-badge paid">
                              +{price} ₪
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {(product.hasVariants || product.hasFillings) && (
              <div className="total-price-display">
                <h3>السعر الإجمالي</h3>
                <div className="total-price">{calculateTotalPrice()} ₪</div>
              </div>
            )}

            {product.description && (
              <div className="product-description">
                <h3>الوصف</h3>
                <p>{product.description}</p>
              </div>
            )}

            {product.ingredients && product.ingredients.length > 0 && (
              <div className="product-ingredients">
                <h3>المكونات</h3>
                <p>{product.ingredients.join(", ")}</p>
              </div>
            )}

            <div className="action-buttons">
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                <FontAwesomeIcon icon={faShoppingCart} />
                <span>أضف للسلة</span>
              </button>
              <button className="whatsapp-order-btn" onClick={orderWhatsApp}>
                <FontAwesomeIcon icon={faWhatsapp} />
                <span>اطلب عبر الواتساب</span>
              </button>
            </div>

            {showAddedMessage && (
              <div className="added-message">✓ تمت الإضافة إلى السلة بنجاح</div>
            )}
          </motion.div>
        </div>

        {showFullImage && (
          <div
            className="fullscreen-modal"
            onClick={() => setShowFullImage(false)}
          >
            <div className="fullscreen-content">
              <button
                className="close-fullscreen"
                onClick={() => setShowFullImage(false)}
              >
                ×
              </button>
              <img
                src={selectedImage}
                alt={product.name}
                onError={(e) => {
                  e.target.src = "/assets/placeholder.png";
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
