import React, { useState, useEffect } from "react";
import axios from "axios";
import Login from "./Login";
import Register from "./Register";
import MyProducts from "./MyProducts";
import Navbar from "./Navbar";
import AddProductModal from "./AddProductModal";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

function AllProducts({ loggedIn, onAddClick, newProduct }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!loggedIn) return;
    axios.get("http://localhost:3001/products")
      .then(res => setProducts(res.data))
      .catch(err => console.error("Nepavyko gauti produktų:", err));
  }, [loggedIn]);

  useEffect(() => {
    if (newProduct) {
      setProducts(prev => [newProduct, ...prev]);
    }
  }, [newProduct]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Visos prekės</h2>
        <button className="btn btn-success btn-sm" onClick={onAddClick}>+ Pridėti</button>
      </div>
      <div className="row">
        {products.map((p) => (
          <div className="col-md-4 mb-3" key={p._id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{p.title}</h5>
                <p className="card-text">{p.description}</p>
              </div>
              <div className="card-footer text-end">
                <strong>{p.price} €</strong>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MainApp() {
  const [loggedIn, setLoggedIn] = useState(!!localStorage.getItem("token"));
  const [authMode, setAuthMode] = useState("login");
  const [showModal, setShowModal] = useState(false);
  const [newProduct, setNewProduct] = useState(null);

  const handleAddClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const handleAddedProduct = (product) => {
    setNewProduct(product);
    setShowModal(false);
  };

  if (!loggedIn) {
    return authMode === "login" ? (
      <>
        <Login onLogin={() => setLoggedIn(true)} />
        <p className="text-center mt-3">
          Neturite paskyros? {" "}
          <button className="btn btn-link" onClick={() => setAuthMode("register")}>
            Registruotis
          </button>
        </p>
      </>
    ) : (
      <>
        <Register onRegister={() => setAuthMode("login")} />
        <p className="text-center mt-3">
          Jau turite paskyrą? {" "}
          <button className="btn btn-link" onClick={() => setAuthMode("login")}>
            Prisijungti
          </button>
        </p>
      </>
    );
  }

  return (
    <Router>
      <Navbar loggedIn={loggedIn} setLoggedIn={setLoggedIn} onAddClick={handleAddClick} />
      <Routes>
        <Route path="/" element={<AllProducts loggedIn={loggedIn} onAddClick={handleAddClick} newProduct={newProduct} />} />
        <Route path="/my-products" element={<MyProducts />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <AddProductModal show={showModal} onClose={handleCloseModal} onCreate={handleAddedProduct} />
    </Router>
  );
}

export default MainApp;
