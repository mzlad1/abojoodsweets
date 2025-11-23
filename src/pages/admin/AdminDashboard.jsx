import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBoxOpen,
  faTags,
  faUsers,
  faSignOutAlt,
  faBars,
  faTimes,
  faList,
  faHandshake,
  faImages,
} from "@fortawesome/free-solid-svg-icons";
import ProductsManager from "../../components/admin/ProductsManager";
import OffersManager from "../../components/admin/OffersManager";
import UsersManager from "../../components/admin/UsersManager";
import CategoriesManager from "../../components/admin/CategoriesManager";
import PartnersManager from "../../components/admin/PartnersManager";
import GalleryManager from "../../components/admin/GalleryManager";
import "./AdminDashboard.css";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("products");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/admin/login");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const tabs = [
    { id: "products", label: "إدارة المنتجات", icon: faBoxOpen },
    { id: "categories", label: "إدارة الفئات", icon: faList },
    { id: "offers", label: "إدارة العروض", icon: faTags },
    { id: "partners", label: "إدارة الشركاء", icon: faHandshake },
    { id: "gallery", label: "معرض الصور", icon: faImages },
    { id: "users", label: "إدارة المستخدمين", icon: faUsers },
  ];

  return (
    <div className="admin-dashboard">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="sidebar-header">
          <div className="dashboard-logo">
            <img
              src="/assets/abojoodlogo.png"
              alt="حلويات أبو الجود"
              className="logo-image"
            />{" "}
            {sidebarOpen && <h2>لوحة التحكم</h2>}
          </div>
          <button
            className="toggle-sidebar-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FontAwesomeIcon icon={sidebarOpen ? faTimes : faBars} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => {
                setActiveTab(tab.id);
                // Close sidebar on mobile after selecting
                if (window.innerWidth <= 768) {
                  setSidebarOpen(false);
                }
              }}
            >
              <FontAwesomeIcon icon={tab.icon} />
              {sidebarOpen && <span>{tab.label}</span>}
            </button>
          ))}

          <button className="nav-item logout-btn" onClick={handleLogout}>
            <FontAwesomeIcon icon={faSignOutAlt} />
            {sidebarOpen && <span>تسجيل الخروج</span>}
          </button>
        </nav>
      </div>

      <div className="dashboard-content">
        {/* Mobile Tabs Row */}
        <div className="mobile-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`mobile-tab-item ${
                activeTab === tab.id ? "active" : ""
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <FontAwesomeIcon icon={tab.icon} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="content-header">
          <h1>{tabs.find((tab) => tab.id === activeTab)?.label}</h1>
        </div>

        <div className="content-body">
          {activeTab === "products" && <ProductsManager />}
          {activeTab === "categories" && <CategoriesManager />}
          {activeTab === "offers" && <OffersManager />}
          {activeTab === "partners" && <PartnersManager />}
          {activeTab === "gallery" && <GalleryManager />}
          {activeTab === "users" && <UsersManager />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
