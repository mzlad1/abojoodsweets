import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Marquee from "react-fast-marquee";
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

  return (
    <section className="partners-section">
      {/* <div className="container">
        <h2>شركاؤنا المميزون</h2>
      </div> */}
      <div className="partners-marquee">
        <Marquee
          gradient={true}
          gradientColor={[250, 248, 245]}
          gradientWidth={50}
          speed={40}
          pauseOnHover={true}
          direction="left"
          style={{ direction: "ltr" }}
        >
          {partners.map((partner) => (
            <div key={partner.id} className="partner-item">
              <img
                src={partner.logo}
                alt={partner.name}
                className="partner-logo"
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
};

export default Partners;
