const express = require('express');
const router = express.Router();
const { createIssue, getAllIssues, deleteIssues, updateStatus, getSummary, assignWork, editIssues } = require("../controllers/issueController");
const { authenticate, authorizeRoles } = require('../middlewares/authMiddleware');


router.get("/", getAllIssues);
router.post("/", authenticate, authorizeRoles("user", "admin"), createIssue);
// router.delete('/:id', deleteIssues);
router.patch("/:id/status", authenticate, authorizeRoles("admin", "worker", "user"), updateStatus);
router.get("/summary", getSummary);
router.patch("/:id/assign", authenticate, authorizeRoles("admin"), assignWork);
router.patch("/:id/edit", authenticate, editIssues);

module.exports = router;