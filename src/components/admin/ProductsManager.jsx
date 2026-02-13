import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faEye,
  faEyeSlash,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useAlert } from "../../hooks/useAlert";
import CustomAlert from "../CustomAlert";
import "./ProductsManager.css";

const ProductsManager = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [mainImagePreview, setMainImagePreview] = useState("");
  const [additionalImagesPreview, setAdditionalImagesPreview] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const { alert, showSuccess, showError, showConfirm } = useAlert();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    origin: "شرقية",
    unit: "كيلو",
    weight: "",
    size: "",
    hasVariants: false,
    variants: [],
    hasFillings: false,
    freeFillings: [],
    paidFillings: [],
    mainImage: "",
    mainImageFile: null,
    additionalImages: [],
    additionalImagesFiles: [],
    ingredients: [],
    featured: false,
    visible: true,
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productsData);
      setCurrentPage(1); // Reset to first page when products are updated
      setLoading(false);
    } catch (error) {
      console.error("Error fetching products:", error);
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const categoriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoriesData);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayInput = (field, value) => {
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item);
    setFormData((prev) => ({ ...prev, [field]: items }));
  };

  const handleMainImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          const maxWidth = 800;
          const maxHeight = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height *= maxWidth / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width *= maxHeight / height;
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
          setMainImagePreview(compressedDataUrl);
          setFormData((prev) => ({ ...prev, mainImage: compressedDataUrl }));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAdditionalImagesChange = (e) => {
    const files = Array.from(e.target.files);
    const filePromises = files.map((file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            const maxWidth = 800;
            const maxHeight = 800;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, width, height);

            const compressedDataUrl = canvas.toDataURL("image/jpeg", 0.7);
            resolve(compressedDataUrl);
          };
          img.src = reader.result;
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(filePromises).then((results) => {
      setAdditionalImagesPreview(results);
      setFormData((prev) => ({ ...prev, additionalImages: results }));
    });
  };

  const addVariant = () => {
    setFormData((prev) => ({
      ...prev,
      variants: [...prev.variants, { size: "", price: "" }],
    }));
  };

  const removeVariant = (index) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.filter((_, i) => i !== index),
    }));
  };

  const updateVariant = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      variants: prev.variants.map((variant, i) =>
        i === index ? { ...variant, [field]: value } : variant
      ),
    }));
  };

  const addFreeFilling = () => {
    setFormData((prev) => ({
      ...prev,
      freeFillings: [...prev.freeFillings, ""],
    }));
  };

  const removeFreeFilling = (index) => {
    setFormData((prev) => ({
      ...prev,
      freeFillings: prev.freeFillings.filter((_, i) => i !== index),
    }));
  };

  const updateFreeFilling = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      freeFillings: prev.freeFillings.map((filling, i) =>
        i === index ? value : filling
      ),
    }));
  };

  const addPaidFilling = () => {
    setFormData((prev) => ({
      ...prev,
      paidFillings: [
        ...prev.paidFillings,
        { name: "", smallPrice: "", largePrice: "" },
      ],
    }));
  };

  const removePaidFilling = (index) => {
    setFormData((prev) => ({
      ...prev,
      paidFillings: prev.paidFillings.filter((_, i) => i !== index),
    }));
  };

  const updatePaidFilling = (index, field, value) => {
    setFormData((prev) => ({
      ...prev,
      paidFillings: prev.paidFillings.map((filling, i) =>
        i === index ? { ...filling, [field]: value } : filling
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        price: formData.hasVariants ? 0 : parseFloat(formData.price),
        variants: formData.hasVariants
          ? formData.variants.map((v) => ({
              size: v.size,
              price: parseFloat(v.price),
            }))
          : [],
        freeFillings: formData.hasFillings
          ? formData.freeFillings.filter((f) => f.trim())
          : [],
        paidFillings: formData.hasFillings
          ? formData.paidFillings.map((f) => ({
              name: f.name,
              smallPrice: parseFloat(f.smallPrice) || 0,
              largePrice: parseFloat(f.largePrice) || 0,
            }))
          : [],
      };

      if (editingProduct) {
        await updateDoc(doc(db, "products", editingProduct.id), productData);
      } else {
        await addDoc(collection(db, "products"), productData);
      }

      fetchProducts();
      closeModal();
      await showSuccess("تم حفظ المنتج بنجاح");
    } catch (error) {
      console.error("Error saving product:", error);
      await showError("حدث خطأ أثناء حفظ المنتج");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirm("هل أنت متأكد من حذف هذا المنتج؟");
    if (confirmed) {
      try {
        await deleteDoc(doc(db, "products", id));
        fetchProducts();
        await showSuccess("تم حذف المنتج بنجاح");
      } catch (error) {
        console.error("Error deleting product:", error);
        await showError("حدث خطأ أثناء حذف المنتج");
      }
    }
  };

  const toggleVisibility = async (product) => {
    try {
      await updateDoc(doc(db, "products", product.id), {
        visible: !product.visible,
      });
      fetchProducts();
    } catch (error) {
      console.error("Error toggling visibility:", error);
    }
  };

  const openModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setMainImagePreview(product.mainImage);
      setAdditionalImagesPreview(product.additionalImages || []);
      setFormData({
        name: product.name,
        description: product.description || "",
        price: product.price,
        origin: product.origin,
        unit: product.unit || "كيلو",
        weight: product.weight || "",
        size: product.size || "",
        hasVariants: product.hasVariants || false,
        variants: product.variants || [],
        hasFillings: product.hasFillings || false,
        freeFillings: product.freeFillings || [],
        paidFillings: product.paidFillings || [],
        mainImage: product.mainImage,
        additionalImages: product.additionalImages || [],
        ingredients: product.ingredients || [],
        featured: product.featured,
        visible: product.visible,
      });
    } else {
      setEditingProduct(null);
      setMainImagePreview("");
      setAdditionalImagesPreview([]);
      setFormData({
        name: "",
        description: "",
        price: "",
        origin: "شرقية",
        unit: "كيلو",
        weight: "",
        size: "",
        hasVariants: false,
        variants: [],
        hasFillings: false,
        freeFillings: [],
        paidFillings: [],
        mainImage: "",
        additionalImages: [],
        ingredients: [],
        featured: false,
        visible: true,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  // Filter and search logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory
      ? product.origin === filterCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="products-manager">
      <div className="manager-header">
        <h2>المنتجات ({filteredProducts.length})</h2>
        <button className="add-btn" onClick={() => openModal()}>
          <FontAwesomeIcon icon={faPlus} />
          <span>إضافة منتج جديد</span>
        </button>
      </div>

      <div className="search-filter-section">
        <input
          type="text"
          className="search-input"
          placeholder="البحث عن منتج..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
        <select
          className="filter-select"
          value={filterCategory}
          onChange={(e) => {
            setFilterCategory(e.target.value);
            setCurrentPage(1);
          }}
        >
          <option value="">جميع الفئات</option>
          {categories.map((category) => (
            <option key={category.id} value={category.name}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>الصورة</th>
              <th>الاسم</th>
              <th>السعر</th>
              <th>الفئة</th>
              <th>مميز</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product) => (
              <tr key={product.id}>
                <td>
                  <img
                    src={product.mainImage}
                    alt={product.name}
                    className="product-thumbnail"
                    onError={(e) => {
                      e.target.src = "/assets/placeholder.png";
                    }}
                  />
                </td>
                <td>{product.name}</td>
                <td>{product.price} ₪</td>
                <td>{product.origin}</td>
                <td>{product.featured ? "نعم" : "لا"}</td>
                <td>
                  <span
                    className={`status-badge ${
                      product.visible ? "active" : "inactive"
                    }`}
                  >
                    {product.visible ? "ظاهر" : "مخفي"}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn edit"
                      onClick={() => openModal(product)}
                      title="تعديل"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="action-btn visibility"
                      onClick={() => toggleVisibility(product)}
                      title={product.visible ? "إخفاء" : "إظهار"}
                    >
                      <FontAwesomeIcon
                        icon={product.visible ? faEyeSlash : faEye}
                      />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDelete(product.id)}
                      title="حذف"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={prevPage}
            disabled={currentPage === 1}
          >
            السابق
          </button>

          <div className="pagination-numbers">
            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index + 1}
                className={`pagination-number ${
                  currentPage === index + 1 ? "active" : ""
                }`}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            className="pagination-btn"
            onClick={nextPage}
            disabled={currentPage === totalPages}
          >
            التالي
          </button>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingProduct ? "تعديل المنتج" : "إضافة منتج جديد"}</h3>
              <button className="close-btn" onClick={closeModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
              <div className="modal-body">
                <div className="form-row">
                  <div className="form-group">
                    <label>اسم المنتج</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>السعر (شيكل)</label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      required={!formData.hasVariants}
                      disabled={formData.hasVariants}
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>الفئة</label>
                  <select
                    name="origin"
                    value={formData.origin}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">اختر الفئة</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                  {categories.length === 0 && (
                    <small
                      style={{
                        color: "#dc3545",
                        marginTop: "0.5rem",
                        display: "block",
                      }}
                    >
                      يجب إضافة فئة واحدة على الأقل من قسم إدارة الفئات
                    </small>
                  )}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>الوحدة</label>
                    <select
                      name="unit"
                      value={formData.unit}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="كيلو">كيلو</option>
                      <option value="قالب">قالب</option>
                      <option value="حبة">حبة</option>
                      <option value="كاسة">كاسة</option>
                      <option value="علبة">علبة</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>الوزن (غرام) - اختياري</label>
                    <input
                      type="text"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="مثال: 350، 1000"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>الحجم / عدد القطع - اختياري</label>
                  <input
                    type="text"
                    name="size"
                    value={formData.size}
                    onChange={handleInputChange}
                    placeholder="مثال: وسط - 16 قطعة، صغير، كبير"
                  />
                </div>

                <div className="form-group">
                  <label>الوصف</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>الصورة الرئيسية</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleMainImageChange}
                    required={!editingProduct}
                  />
                  {mainImagePreview && (
                    <div className="image-preview">
                      <img src={mainImagePreview} alt="معاينة" />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>الصور الإضافية</label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleAdditionalImagesChange}
                  />
                  {additionalImagesPreview.length > 0 && (
                    <div className="images-preview-grid">
                      {additionalImagesPreview.map((preview, index) => (
                        <div key={index} className="image-preview-item">
                          <img src={preview} alt={`معاينة ${index + 1}`} />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>المكونات (مفصولة بفاصلة)</label>
                  <input
                    type="text"
                    value={formData.ingredients.join(", ")}
                    onChange={(e) =>
                      handleArrayInput("ingredients", e.target.value)
                    }
                    placeholder="طحين, سمنة, سكر"
                  />
                </div>

                <div className="form-checkboxes">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                    />
                    <span>منتج مميز</span>
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="visible"
                      checked={formData.visible}
                      onChange={handleInputChange}
                    />
                    <span>ظاهر للعملاء</span>
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="hasVariants"
                      checked={formData.hasVariants}
                      onChange={handleInputChange}
                    />
                    <span>المنتج له أحجام مختلفة</span>
                  </label>

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="hasFillings"
                      checked={formData.hasFillings}
                      onChange={handleInputChange}
                    />
                    <span>المنتج له حشوات (قوالب كيك)</span>
                  </label>
                </div>

                {formData.hasVariants && (
                  <div className="variants-section">
                    <h4>الأحجام والأسعار</h4>
                    {formData.variants.map((variant, index) => (
                      <div key={index} className="variant-item">
                        <input
                          type="text"
                          placeholder="الحجم (مثال: صغير، وسط، كبير)"
                          value={variant.size}
                          onChange={(e) =>
                            updateVariant(index, "size", e.target.value)
                          }
                          required
                        />
                        <input
                          type="number"
                          placeholder="السعر"
                          value={variant.price}
                          onChange={(e) =>
                            updateVariant(index, "price", e.target.value)
                          }
                          min="0"
                          step="0.01"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => removeVariant(index)}
                          className="remove-variant-btn"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addVariant}
                      className="add-variant-btn"
                    >
                      <FontAwesomeIcon icon={faPlus} /> إضافة حجم
                    </button>
                  </div>
                )}

                {formData.hasFillings && (
                  <div className="fillings-section">
                    <h4>الحشوات المجانية</h4>
                    <p className="fillings-note">حشوتين مجانيتين مع كل قالب</p>
                    {formData.freeFillings.map((filling, index) => (
                      <div key={index} className="filling-item">
                        <input
                          type="text"
                          placeholder="اسم الحشوة (مثال: بلوبيري، كراميل)"
                          value={filling}
                          onChange={(e) =>
                            updateFreeFilling(index, e.target.value)
                          }
                          required
                        />
                        <button
                          type="button"
                          onClick={() => removeFreeFilling(index)}
                          className="remove-filling-btn"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addFreeFilling}
                      className="add-filling-btn"
                    >
                      <FontAwesomeIcon icon={faPlus} /> إضافة حشوة مجانية
                    </button>

                    <h4 style={{ marginTop: "2rem" }}>الحشوات المدفوعة</h4>
                    <p className="fillings-note">
                      حشوات إضافية: +10 شيكل للقالب الصغير، +20 شيكل للكبير
                    </p>
                    {formData.paidFillings.map((filling, index) => (
                      <div key={index} className="paid-filling-item">
                        <input
                          type="text"
                          placeholder="اسم الحشوة (مثال: فواكه، أوريو، نوتيلا)"
                          value={filling.name}
                          onChange={(e) =>
                            updatePaidFilling(index, "name", e.target.value)
                          }
                          required
                        />
                        <input
                          type="number"
                          placeholder="سعر القالب الصغير"
                          value={filling.smallPrice}
                          onChange={(e) =>
                            updatePaidFilling(
                              index,
                              "smallPrice",
                              e.target.value
                            )
                          }
                          min="0"
                          step="0.01"
                          required
                        />
                        <input
                          type="number"
                          placeholder="سعر القالب الكبير"
                          value={filling.largePrice}
                          onChange={(e) =>
                            updatePaidFilling(
                              index,
                              "largePrice",
                              e.target.value
                            )
                          }
                          min="0"
                          step="0.01"
                          required
                        />
                        <button
                          type="button"
                          onClick={() => removePaidFilling(index)}
                          className="remove-filling-btn"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addPaidFilling}
                      className="add-filling-btn"
                    >
                      <FontAwesomeIcon icon={faPlus} /> إضافة حشوة مدفوعة
                    </button>
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="submit" className="products-save-btn">
                  <FontAwesomeIcon icon={faSave} />
                  <span>حفظ</span>
                </button>
                <button
                  type="button"
                  className="products-cancel-btn"
                  onClick={closeModal}
                >
                  إلغاء
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {alert && <CustomAlert {...alert} />}
    </div>
  );
};

export default ProductsManager;
