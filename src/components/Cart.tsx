import { useEffect, useState } from "react";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import {
  addItemToCart,
  decrementItemFromCart,
  fetchCart,
  setBudget,
} from "../features/cart/cartSlice";

export type CartProps = {
  cart: Record<string, number>;
  onIncrement: (item: string) => void;
  onDecrement: (item: string) => void;
  budget: number | null;
  budgetExceeded: boolean;
  onSetBudget: (budget: number) => void;
};

export function CartView({ cart, onIncrement, onDecrement, budget, budgetExceeded, onSetBudget }: CartProps) {
  const [budgetInput, setBudgetInput] = useState(budget?.toString() || "");

  const handleBudgetSubmit = () => {
    const value = parseFloat(budgetInput);
    if (!isNaN(value) && value > 0) {
      onSetBudget(value);
    }
  };

  return (
    <div className="bg-white p-5 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Cart</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Set Budget (£)
        </label>
        <div className="flex gap-2">
          <input
            type="number"
            step="0.01"
            min="0"
            placeholder="Enter budget"
            value={budgetInput}
            onChange={(e) => setBudgetInput(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <button
            onClick={handleBudgetSubmit}
            className="bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600"
          >
            Set
          </button>
        </div>
        {budget && (
          <p className="text-sm text-gray-600 mt-1">
            Current budget: £{budget.toFixed(2)}
          </p>
        )}

        {budgetExceeded && (
          <p className="text-sm text-red-600 font-semibold mt-1">
            Budget exceeded: cannot add more items.
          </p>
        )}
      </div>

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
                className={`px-2 rounded text-white ${budgetExceeded ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
                disabled={budgetExceeded}
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
  const { items, status, error, budget, budgetExceeded } = useAppSelector((state) => state.cart);
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
      budget={budget}
      budgetExceeded={budgetExceeded}
      onSetBudget={(value) => dispatch(setBudget(value))}
    />
  );
}