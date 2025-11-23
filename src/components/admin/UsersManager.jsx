import { useState, useEffect } from "react";
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faShield, faUser } from "@fortawesome/free-solid-svg-icons";
import { useAlert } from "../../hooks/useAlert";
import CustomAlert from "../CustomAlert";
import "./AdminComponents.css";

const UsersManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { alert, showSuccess, showError, showConfirm } = useAlert();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "users"));
      const usersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(usersData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching users:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = await showConfirm("هل أنت متأكد من حذف هذا المستخدم؟");
    if (confirmed) {
      try {
        await deleteDoc(doc(db, "users", id));
        fetchUsers();
        await showSuccess("تم حذف المستخدم بنجاح");
      } catch (error) {
        console.error("Error deleting user:", error);
        await showError("حدث خطأ أثناء حذف المستخدم");
      }
    }
  };

  const toggleRole = async (user) => {
    try {
      const newRole = user.role === "admin" ? "user" : "admin";
      await updateDoc(doc(db, "users", user.id), {
        role: newRole,
      });
      fetchUsers();
    } catch (error) {
      console.error("Error updating user role:", error);
      alert("حدث خطأ أثناء تحديث صلاحيات المستخدم");
    }
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
        <h2>المستخدمون ({users.length})</h2>
      </div>

      {users.length === 0 ? (
        <div className="no-data">
          <p>لا يوجد مستخدمون مسجلون</p>
        </div>
      ) : (
        <div className="products-table">
          <table>
            <thead>
              <tr>
                <th>البريد الإلكتروني</th>
                <th>الاسم</th>
                <th>الصلاحيات</th>
                <th>تاريخ التسجيل</th>
                <th>الإجراءات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.email}</td>
                  <td>{user.displayName || "-"}</td>
                  <td>
                    <span
                      className={`status-badge ${
                        user.role === "admin" ? "active" : "inactive"
                      }`}
                    >
                      <FontAwesomeIcon
                        icon={user.role === "admin" ? faShield : faUser}
                      />
                      {user.role === "admin" ? " مدير" : " مستخدم"}
                    </span>
                  </td>
                  <td>
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("ar")
                      : "-"}
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="action-btn edit"
                        onClick={() => toggleRole(user)}
                        title="تغيير الصلاحيات"
                      >
                        <FontAwesomeIcon icon={faShield} />
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => handleDelete(user.id)}
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
      )}
      {alert && <CustomAlert {...alert} />}
    </div>
  );
};

export default UsersManager;
