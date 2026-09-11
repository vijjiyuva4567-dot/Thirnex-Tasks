import { Link } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";
import { useShop } from "../context/ShopContext";

function Wishlist() {
  const { wishlist } = useShop();

  return (
    <main className="section container">

      <div className="page-heading">
        <span className="eyebrow">
          SAVED
        </span>

        <h1>My Wishlist</h1>
      </div>

      {wishlist.length === 0 ? (
        <div className="empty">

          <h2>Your wishlist is empty</h2>

          <p>
            Save products you want to check later.
          </p>

          <Link
            to="/products"
            className="btn primary"
          >
            Explore Products
          </Link>

        </div>
      ) : (
        <ProductGrid products={wishlist} />
      )}

    </main>
  );
}

export default Wishlist;