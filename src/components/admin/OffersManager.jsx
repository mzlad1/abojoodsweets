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
  faToggleOn,
  faToggleOff,
  faSave,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { useAlert } from "../../hooks/useAlert";
import CustomAlert from "../CustomAlert";
import "./AdminComponents.css";

const OffersManager = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const { alert, showSuccess, showError, showConfirm } = useAlert();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: "",
    discount: "",
    active: true,
  });

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "offers"));
      const offersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOffers(offersData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching offers:", error);
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
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
          setImagePreview(compressedDataUrl);
          setFormData((prev) => ({ ...prev, image: compressedDataUrl }));
        };
        img.src = reader.result;
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const offerData = {
        ...formData,
        discount: formData.discount ? parseInt(formData.discount) : null,
      };

      if (editingOffer) {
        await updateDoc(doc(db, "offers", editingOffer.id), offerData);
      } else {
        await addDoc(collection(db, "offers"), offerData);
      }

      fetchOffers();
      closeModal();
      await showSuccess("تم حفظ العرض بنجاح");
    } catch (error) {
      console.error("Error saving offer:", error);
      await showError("حدث خطأ أثناء حفظ العرض");
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirm("هل أنت متأكد من حذف هذا العرض؟");
    if (confirmed) {
      try {
        await deleteDoc(doc(db, "offers", id));
        fetchOffers();
        await showSuccess("تم حذف العرض بنجاح");
      } catch (error) {
        console.error("Error deleting offer:", error);
        await showError("حدث خطأ أثناء حذف العرض");
      }
    }
  };

  const toggleActive = async (offer) => {
    try {
      await updateDoc(doc(db, "offers", offer.id), {
        active: !offer.active,
      });
      fetchOffers();
    } catch (error) {
      console.error("Error toggling offer:", error);
    }
  };

  const openModal = (offer = null) => {
    if (offer) {
      setEditingOffer(offer);
      setImagePreview(offer.image);
      setFormData({
        title: offer.title,
        description: offer.description,
        image: offer.image,
        discount: offer.discount || "",
        active: offer.active,
      });
    } else {
      setEditingOffer(null);
      setImagePreview("");
      setFormData({
        title: "",
        description: "",
        image: "",
        discount: "",
        active: true,
      });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingOffer(null);
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="products-manager">
      <div className="manager-header">
        <h2>العروض ({offers.length})</h2>
        <button className="add-btn" onClick={() => openModal()}>
          <FontAwesomeIcon icon={faPlus} />
          <span>إضافة عرض جديد</span>
        </button>
      </div>

      <div className="products-table">
        <table>
          <thead>
            <tr>
              <th>الصورة</th>
              <th>العنوان</th>
              <th>الوصف</th>
              <th>الخصم</th>
              <th>الحالة</th>
              <th>الإجراءات</th>
            </tr>
          </thead>
          <tbody>
            {offers.map((offer) => (
              <tr key={offer.id}>
                <td>
                  <img
                    src={offer.image}
                    alt={offer.title}
                    className="product-thumbnail"
                  />
                </td>
                <td>{offer.title}</td>
                <td>{offer.description}</td>
                <td>{offer.discount ? `${offer.discount}%` : "-"}</td>
                <td>
                  <span
                    className={`status-badge ${
                      offer.active ? "active" : "inactive"
                    }`}
                  >
                    {offer.active ? "نشط" : "غير نشط"}
                  </span>
                </td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-btn edit"
                      onClick={() => openModal(offer)}
                      title="تعديل"
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </button>
                    <button
                      className="action-btn visibility"
                      onClick={() => toggleActive(offer)}
                      title={offer.active ? "تعطيل" : "تفعيل"}
                    >
                      <FontAwesomeIcon
                        icon={offer.active ? faToggleOff : faToggleOn}
                      />
                    </button>
                    <button
                      className="action-btn delete"
                      onClick={() => handleDelete(offer.id)}
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
              <h3>{editingOffer ? "تعديل العرض" : "إضافة عرض جديد"}</h3>
              <button className="close-btn" onClick={closeModal}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="product-form">
              <div className="modal-body">
                <div className="form-group">
                  <label>عنوان العرض</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>الوصف</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label>الصورة</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    required={!editingOffer}
                  />
                  {imagePreview && (
                    <div className="image-preview">
                      <img src={imagePreview} alt="معاينة" />
                    </div>
                  )}
                </div>

                <div className="form-group">
                  <label>نسبة الخصم (%)</label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleInputChange}
                    min="0"
                    max="100"
                    placeholder="اختياري"
                  />
                </div>

                <div className="form-checkboxes">
                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name="active"
                      checked={formData.active}
                      onChange={handleInputChange}
                    />
                    <span>عرض نشط</span>
                  </label>
                </div>
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

export default OffersManager;
