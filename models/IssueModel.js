const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
    issueId: String,
    title: String,
    description: String,
    assignee: String,
    priority: { type: String, enum: ['Low', 'Medium', 'High'] },
    status: { type: String, enum: ['Open', 'Closed'] },
    type: { type: String, enum: ['Bug', 'Feature', 'Task'] },
    createdDate: { type: Date, default: Date.now },
    dueDate: Date,
    comments: String
});

module.exports = mongoose.model('Issue', issueSchema);