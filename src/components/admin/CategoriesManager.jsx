import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useAlert } from "../../hooks/useAlert";
import CustomAlert from "../CustomAlert";
import "./AdminComponents.css";

const CategoriesManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const { alert, showSuccess, showError, showConfirm } = useAlert();
  const [formData, setFormData] = useState({
    name: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "categories"));
      const categoriesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setCategories(categoriesData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        // Update category
        const oldCategoryName = editingCategory.name;
        const newCategoryName = formData.name;

        // Update category document
        await updateDoc(doc(db, "categories", editingCategory.id), {
          name: newCategoryName,
        });

        // Update all products with this category using batch
        const productsQuery = query(
          collection(db, "products"),
          where("origin", "==", oldCategoryName)
        );
        const productsSnapshot = await getDocs(productsQuery);

        if (!productsSnapshot.empty) {
          const batch = writeBatch(db);
          productsSnapshot.docs.forEach((productDoc) => {
            batch.update(productDoc.ref, { origin: newCategoryName });
          });
          await batch.commit();
        }

        await showSuccess(
          `تم تحديث الفئة بنجاح${
            !productsSnapshot.empty
              ? ` وتحديث ${productsSnapshot.size} منتج`
              : ""
          }`
        );
      } else {
        // Add new category
        await addDoc(collection(db, "categories"), {
          name: formData.name,
          createdAt: new Date(),
        });
        await showSuccess("تم إضافة الفئة بنجاح");
      }

      fetchCategories();
      closeModal();
    } catch (error) {
      console.error("Error saving category:", error);
      await showError("حدث خطأ أثناء حفظ الفئة");
    }
  };

  const handleDelete = async (id, categoryName) => {
    // Check if category is used in products
    const productsQuery = query(
      collection(db, "products"),
      where("origin", "==", categoryName)
    );
    const productsSnapshot = await getDocs(productsQuery);

    if (!productsSnapshot.empty) {
      await showError(
        `لا يمكن حذف هذه الفئة لأنها مستخدمة في ${productsSnapshot.size} منتج`
      );
      return;
    }

    const confirmed = await showConfirm("هل أنت متأكد من حذف هذه الفئة؟");
    if (confirmed) {
      try {
        await deleteDoc(doc(db, "categories", id));
        fetchCategories();
        await showSuccess("تم حذف الفئة بنجاح");
      } catch (error) {
        console.error("Error deleting category:", error);
        await showError("حدث خطأ أثناء حذف الفئة");
      }
    }
  };

  const openModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: "",
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  // Filter categories based on search
  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="products-manager">
      <div className="manager-header">
        <h2>الفئات ({filteredCategories.length})</h2>
        <button className="add-btn" onClick={() => openModal()}>
          <FontAwesomeIcon icon={faPlus} />
          <span>إضافة فئة جديدة</span>
        </button>
      </div>

      <div className="search-filter-section">
        <input
          type="text"
          className="search-input"
          placeholder="البحث عن فئة..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>الاسم</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {filteredCategories.map((category) => (
              <tr key={category.id}>
                <td>{category.name}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn edit"
                      onClick={() => openModal(category)}
                      title="تعديل"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDelete(category.id, category.name)}
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

      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingCategory ? "تعديل الفئة" : "إضافة فئة جديدة"}</h3>
              <button className="close-btn" onClick={closeModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
              <div className="modal-body">
                <div className="form-group">
                  <label>اسم الفئة</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="مثال: شرقية، غربية، كيك"
                    required
                  />
                </div>

                {editingCategory && (
                  <div className="warning-message">
                    <strong>ملاحظة:</strong> عند تعديل اسم الفئة، سيتم تحديث
                    جميع المنتجات المرتبطة بها تلقائياً.
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  <FontAwesomeIcon icon={faSave} />
                  <span>حفظ</span>
                </button>
                <button
                  type="button"
                  className="cancel-btn"
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

export default CategoriesManager;
