export default function AvailableOffers() {
  const offers = [
    "Buy 1 Cheese, get 1 free",
    "Buy Soup, get Bread at half price",
    "Get 1/3 off Butter",
  ];

  return (
    <div className="bg-white p-5 rounded-2xl shadow-md">
      <h2 className="text-lg font-semibold mb-4">
        Available Offers
      </h2>

      <ul className="space-y-2 text-gray-700">
        {offers.map((offer, index) => (
          <li
            key={index}
            className="p-2 rounded-lg bg-gray-50 border"
          >
            🎯 {offer}
          </li>
        ))}
      </ul>
    </div>
  );
}