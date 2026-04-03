import { useAppSelector } from "../app/hooks";
import { calculateBill } from "../utils/billing";

export type Offer = {
  description: string;
  savings: number;
};

export type BillSummaryProps = {
  subtotal: number;
  offers: Offer[];
  total: number;
  budget: number | null;
  isNearBudget: boolean;
};

export function BillSummaryView({ subtotal, offers, total, budget, isNearBudget }: BillSummaryProps) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">Bill Summary</h2>

      <div className="flex justify-between mb-2">
        <span>Subtotal</span>
        <span>£{subtotal.toFixed(2)}</span>
      </div>

      <div className="mt-4">
        <h3 className="font-medium mb-2">Offers Applied</h3>

        {offers.length === 0 ? (
          <p className="text-gray-500">No offers applied</p>
        ) : (
          offers.map((o, i) => (
            <div
              key={i}
              className="flex justify-between text-green-600"
            >
              <span>{o.description}</span>
              <span>-£{o.savings.toFixed(2)}</span>
            </div>
          ))
        )}
      </div>

      <hr className="my-4" />

      <div className="flex justify-between text-xl font-bold">
        <span>Total</span>
        <span>£{total.toFixed(2)}</span>
      </div>

      {budget && <div className="mt-3">
        <p className="text-sm text-gray-600">
          Budget: £{budget.toFixed(2)}
        </p>

        {isNearBudget && total < budget && (
          <p className="text-yellow-500 font-medium">
            You are nearing your Budget!
          </p>
        )}

        {
          total > budget && (
            <p className="text-red-600 font-medium">
              Budget exceeded: you cannot add items to the cart.
            </p>
          )
        }
      </div>}
    </div>
  );
}

export default function BillSummary() {
  const { items: cart, status: cartStatus, error: cartError } = useAppSelector((state) => state.cart);
  const { products, loading: productsLoading, error: productsError } = useAppSelector((state) => state.products);
  const budget = useAppSelector((state) => state.cart.budget);
  const { subtotal, offers, total } = calculateBill(cart, products);
  const isNearBudget = budget!==null && total >= 0.9 * budget;

  if (cartStatus === "loading" || productsLoading) {
    return (
      <div className="bg-white p-5 rounded-2xl shadow-md">f
        <h2 className="text-lg font-semibold mb-4">Bill Summary</h2>
        <p className="text-gray-500">Loading summary...</p>
      </div>
    );
  }

  if (cartStatus === "error") {
    return (
      <div className="bg-white p-5 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">Bill Summary</h2>
        <p className="text-red-500">Failed to load cart: {cartError}</p>
      </div>
    );
  }

  if (productsError) {
    return (
      <div className="bg-white p-5 rounded-2xl shadow-md">
        <h2 className="text-lg font-semibold mb-4">Bill Summary</h2>
        <p className="text-red-500">Failed to load products: {productsError}</p>
      </div>
    );
  }

  

  return <BillSummaryView subtotal={subtotal} offers={offers} total={total} budget={budget} isNearBudget={isNearBudget}/>;
}