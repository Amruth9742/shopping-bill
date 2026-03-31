import { db } from "../firebase";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";

const CART_DOC_ID = "default";
const CART_COLLECTION = "carts";

export const saveCart = async (
  cart: Record<string, number>,
  userId = CART_DOC_ID
) => {
  await setDoc(doc(db, CART_COLLECTION, userId), {
    items: cart,
    updatedAt: new Date(),
  });
};

export const loadCart = async (userId = CART_DOC_ID): Promise<Record<string, number>> => {
  const docRef = doc(db, CART_COLLECTION, userId);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return {};
  }

  const data = snapshot.data();
  return (data.items as Record<string, number>) || {};
};

export const fetchProducts = async () => {
  const snapshot = await getDocs(collection(db, "products"));

  return snapshot.docs.map((doc) => doc.data());
};


// export const addProducts = async () => {
//   const products = [
//     { name: "bread", price: 1.1 },
//     { name: "milk", price: 0.5 },
//     { name: "cheese", price: 0.9 },
//     { name: "soup", price: 0.6 },
//     { name: "butter", price: 1.2 },
//   ];

//   try {
//     for (const product of products) {
//       await addDoc(collection(db, "products"), product);
//     }
//     console.log("Products added!");
//   } catch (error) {
//     console.error("Error adding products:", error);
//   }
// };