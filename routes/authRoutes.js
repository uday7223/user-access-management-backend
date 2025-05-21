const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const AppDataSource = require("../data-source");
const User = require("../entities/User");

const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, password } = req.body;
  const repo = AppDataSource.getRepository("User");

  const existingUser = await repo.findOneBy({ username });
  if (existingUser) return res.status(400).json({ message: "User exists" });

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = repo.create({ username, password: hashedPassword, role: "Employee" });

  await repo.save(newUser);
//   console.log(`user ${username} created`);
  
  res.status(201).json({ message: "User created" });
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const repo = AppDataSource.getRepository("User");

  const user = await repo.findOneBy({ username });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(400).json({ message: "Invalid credentials" });

  const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token, role: user.role });
});



module.exports = router;
