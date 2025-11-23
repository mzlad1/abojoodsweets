import { useState } from "react";
import {
  seedAll,
  seedCategories,
  seedProducts,
} from "../../utils/seedDatabase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDatabase,
  faCheckCircle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";
import "./DatabaseSeeder.css";

const DatabaseSeeder = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSeedAll = async () => {
    if (
      !window.confirm(
        "هل أنت متأكد من إضافة جميع البيانات؟ هذا سيضيف الفئات والمنتجات"
      )
    ) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await seedAll();
      setResult(response);
    } catch (error) {
      setResult({ success: false, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSeedCategories = async () => {
    if (!window.confirm("هل أنت متأكد من إضافة الفئات؟")) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await seedCategories();
      setResult(response);
    } catch (error) {
      setResult({ success: false, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleSeedProducts = async () => {
    if (!window.confirm("هل أنت متأكد من إضافة المنتجات؟")) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const response = await seedProducts();
      setResult(response);
    } catch (error) {
      setResult({ success: false, message: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="database-seeder">
      <div className="seeder-header">
        <FontAwesomeIcon icon={faDatabase} />
        <h2>إضافة البيانات إلى قاعدة البيانات</h2>
        <p>
          استخدم هذه الأدوات لإضافة الفئات والمنتجات من ملف categories and
          products.md
        </p>
      </div>

      <div className="seeder-actions">
        <button
          onClick={handleSeedAll}
          disabled={loading}
          className="seed-btn seed-all"
        >
          إضافة الكل (فئات + منتجات)
        </button>

        <button
          onClick={handleSeedCategories}
          disabled={loading}
          className="seed-btn seed-categories"
        >
          إضافة الفئات فقط
        </button>

        <button
          onClick={handleSeedProducts}
          disabled={loading}
          className="seed-btn seed-products"
        >
          إضافة المنتجات فقط
        </button>
      </div>

      {loading && (
        <div className="loading-message">
          <div className="spinner"></div>
          <p>جاري إضافة البيانات...</p>
        </div>
      )}

      {result && (
        <div
          className={`result-message ${result.success ? "success" : "error"}`}
        >
          <FontAwesomeIcon
            icon={result.success ? faCheckCircle : faTimesCircle}
          />
          <p>{result.message}</p>
        </div>
      )}

      <div className="seeder-notes">
        <h3>ملاحظات هامة:</h3>
        <ul>
          <li>
            سيتم إضافة 4 فئات: حلويات شرقية، غربي - قوالب كيك، غربي - كيك وكاسات
            بالحبة، غربي - كريبات
          </li>
          <li>
            سيتم إضافة أكثر من 60 منتج مع جميع التفاصيل (السعر، الوصف، المكونات،
            الوحدة، الوزن، الحجم)
          </li>
          <li>
            الصور ستكون placeholders - يجب استبدالها يدوياً من خلال تعديل المنتج
          </li>
          <li>إذا كانت الفئة أو المنتج موجود مسبقاً، لن يتم تكراره</li>
          <li>تأكد من الاتصال بالإنترنت قبل البدء</li>
        </ul>
      </div>
    </div>
  );
};

export default DatabaseSeeder;
