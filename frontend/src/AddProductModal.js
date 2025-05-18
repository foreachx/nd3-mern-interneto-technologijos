import { useState, useEffect } from "react";
import axios from "axios";

function AddProductModal({ show, onClose, onCreate }) {
  const [form, setForm] = useState({ title: "", price: "", description: "" });

  useEffect(() => {
    if (show) {
      setForm({ title: "", price: "", description: "" });
    }
  }, [show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/products", form, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      onCreate(res.data);
      onClose();
    } catch (err) {
      console.error("Nepavyko pridėti prekės:", err);
    }
  };

  if (!show) return null;

  return (
    <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Pridėti naują prekę</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Pavadinimas</label>
                <input
                  className="form-control"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Kaina (€)</label>
                <input
                  type="number"
                  className="form-control"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Aprašymas</label>
                <textarea
                  className="form-control"
                  rows="2"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={onClose}>
                  Atšaukti
                </button>
                <button type="submit" className="btn btn-primary">
                  Įrašyti
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddProductModal;
