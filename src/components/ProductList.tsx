import { useAppDispatch, useAppSelector } from "../app/hooks";
import { addItemToCart } from "../features/cart/cartSlice";
import type { Product } from "../features/products/productsSlice";
import { setProducts, setLoading, setError } from "../features/products/productsSlice";
import { useEffect } from "react";
import { fetchProducts } from "../utils/firestore";

export default function ProductList() {
  const dispatch = useAppDispatch();
  const { products, loading } = useAppSelector((state) => state.products);

  useEffect(() => {
    const loadProducts = async () => {
      dispatch(setLoading(true));
      try {
        const data = await fetchProducts();
        dispatch(setProducts(data as Product[]));
      } catch (err) {
        dispatch(setError("Failed to load products"));
        console.error("Failed to load products", err);
      }
    };

    loadProducts();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="bg-white p-5 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">Products</h2>
        <div className="flex justify-center items-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-2 text-gray-500">Loading products...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Products</h2>

      {products.map((product) => (
        <div
          key={product.name}
          className="flex justify-between items-center mb-3"
        >
          <span className="capitalize">
            {product.name} <span className="text-gray-500">£{product.price}</span>
          </span>

          <button
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition"
            onClick={() => dispatch(addItemToCart({ item: product.name }))}
          >
            Add
          </button>
        </div>
      ))}
    </div>
  );
}