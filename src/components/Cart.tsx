import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import {
  addItemToCart,
  decrementItemFromCart,
  fetchCart,
} from "../features/cart/cartSlice";

export type CartProps = {
  cart: Record<string, number>;
  onIncrement: (item: string) => void;
  onDecrement: (item: string) => void;
};

export function CartView({ cart, onIncrement, onDecrement }: CartProps) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Cart</h2>

      {Object.keys(cart).length === 0 ? (
        <p className="text-gray-500">Your cart is empty</p>
      ) : (
        Object.entries(cart).map(([item, qty]) => (
          <div
            key={item}
            className="flex justify-between items-center mb-3"
          >
            <span className="capitalize">{item}</span>

            <div className="flex items-center gap-2">
              <button
                className="bg-gray-200 px-2 rounded hover:bg-gray-300"
                onClick={() => onDecrement(item)}
              >
                -
              </button>

              <span>{qty}</span>

              <button
                className="bg-blue-500 text-white px-2 rounded hover:bg-blue-600"
                onClick={() => onIncrement(item)}
              >
                +
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default function Cart() {
  const { items, status, error } = useAppSelector((state) => state.cart);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  if (status === "loading") {
    return (
      <div className="bg-white p-5 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">Cart</h2>
        <p className="text-gray-500">Loading cart...</p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="bg-white p-5 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">Cart</h2>
        <p className="text-red-500">Failed to load cart: {error}</p>
      </div>
    );
  }

  return (
    <CartView
      cart={items}
      onIncrement={(item) => dispatch(addItemToCart({ item }))}
      onDecrement={(item) => dispatch(decrementItemFromCart({ item }))}
    />
  );
}