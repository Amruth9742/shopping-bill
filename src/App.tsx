import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import BillSummary from "./components/BillSummary";
import AvailableOffers from "./components/AvailableOffers";


function App() {
   return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">
        🛒 Shopping Bill Calculator
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <ProductList />
        <Cart />

        <div className="flex flex-col gap-6">
          <BillSummary />
          <AvailableOffers />
        </div>
      </div>
    </div>
  );
}

export default App;