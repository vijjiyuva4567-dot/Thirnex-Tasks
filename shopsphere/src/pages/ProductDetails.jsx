import { Link, useParams } from "react-router-dom";
import products from "../data/products";
import { useShop } from "../context/ShopContext";

function ProductDetails() {
  const { id } = useParams();

  const product = products.find(
    (item) => item.id === Number(id)
  );

  const { addToCart, toggleWishlist, wishlist } = useShop();

  if (!product) {
    return (
      <main className="section container empty">
        <h1>Product Not Found</h1>
        <Link to="/products" className="btn primary">
          Back to Products
        </Link>
      </main>
    );
  }

  const isWishlisted = wishlist.some(
    (item) => item.id === product.id
  );

  return (
    <main className="section container">

      <Link to="/products" className="back-link">
        ← Back to Products
      </Link>

      <div className="details">

        <div className="details-image">
          <img
            src={`${product.image}?auto=format&fit=crop&w=1000&q=80`}
            alt={product.title}
          />
        </div>

        <div className="details-content">

          <span className="category">
            {product.category}
          </span>

          <h1>{product.title}</h1>

          <p className="rating">
            ⭐ {product.rating}
          </p>

          <p className="details-price">
            ₹{product.price.toLocaleString("en-IN")}
          </p>

          <p className="description">
            {product.description}
          </p>

          <div className="details-actions">

            <button
              className="btn primary"
              onClick={() => addToCart(product)}
            >
              Add to Cart
            </button>

            <button
              className="btn secondary"
              onClick={() => toggleWishlist(product)}
            >
              {isWishlisted
                ? "Remove from Wishlist"
                : "Add to Wishlist"}
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}

export default ProductDetails;