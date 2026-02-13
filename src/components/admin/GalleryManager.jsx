import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  orderBy,
  query,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faImage } from "@fortawesome/free-solid-svg-icons";
import { useAlert } from "../../hooks/useAlert";
import CustomAlert from "../CustomAlert";
import "./AdminComponents.css";

const GalleryManager = () => {
  const { alert, showAlert } = useAlert();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [imagesPerPage] = useState(20);

  const [selectedImages, setSelectedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const q = query(collection(db, "gallery"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const imagesData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setImages(imagesData);
    } catch (error) {
      console.error("Error fetching gallery images:", error);
      setImages([]);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setSelectedImages(files);

      // Generate previews
      const previews = [];
      files.forEach((file) => {
        const isVideo = file.type.startsWith("video/");
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push({
            url: reader.result,
            type: isVideo ? "video" : "image",
          });
          if (previews.length === files.length) {
            setImagePreviews([...previews]);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };
  const uploadImage = async (file) => {
    try {
      const timestamp = Date.now();
      const storageRef = ref(storage, `gallery/${timestamp}_${file.name}`);
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    } catch (error) {
      console.error("Error uploading image:", error);
      throw error;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (selectedImages.length === 0) {
      showAlert("يرجى اختيار ملف واحد على الأقل", "error");
      return;
    }

    try {
      setUploading(true);

      // Upload all files (images and videos)
      const uploadPromises = selectedImages.map(async (file) => {
        const fileUrl = await uploadImage(file);
        const isVideo = file.type.startsWith("video/");
        const fileData = {
          imageUrl: fileUrl,
          type: isVideo ? "video" : "image",
          createdAt: new Date().toISOString(),
        };
        return addDoc(collection(db, "gallery"), fileData);
      });

      await Promise.all(uploadPromises);

      showAlert(`تم إضافة ${selectedImages.length} ملف بنجاح`, "success");

      fetchImages();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving files:", error);
      showAlert("فشل في حفظ الملفات", "error");
    } finally {
      setUploading(false);
    }
  };
  const handleDelete = async (id, imageUrl) => {
    if (window.confirm("هل أنت متأكد من حذف هذه الصورة؟")) {
      try {
        // Delete image from storage
        if (imageUrl) {
          try {
            const imageRef = ref(storage, imageUrl);
            await deleteObject(imageRef);
          } catch (error) {
            console.error("Error deleting image:", error);
          }
        }

        // Delete image from Firestore
        await deleteDoc(doc(db, "gallery", id));
        showAlert("تم حذف الصورة بنجاح", "success");
        fetchImages();
      } catch (error) {
        console.error("Error deleting image:", error);
        showAlert("فشل في حذف الصورة", "error");
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedImages([]);
    setImagePreviews([]);
  };

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
      </div>
    );
  }

  // Pagination logic
  const indexOfLastImage = currentPage * imagesPerPage;
  const indexOfFirstImage = indexOfLastImage - imagesPerPage;
  const currentImages = images.slice(indexOfFirstImage, indexOfLastImage);
  const totalPages = Math.ceil(images.length / imagesPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  return (
    <div className="gallery-manager-section">
      {alert && <CustomAlert {...alert} />}
      <div className="gallery-manager-header">
        <h2>إدارة معرض الصور ({images.length})</h2>
        <button className="gallery-add-btn" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faPlus} /> إضافة صورة
        </button>
      </div>

      {images.length === 0 ? (
        <div className="gallery-empty-state">
          <p>لا توجد صور في المعرض حالياً</p>
        </div>
      ) : (
        <>
          <div className="gallery-images-grid">
            {currentImages.map((image) => (
              <div key={image.id} className="gallery-image-card">
                <div className="gallery-image-preview">
                  {image.type === "video" ? (
                    <video src={image.imageUrl} controls muted />
                  ) : (
                    <img src={image.imageUrl} alt="Gallery" />
                  )}
                  <button
                    className="gallery-delete-btn-overlay"
                    onClick={() => handleDelete(image.id, image.imageUrl)}
                  >
                    <FontAwesomeIcon icon={faTrash} />
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
        <div className="gallery-modal-overlay" onClick={handleCloseModal}>
          <div
            className="gallery-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <h3>إضافة صور جديدة</h3>
            <form onSubmit={handleSubmit}>
              <div className="gallery-form-group">
                <label>اختر الصور أو الفيديوهات *</label>
                <div className="gallery-image-upload">
                  <input
                    type="file"
                    accept="image/*,video/*"
                    onChange={handleImageChange}
                    id="gallery-image-upload"
                    multiple
                  />
                  <label
                    htmlFor="gallery-image-upload"
                    className="gallery-upload-label"
                  >
                    <FontAwesomeIcon icon={faImage} />
                    {selectedImages.length > 0
                      ? `تم اختيار ${selectedImages.length} ملف`
                      : "اختر صور أو فيديوهات"}
                  </label>
                </div>
                {imagePreviews.length > 0 && (
                  <div className="gallery-images-preview-grid">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="gallery-preview-item">
                        {preview.type === "video" ? (
                          <video src={preview.url} muted />
                        ) : (
                          <img src={preview.url} alt={`Preview ${index + 1}`} />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="gallery-modal-actions">
                <button
                  type="button"
                  className="gallery-cancel-btn"
                  onClick={handleCloseModal}
                  disabled={uploading}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="gallery-submit-btn"
                  disabled={uploading}
                >
                  {uploading
                    ? "جاري الرفع..."
                    : `إضافة ${
                        selectedImages.length > 0 ? selectedImages.length : ""
                      } ملف`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryManager;
