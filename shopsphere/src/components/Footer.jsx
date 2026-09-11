function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <h2>ShopSphere</h2>

        <p>
          A modern e-commerce product catalog built with React,
          Vite and responsive CSS.
        </p>

        <p>
          © {new Date().getFullYear()} ShopSphere. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;