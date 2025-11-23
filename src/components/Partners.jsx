import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import "./Partners.css";

const Partners = () => {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "partners"));
      const partnersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPartners(partnersData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching partners:", error);
      setLoading(false);
    }
  };

  if (loading || partners.length === 0) {
    return null;
  }

  // Duplicate partners for seamless infinite scroll
  const duplicatedPartners = [...partners, ...partners];

  return (
    <section className="partners-section">
      <div className="container">
        <h2>شركاؤنا المميزون</h2>
      </div>
      <div className="partners-marquee">
        <div className="partners-track">
          {duplicatedPartners.map((partner, index) => (
            <div key={`${partner.id}-${index}`} className="partner-item">
              <img
                src={partner.logo}
                alt={partner.name}
                className="partner-logo"
              />
              <span className="partner-name">{partner.name}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Partners;
