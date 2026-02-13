import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faEdit,
  faTrash,
  faImage,
} from "@fortawesome/free-solid-svg-icons";
import { useAlert } from "../../hooks/useAlert";
import CustomAlert from "../CustomAlert";
import "./AdminComponents.css";

const PartnersManager = () => {
  const { alert, showAlert } = useAlert();
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentPartner, setCurrentPartner] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [partnersPerPage] = useState(12);

  const [formData, setFormData] = useState({
    name: "",
    logo: null,
  });
  const [logoPreview, setLogoPreview] = useState("");

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(collection(db, "partners"));
      const partnersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPartners(partnersData);
    } catch (error) {
      console.error("Error fetching partners:", error);
      // Don't show alert on initial load - collection might not exist yet
      setPartners([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, logo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadLogo = async (file) => {
    try {
      const timestamp = Date.now();
      const storageRef = ref(storage, `partners/${timestamp}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading logo:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      showAlert("يرجى إدخال اسم الشريك", "error");
      return;
    }

    if (!currentPartner && !formData.logo) {
      showAlert("يرجى اختيار صورة الشعار", "error");
      return;
    }

    try {
      setUploading(true);

      let logoUrl = currentPartner?.logo || "";

      // Upload new logo if selected
      if (formData.logo) {
        logoUrl = await uploadLogo(formData.logo);

        // Delete old logo if updating
        if (currentPartner?.logo) {
          try {
            const oldLogoRef = ref(storage, currentPartner.logo);
            await deleteObject(oldLogoRef);
          } catch (error) {
            console.error("Error deleting old logo:", error);
          }
        }
      }

      const partnerData = {
        name: formData.name,
        logo: logoUrl,
        updatedAt: new Date().toISOString(),
      };

      if (currentPartner) {
        // Update existing partner
        await updateDoc(doc(db, "partners", currentPartner.id), partnerData);
        showAlert("تم تحديث الشريك بنجاح", "success");
      } else {
        // Add new partner
        partnerData.createdAt = new Date().toISOString();
        await addDoc(collection(db, "partners"), partnerData);
        showAlert("تم إضافة الشريك بنجاح", "success");
      }

      fetchPartners();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving partner:", error);
      showAlert("فشل في حفظ الشريك", "error");
    } finally {
      setUploading(false);
    }
  };

  const handleEdit = (partner) => {
    setCurrentPartner(partner);
    setFormData({
      name: partner.name,
      logo: null,
    });
    setLogoPreview(partner.logo);
    setShowModal(true);
  };

  const handleDelete = async (id, logoUrl) => {
    if (window.confirm("هل أنت متأكد من حذف هذا الشريك؟")) {
      try {
        // Delete logo from storage
        if (logoUrl) {
          try {
            const logoRef = ref(storage, logoUrl);
            await deleteObject(logoRef);
          } catch (error) {
            console.error("Error deleting logo:", error);
          }
        }

        // Delete partner from Firestore
        await deleteDoc(doc(db, "partners", id));
        showAlert("تم حذف الشريك بنجاح", "success");
        fetchPartners();
      } catch (error) {
        console.error("Error deleting partner:", error);
        showAlert("فشل في حذف الشريك", "error");
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentPartner(null);
    setFormData({
      name: "",
      logo: null,
    });
    setLogoPreview("");
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  // Filter and pagination logic
  const filteredPartners = partners.filter((partner) =>
    partner.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPartner = currentPage * partnersPerPage;
  const indexOfFirstPartner = indexOfLastPartner - partnersPerPage;
  const currentPartners = filteredPartners.slice(
    indexOfFirstPartner,
    indexOfLastPartner
  );
  const totalPages = Math.ceil(filteredPartners.length / partnersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="partners-manager-section">
      {alert && <CustomAlert {...alert} />}
      <div className="partners-manager-header">
        <h2>إدارة الشركاء</h2>
        <button className="partners-add-btn" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} /> إضافة شريك
        </button>
      </div>

      <div className="search-filter-section">
        <input
          type="text"
          className="search-input"
          placeholder="البحث عن شريك..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      {filteredPartners.length === 0 ? (
        <div className="partners-empty-state">
          <p>{searchTerm ? "لا توجد نتائج للبحث" : "لا يوجد شركاء حالياً"}</p>
        </div>
      ) : (
        <>
          <div className="partners-grid">
            {currentPartners.map((partner) => (
              <div key={partner.id} className="partner-card">
                <div className="partner-logo">
                  <img src={partner.logo} alt={partner.name} />
                </div>
                <div className="partner-info">
                  <h3>{partner.name}</h3>
                </div>
                <div className="partner-actions">
                  <button
                    className="partner-edit-btn"
                    onClick={() => handleEdit(partner)}
                  >
                    <FontAwesomeIcon icon={faEdit} /> تعديل
                  </button>
                  <button
                    className="partner-delete-btn"
                    onClick={() => handleDelete(partner.id, partner.logo)}
                  >
                    <FontAwesomeIcon icon={faTrash} /> حذف
                  </button>
                </div>
              </div>
            ))}
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
        </>
      )}

      {showModal && (
        <div className="partners-modal-overlay" onClick={handleCloseModal}>
          <div
            className="partners-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>{currentPartner ? "تعديل شريك" : "إضافة شريك جديد"}</h3>
            <form onSubmit={handleSubmit}>
              <div className="partners-form-group">
                <label>اسم الشريك *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="مثال: فندق الريتز"
                  required
                />
              </div>

              <div className="partners-form-group">
                <label>شعار الشريك {currentPartner ? "(اختياري)" : "*"}</label>
                <div className="partners-image-upload">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    id="partners-logo-upload"
                  />
                  <label
                    htmlFor="partners-logo-upload"
                    className="partners-upload-label"
                  >
                    <FontAwesomeIcon icon={faImage} />
                    {formData.logo ? "تم اختيار الصورة" : "اختر شعار الشريك"}
                  </label>
                </div>
                {logoPreview && (
                  <div className="partners-image-preview">
                    <img src={logoPreview} alt="Logo preview" />
                  </div>
                )}
              </div>

              <div className="partners-modal-actions">
                <button
                  type="button"
                  className="partners-cancel-btn"
                  onClick={handleCloseModal}
                  disabled={uploading}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="partners-submit-btn"
                  disabled={uploading}
                >
                  {uploading
                    ? "جاري الحفظ..."
                    : currentPartner
                    ? "تحديث"
                    : "إضافة"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PartnersManager;
