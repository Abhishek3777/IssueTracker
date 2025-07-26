const express = require('express');
const router = express.Router();
const { createIssue, getAllIssues, deleteIssues, updateIssueStatus, getSummary } = require("../controllers/issueController");


router.get("/", getAllIssues);
router.post("/", createIssue);
router.delete('/:id', deleteIssues);
router.patch("/:id/status", updateIssueStatus);
router.get("/summary", getSummary);

module.exports = router;