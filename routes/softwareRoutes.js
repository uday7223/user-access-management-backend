const express = require("express");
const AppDataSource = require("../data-source");
const Software = require("../entities/Software");
const { authenticate, authorize } = require("../middlewares/auth");

const router = express.Router();

// Create new software (Admin only)
router.post("/", authenticate, authorize(["Admin"]), async (req, res) => {
  const { name, description, accessLevels } = req.body;
  const repo = AppDataSource.getRepository("Software");

  const newSoftware = repo.create({ name, description, accessLevels });
  await repo.save(newSoftware);

  res.status(201).json({ message: "Software created", software: newSoftware });
});

// Get all software (accessible by all logged-in users)
router.get("/", authenticate, async (req, res) => {
  const repo = AppDataSource.getRepository("Software");
  const all = await repo.find();
  res.json(all);
});

module.exports = router;
