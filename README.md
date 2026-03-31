# 🛒 Shopping Bill Calculator

A modern React + Redux Toolkit application that allows users to select products, apply special offers, and calculate the final bill with savings. The app also integrates Firebase for data persistence and hosting.

---

## 🚀 Live Demo

👉 https://shopping-bill-9717f.web.app

---

## 🧑‍💻 Tech Stack

* **React + TypeScript**
* **Redux Toolkit** (state management)
* **Tailwind CSS** (UI styling)
* **Firebase**

  * Firestore (data storage)
  * Hosting (deployment)

---

## ✨ Features

### 🛍️ Product Management

* Products are dynamically fetched from Firebase Firestore
* Users can add items to cart

### 🛒 Cart Management

* Increment / Decrement product quantities
* Real-time state updates using Redux Toolkit

### 💰 Billing System

* Subtotal calculation
* Special offers applied automatically
* Individual savings displayed
* Final total after discounts

### 🎯 Special Offers

* Buy 1 Get 1 Free (Cheese)
* Soup + Bread discount
* Butter 1/3 off

### ☁️ Firebase Integration

* Products fetched from Firestore
* Cart is saved and restored on page refresh

### ⚡ UX Improvements

* Loading state while fetching data
* Prevents UI flicker on refresh
* Clean and responsive UI

---

## 🧠 Architecture

* **Redux Toolkit** used for centralized state
* Business logic separated into `utils/`
* Components focused only on UI rendering
* Firebase handles persistence

---

## 📁 Folder Structure

```
src/
  app/
    store.ts
    hooks.ts
  features/
    cart/
      cartSlice.ts
  components/
    ProductList.tsx
    Cart.tsx
    BillSummary.tsx
    AvailableOffers.tsx
  utils/
    billing.ts
    firestore.ts
  firebase.ts
```

---

## 🧪 Running Locally

```bash
npm install
npm run dev
```

---

## 🚀 Deployment

Deployed using Firebase Hosting:

```bash
npm run build
firebase deploy
```

---

## 🔐 Firestore Rules (Development Only)

```js
allow read, write: if true;
```

---

## 💡 Design Decisions

* Separated **available offers** and **applied offers** for better UX
* Used **Redux Toolkit** for predictable state management
* Persisted cart only on refresh to avoid overwriting user actions
* Kept UI simple and focused on functionality

---

## 🔮 Future Enhancements

* Add authentication
* Add unit tests (Jest)
* Improve UI with animations
* Add order history

---

## 👨‍💻 Author

Amruth
Frontend Developer (React)
