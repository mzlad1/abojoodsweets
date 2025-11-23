# حلويات أبو الجود - Abo Jood Sweets

موقع إلكتروني متكامل لعرض وإدارة منتجات حلويات أبو الجود مع لوحة تحكم إدارية.

## المميزات

### للزوار:

- 🏠 صفحة رئيسية جذابة مع عرض ديناميكي للنصوص
- 🍰 عرض جميع المنتجات مع إمكانية البحث والفلترة حسب الفئة
- 📄 صفحة تفاصيل المنتج مع معرض صور
- 💰 عرض العروض الخاصة
- 📱 زر الطلب المباشر عبر الواتساب
- ℹ️ صفحة من نحن
- 📞 صفحة تواصل معنا

### للمدراء:

- 🔐 نظام تسجيل دخول آمن
- 📦 إدارة المنتجات (إضافة، تعديل، حذف، إخفاء/إظهار)
- 🏷️ إدارة العروض الخاصة
- 👥 إدارة المستخدمين والصلاحيات

## التقنيات المستخدمة

- **React 18** - مكتبة بناء واجهات المستخدم
- **Vite** - أداة بناء سريعة
- **React Router** - للتنقل بين الصفحات
- **Firebase** - قاعدة البيانات والمصادقة
  - Firestore - قاعدة بيانات
  - Authentication - نظام المصادقة
  - Storage - تخزين الصور
- **Framer Motion** - الحركات والانتقالات
- **Font Awesome** - الأيقونات

## البدء

### 1. تثبيت المتطلبات

```bash
npm install
```

### 2. إعداد Firebase

1. أنشئ مشروع جديد في [Firebase Console](https://console.firebase.google.com/)
2. فعّل Firestore Database
3. فعّل Authentication (Email/Password)
4. فعّل Storage
5. انسخ بيانات التكوين من إعدادات المشروع

### 3. إعداد متغيرات البيئة

أنشئ ملف `.env` في المجلد الرئيسي وأضف:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. إعداد قاعدة البيانات

أنشئ المجموعات (Collections) التالية في Firestore:

#### products

```json
{
  "name": "بقلاوة فستق حلبي",
  "description": "نحن نقدم لك الحلوى التي تجعل كل يوم أفضل",
  "price": 65,
  "origin": "شرقية",
  "mainImage": "https://example.com/image.jpg",
  "additionalImages": [],
  "ingredients": ["طحين", "سمنة حيواني", "قطر", "فستق حلبي"],
  "featured": true,
  "visible": true
}
```

#### offers

```json
{
  "title": "عرض خاص",
  "description": "خصم على جميع الحلويات الشرقية",
  "image": "https://example.com/offer.jpg",
  "discount": 20,
  "active": true
}
```

#### users (تُنشأ تلقائياً)

```json
{
  "email": "admin@example.com",
  "displayName": "Admin",
  "role": "admin",
  "createdAt": "timestamp"
}
```

### 5. تشغيل المشروع

```bash
npm run dev
```

المشروع سيعمل على: http://localhost:5173

### 6. بناء للإنتاج

```bash
npm run build
```

## الصفحات

- `/` - الصفحة الرئيسية
- `/products` - صفحة المنتجات
- `/product/:id` - تفاصيل المنتج
- `/about` - من نحن
- `/contact` - تواصل معنا
- `/admin/login` - تسجيل دخول المدير
- `/admin/dashboard` - لوحة التحكم

## الألوان المستخدمة

```css
--primary-color: #d4a762;
--secondary-color: #8b4513;
--accent-color: #e6b873;
```

## معلومات التواصل

- 📱 واتساب: 0592198804
- ☎️ هاتف: 022817522
- 📍 الفرع الأول: ابو قش - الشارع الرئيسي
- 📍 الفرع الثاني: المزعة الغربية - وسط البلد
- ⏰ أوقات العمل: يومياً من 11 ظهراً حتى 11 ليلاً

## الترخيص

جميع الحقوق محفوظة © 2025 حلويات أبو الجود
