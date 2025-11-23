import { useEffect, useState } from "react";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../firebase";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImages, faTimes, faPlay } from "@fortawesome/free-solid-svg-icons";
import "./Gallery.css";

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

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

  const openLightbox = (image) => {
    setSelectedImage(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="gallery-page">
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="gallery-page">
      <div className="gallery-header">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <FontAwesomeIcon icon={faImages} className="gallery-header-icon" />
          <h1>معرض الصور</h1>
          <p>لحظات مميزة من مناسباتكم السعيدة</p>
        </motion.div>
      </div>

      {images.length === 0 ? (
        <div className="gallery-empty">
          <FontAwesomeIcon icon={faImages} />
          <p>لا توجد صور في المعرض حالياً</p>
        </div>
      ) : (
        <div className="container">
          <div className="gallery-masonry">
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                className="gallery-masonry-item"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
                onClick={() => openLightbox(image)}
              >
                {image.type === "video" ? (
                  <>
                    <video src={image.imageUrl} muted />
                    <div className="video-play-icon">
                      <FontAwesomeIcon icon={faPlay} />
                    </div>
                  </>
                ) : (
                  <img src={image.imageUrl} alt="Gallery" />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Lightbox */}
      {selectedImage && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
          <div
            className="lightbox-content"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedImage.type === "video" ? (
              <video
                src={selectedImage.imageUrl}
                controls
                autoPlay
                controlsList="nodownload"
                onContextMenu={(e) => e.preventDefault()}
              />
            ) : (
              <img
                src={selectedImage.imageUrl}
                alt="Gallery"
                onContextMenu={(e) => e.preventDefault()}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
