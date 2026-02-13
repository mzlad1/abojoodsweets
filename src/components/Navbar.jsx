import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faTimes,
  faShoppingCart,
  faHome,
  faCookie,
  faImages,
  faInfoCircle,
  faEnvelope,
} from "@fortawesome/free-solid-svg-icons";
import { useCart } from "../context/CartContext";
import "./Navbar.css";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { getTotalItems } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="container navbar-container">
        <Link to="/" className="navbar-logo">
          <img
            src="/assets/abojoodlogo.png"
            alt="حلويات أبو الجود"
            className="logo-image"
          />
          <span className="logo-text">حلويات أبو الجود</span>
        </Link>

        <div className="navbar-actions">
          <Link
            to="/cart"
            className={`cart-link-mobile ${
              location.pathname === "/cart" ? "active" : ""
            }`}
          >
            <FontAwesomeIcon icon={faShoppingCart} />
            {getTotalItems() > 0 && (
              <span className="cart-badge">{getTotalItems()}</span>
            )}
          </Link>

          <button className="menu-toggle" onClick={toggleMenu}>
            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
          </button>
        </div>

        <ul className={`navbar-menu ${isOpen ? "active" : ""}`}>
          <li>
            <Link to="/" className={location.pathname === "/" ? "active" : ""}>
              <FontAwesomeIcon icon={faHome} className="nav-icon" />
              <span className="nav-label">الرئيسية</span>
            </Link>
          </li>
          <li>
            <Link
              to="/products"
              className={location.pathname === "/products" ? "active" : ""}
            >
              <FontAwesomeIcon icon={faCookie} className="nav-icon" />
              <span className="nav-label">المنتجات</span>
            </Link>
          </li>
          <li>
            <Link
              to="/gallery"
              className={location.pathname === "/gallery" ? "active" : ""}
            >
              <FontAwesomeIcon icon={faImages} className="nav-icon" />
              <span className="nav-label">المعرض</span>
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className={location.pathname === "/about" ? "active" : ""}
            >
              <FontAwesomeIcon icon={faInfoCircle} className="nav-icon" />
              <span className="nav-label">من نحن</span>
            </Link>
          </li>
          <li>
            <Link
              to="/contact"
              className={location.pathname === "/contact" ? "active" : ""}
            >
              <FontAwesomeIcon icon={faEnvelope} className="nav-icon" />
              <span className="nav-label">تواصل معنا</span>
            </Link>
          </li>
          <li className="cart-link-desktop">
            <Link
              to="/cart"
              className={`cart-link ${
                location.pathname === "/cart" ? "active" : ""
              }`}
            >
              <FontAwesomeIcon icon={faShoppingCart} />
              {getTotalItems() > 0 && (
                <span className="cart-badge">{getTotalItems()}</span>
              )}
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
