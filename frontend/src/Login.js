import { useState } from "react";
import axios from "axios";

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3001/login", form);
      localStorage.setItem("token", res.data.token);
      onLogin();
    } catch {
      alert("Blogi duomenys");
    }
  };

  return (
    <div className="container mt-5">
      <h2>Prisijungimas</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="El. paštas"
          value={form.email}
          onChange={e => setForm({ ...form, email: e.target.value })}
          className="form-control mb-2"
        />
        <input
          type="password"
          placeholder="Slaptažodis"
          value={form.password}
          onChange={e => setForm({ ...form, password: e.target.value })}
          className="form-control mb-2"
        />
        <button type="submit" className="btn btn-primary">Prisijungti</button>
      </form>
    </div>
  );
}

export default Login;
