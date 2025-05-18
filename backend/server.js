/* === backend/server.js === */

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const User = require("./models/User");
const Product = require("./models/Product");

const SECRET = "slaptas_raktas"; // rekomenduoju naudoti .env failą

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://mongodb:27017/marketplace", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB prijungta"))
  .catch(err => console.error("DB klaida:", err));

function authMiddleware(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).send({ error: "Nėra tokeno" });

  try {
    const data = jwt.verify(token, SECRET);
    req.userId = data.id;
    next();
  } catch {
    res.status(401).send({ error: "Netinkamas tokenas" });
  }
}

app.post("/products", authMiddleware, async (req, res) => {
  const product = new Product({
    ...req.body,
    userId: req.userId
  });
  await product.save();
  res.send(product);
});

app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.send(products);
});

app.put("/products/:id", authMiddleware, async (req, res) => {
  const updated = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.send(updated);
});

app.delete("/products/:id", authMiddleware, async (req, res) => {
  await Product.findByIdAndDelete(req.params.id);
  res.send({ message: "Prekė ištrinta" });
});

app.get("/my-products", authMiddleware, async (req, res) => {
  const products = await Product.find({ userId: req.userId });
  res.send(products);
});
// User funkcijos
// Registracija
app.post("/register", async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.send({ message: "Registracija sėkminga" });
  } catch (e) {
    res.status(400).send({ error: "Registracija nepavyko" });
  }
});

// Prisijungimas
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).send({ error: "Blogi prisijungimo duomenys" });
  }
  const token = jwt.sign({ id: user._id }, SECRET, { expiresIn: "1h" });
  res.send({ token });
});

app.get("/whoim", authMiddleware, async (req, res) => {
  const user = await User.findById(req.userId).select("email");
  if (!user) return res.status(404).send({ error: "Naudotojas nerastas" });
  res.send({ email: user.email });
});

app.listen(3001, () => console.log("Serveris veikia ant 3001 porto"));
