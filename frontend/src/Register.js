import { useState } from "react";
import axios from "axios";

function Register({ onRegister }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:3001/register", form);
      setSuccess(true);
      setError("");
      onRegister(); // perjungti į login
    } catch (err) {
      setError("Registracija nepavyko. Galbūt toks el. paštas jau naudojamas.");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Registracija</h2>
      <form onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="El. paštas"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="form-control mb-2"
          required
        />
        <input
          type="password"
          placeholder="Slaptažodis"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          className="form-control mb-2"
          required
        />
        <button type="submit" className="btn btn-success">Registruotis</button>
      </form>
      {success && <p className="text-success mt-2">Registracija sėkminga! Galite prisijungti.</p>}
      {error && <p className="text-danger mt-2">{error}</p>}
    </div>
  );
}

export default Register;
