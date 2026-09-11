import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";

function ProductCard({ product }) {
  const {
    addToCart,
    toggleWishlist,
    wishlist
  } = useShop();

  const isWishlisted = wishlist.some(
    (item) => item.id === product.id
  );

  return (
    <article className="product-card">

      <div className="product-image">
        <img
          src={`${product.image}?auto=format&fit=crop&w=600&q=75`}
          alt={product.title}
          loading="lazy"
        />
      </div>

      <div className="product-content">

        <span className="category">
          {product.category}
        </span>

        <h3>{product.title}</h3>

        <p className="rating">
          ⭐ {product.rating}
        </p>

        <p className="price">
          ₹{product.price.toLocaleString("en-IN")}
        </p>

        <div className="product-actions">

          <Link
            to={`/products/${product.id}`}
            className="btn secondary"
          >
            View
          </Link>

          <button
            className="btn primary"
            onClick={() => addToCart(product)}
          >
            Add to Cart
          </button>

          <button
            className="wishlist-btn"
            onClick={() => toggleWishlist(product)}
            aria-label="Toggle wishlist"
          >
            {isWishlisted ? "❤️" : "♡"}
          </button>

        </div>

      </div>

    </article>
  );
}

export default ProductCard;