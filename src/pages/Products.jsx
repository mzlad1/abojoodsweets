import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faFilter } from "@fortawesome/free-solid-svg-icons";
import { collection, query, where, getDocs, orderBy } from "firebase/firestore";
import { db } from "../firebase";
import "./Products.css";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("الكل");
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const categoriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(["الكل", ...categoriesData.map((cat) => cat.name)]);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories(["الكل"]);
    }
  };

  const fetchProducts = async () => {
    try {
      const productsQuery = query(
        collection(db, "products"),
        where("visible", "==", true),
        orderBy("name")
      );
      const querySnapshot = await getDocs(productsQuery);
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (selectedCategory !== "الكل") {
      filtered = filtered.filter(
        (product) => product.origin === selectedCategory
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  };

  const orderWhatsApp = (productName) => {
    const message = `مرحباً، أريد طلب ${productName}`;
    window.open(
      `https://wa.me/970592198804?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  // Pagination
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="products-page">
      <div className="container">
        <motion.div
          className="page-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1>منتجاتنا</h1>
          <p>اكتشف مجموعتنا المتنوعة من الحلويات الشرقية والغربية</p>
        </motion.div>

        <div className="filters-container">
          <div className="search-box">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="ابحث عن منتج..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="category-filter">
            <FontAwesomeIcon icon={faFilter} />
            <span>الفئة:</span>
            {categories.map((category) => (
              <button
                key={category}
                className={`filter-btn ${
                  selectedCategory === category ? "active" : ""
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {currentProducts.length === 0 ? (
          <div className="no-products">
            <p>لا توجد منتجات تطابق البحث</p>
          </div>
        ) : (
          <>
            <div className="products-grid">
              {currentProducts.map((product, index) => (
                <motion.div
                  key={product.id}
                  className="product-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.05 }}
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
                      {product.hasVariants && product.variants?.length > 0 ? (
                        <div className="product-price">
                          <span className="price-from">يبدأ من</span>
                          <span className="price-value">
                            {Math.min(...product.variants.map((v) => v.price))}{" "}
                            ₪
                          </span>
                        </div>
                      ) : (
                        <div className="product-price">{product.price} ₪</div>
                      )}
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
                  </Link>
                </motion.div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="products-pagination">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (number) => (
                    <button
                      key={number}
                      className={`page-btn ${
                        currentPage === number ? "active" : ""
                      }`}
                      onClick={() => paginate(number)}
                    >
                      {number}
                    </button>
                  )
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Products;
