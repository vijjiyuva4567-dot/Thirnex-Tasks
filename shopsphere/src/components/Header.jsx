import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";

function Header() {
  const {
    cartCount,
    wishlist,
    darkMode,
    setDarkMode
  } = useShop();

  return (
    <header className="header">
      <div className="container nav">

        <Link to="/" className="logo">
          ShopSphere
        </Link>

        <nav>
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>

          <Link to="/wishlist">
            Wishlist ({wishlist.length})
          </Link>

          <Link to="/cart">
            Cart ({cartCount})
          </Link>

          <button
            className="theme-btn"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle dark mode"
          >
            {darkMode ? "☀️" : "🌙"}
          </button>
        </nav>

      </div>
    </header>
  );
}

export default Header;