import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";

function Cart() {
  const {
    cart,
    cartTotal,
    removeFromCart,
    updateQuantity
  } = useShop();

  if (cart.length === 0) {
    return (
      <main className="section container empty">
        <h1>Your Cart is Empty</h1>

        <p>
          Add some products to your cart to continue.
        </p>

        <Link
          to="/products"
          className="btn primary"
        >
          Browse Products
        </Link>
      </main>
    );
  }

  return (
    <main className="section container">

      <div className="page-heading">
        <h1>Your Cart</h1>
      </div>

      <div className="cart-layout">

        <div className="cart-items">

          {cart.map((item) => (
            <article className="cart-item" key={item.id}>

              <img
                src={`${item.image}?auto=format&fit=crop&w=300&q=70`}
                alt={item.title}
                loading="lazy"
              />

              <div>
                <h2>{item.title}</h2>

                <p>
                  ₹{item.price.toLocaleString("en-IN")}
                </p>

                <div className="quantity">

                  <button
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        item.quantity - 1
                      )
                    }
                  >
                    −
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(
                        item.id,
                        item.quantity + 1
                      )
                    }
                  >
                    +
                  </button>

                </div>

                <button
                  className="remove-btn"
                  onClick={() => removeFromCart(item.id)}
                >
                  Remove
                </button>

              </div>

            </article>
          ))}

        </div>

        <aside className="cart-summary">

          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Items</span>
            <span>{cart.length}</span>
          </div>

          <div className="summary-row total">
            <span>Total</span>

            <span>
              ₹{cartTotal.toLocaleString("en-IN")}
            </span>
          </div>

          <button className="btn primary checkout-btn">
            Proceed to Checkout
          </button>

        </aside>

      </div>

    </main>
  );
}

export default Cart;