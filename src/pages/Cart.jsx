import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faTrash,
  faMinus,
  faPlus,
  faShoppingCart,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import { useCart } from "../context/CartContext";
import "./Cart.css";

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
  } = useCart();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleCheckout = () => {
    if (cartItems.length === 0) return;
    setShowConfirm(true);
  };

  const confirmCheckout = () => {
    let message = "مرحباً، أريد طلب المنتجات التالية:\n\n";

    cartItems.forEach((item, index) => {
      message += `${index + 1}. ${item.name}`;
      if (item.variant) {
        message += ` - ${item.variant}`;
      }
      if (item.freeFillings && item.freeFillings.length > 0) {
        message += `\n   • حشوات مجانية: ${item.freeFillings.join(", ")}`;
      }
      if (item.paidFillings && item.paidFillings.length > 0) {
        message += `\n   • حشوات إضافية: ${item.paidFillings.join(", ")}`;
      }
      message += `\n   • الكمية: ${item.quantity}`;
      message += `\n   • السعر: ${item.price * item.quantity} شيكل\n\n`;
    });

    message += `💰 المجموع الكلي: ${getTotalPrice()} شيكل`;

    window.open(
      `https://wa.me/970592198804?text=${encodeURIComponent(message)}`,
      "_blank"
    );

    clearCart();
    setShowConfirm(false);
    navigate("/");
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-page empty">
        <div className="container">
          <div className="empty-cart">
            <FontAwesomeIcon icon={faShoppingCart} className="empty-icon" />
            <h2>سلة المشتريات فارغة</h2>
            <p>لم تقم بإضافة أي منتجات بعد</p>
            <button
              className="browse-btn"
              onClick={() => navigate("/products")}
            >
              تصفح المنتجات
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="page-title">سلة المشتريات</h1>

        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item, index) => (
              <motion.div
                key={index}
                className="cart-item"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <img
                  src={item.mainImage}
                  alt={item.name}
                  className="item-image"
                />

                <div className="item-details">
                  <h3>{item.name}</h3>
                  {item.variant && (
                    <p className="item-variant">الحجم: {item.variant}</p>
                  )}
                  {item.freeFillings && item.freeFillings.length > 0 && (
                    <p className="item-fillings">
                      <span className="fillings-label">حشوات مجانية:</span>{" "}
                      {item.freeFillings.join(", ")}
                    </p>
                  )}
                  {item.paidFillings && item.paidFillings.length > 0 && (
                    <p className="item-fillings">
                      <span className="fillings-label">حشوات إضافية:</span>{" "}
                      {item.paidFillings.join(", ")}
                    </p>
                  )}
                  <p className="item-price">{item.price} ₪</p>
                </div>

                <div className="item-actions">
                  <div className="quantity-control">
                    <button
                      onClick={() => updateQuantity(index, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      <FontAwesomeIcon icon={faMinus} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(index, item.quantity + 1)}
                    >
                      <FontAwesomeIcon icon={faPlus} />
                    </button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(index)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>ملخص الطلب</h2>
            <div className="summary-row">
              <span>عدد المنتجات:</span>
              <span>
                {cartItems.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <div className="summary-row total">
              <span>المجموع الكلي:</span>
              <span>{getTotalPrice()} ₪</span>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              <FontAwesomeIcon icon={faWhatsapp} />
              <span>إتمام الطلب عبر الواتساب</span>
            </button>
          </div>
        </div>
      </div>

      {showConfirm && (
        <div className="confirm-modal" onClick={() => setShowConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>تأكيد الطلب</h3>
            <p>سيتم إفراغ السلة بعد إتمام الطلب. هل تريد المتابعة؟</p>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={confirmCheckout}>
                نعم، إتمام الطلب
              </button>
              <button
                className="cancel-btn"
                onClick={() => setShowConfirm(false)}
              >
                إلغاء
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
