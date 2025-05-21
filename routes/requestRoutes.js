const express = require("express");
const AppDataSource = require("../data-source");
const Request = require("../entities/Request");
const User = require("../entities/User");
const Software = require("../entities/Software");
const { authenticate, authorize } = require("../middlewares/auth");

const router = express.Router();

// Submit new access request (Employee only)
router.post("/", authenticate, authorize(["Employee"]), async (req, res) => {
  const { softwareId, accessType, reason } = req.body;
  const requestRepo = AppDataSource.getRepository("Request");
  const softwareRepo = AppDataSource.getRepository("Software");
  const userRepo = AppDataSource.getRepository("User");

  const software = await softwareRepo.findOneBy({ id: softwareId });
  const user = await userRepo.findOneBy({ id: req.user.id });

  if (!software) return res.status(404).json({ message: "Software not found" });

  const newRequest = requestRepo.create({
    software,
    user,
    accessType,
    reason,
    status: "Pending",
  });

  await requestRepo.save(newRequest);
  res.status(201).json({ message: "Request submitted", request: newRequest });
});

// Get all pending requests (Manager only)
router.get("/", authenticate, authorize(["Manager"]), async (req, res) => {
  const repo = AppDataSource.getRepository("Request");
  const pending = await repo.find({ where: { status: "Pending" } });
  res.json(pending);
});

// Approve/Reject request (Manager only)
router.patch("/:id", authenticate, authorize(["Manager"]), async (req, res) => {
  const { id } = req.params;
  const { status } = req.body; // Expected: "Approved" or "Rejected"

  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  const repo = AppDataSource.getRepository("Request");
  const request = await repo.findOneBy({ id });

  if (!request) return res.status(404).json({ message: "Request not found" });

  request.status = status;
  await repo.save(request);

  res.json({ message: `Request ${status.toLowerCase()}`, request });
});

module.exports = router;
