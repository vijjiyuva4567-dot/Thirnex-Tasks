import { Link } from "react-router-dom";
import products from "../data/products";
import ProductGrid from "../components/ProductGrid";

function Home() {
  return (
    <main>

      <section className="hero">
        <div className="container hero-content">

          <div>
            <span className="eyebrow">
              MODERN E-COMMERCE
            </span>

            <h1>
              Discover products
              <span> you'll love.</span>
            </h1>

            <p>
              Explore electronics, fashion, home products
              and lifestyle essentials in one modern catalog.
            </p>

            <Link
              to="/products"
              className="btn primary hero-btn"
            >
              Explore Products
            </Link>
          </div>

        </div>
      </section>

      <section className="section container">

        <div className="section-heading">
          <div>
            <span className="eyebrow">
              FEATURED
            </span>

            <h2>Popular Products</h2>
          </div>

          <Link to="/products">
            View All →
          </Link>
        </div>

        <ProductGrid products={products.slice(0, 4)} />

      </section>

    </main>
  );
}

export default Home;