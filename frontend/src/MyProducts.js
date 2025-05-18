import { useEffect, useState } from "react";
import axios from "axios";
import AddProductModal from "./AddProductModal";

function MyProducts() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ title: "", price: "", description: "" });
  const [editing, setEditing] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      const res = await axios.get("http://localhost:3001/my-products", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts(res.data);
    } catch (err) {
      console.error("Klaida gaunant mano prekes:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Ar tikrai norite ištrinti prekę?")) return;
    try {
      await axios.delete(`http://localhost:3001/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Nepavyko ištrinti prekės:", err);
    }
  };

  const handleEdit = (product) => {
    setEditing(product._id);
    setForm({ title: product.title, price: product.price, description: product.description });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`http://localhost:3001/products/${editing}`, form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts(products.map((p) => (p._id === editing ? res.data : p)));
      setEditing(null);
      setForm({ title: "", price: "", description: "" });
    } catch (err) {
      console.error("Nepavyko atnaujinti prekės:", err);
    }
  };

  const handleAddClick = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleAddedProduct = (newProduct) => {
    setProducts((prev) => [...prev, newProduct]);
    setShowModal(false);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Mano prekės</h2>
        <button className="btn btn-success btn-sm" onClick={handleAddClick}>+ Pridėti</button>
      </div>

      {editing && (
        <form onSubmit={handleUpdate} className="mb-4">
          <div className="mb-2">
            <input
              className="form-control"
              placeholder="Pavadinimas"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              required
            />
          </div>
          <div className="mb-2">
            <input
              type="number"
              className="form-control"
              placeholder="Kaina"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              required
            />
          </div>
          <div className="mb-2">
            <textarea
              className="form-control"
              placeholder="Aprašymas"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <button className="btn btn-success me-2" type="submit">Atnaujinti</button>
          <button className="btn btn-secondary" type="button" onClick={() => setEditing(null)}>Atšaukti</button>
        </form>
      )}

      <div className="row">
        {products.map((p) => (
          <div className="col-md-4 mb-3" key={p._id}>
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{p.title}</h5>
                <p className="card-text">{p.description}</p>
                <p><strong>{p.price} €</strong></p>
              </div>
              <div className="card-footer d-flex justify-content-between">
                <button className="btn btn-outline-primary btn-sm" onClick={() => handleEdit(p)}>Redaguoti</button>
                <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(p._id)}>Ištrinti</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <AddProductModal
        show={showModal}
        onClose={handleCloseModal}
        onCreate={handleAddedProduct}
      />
    </div>
  );
}

export default MyProducts;
