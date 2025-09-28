const mongoose = require('mongoose');

const issueSchema = new mongoose.Schema({
    issueId: String,
    title: String,
    description: String,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    priority: {
        type: String,
        enum: ['Low', 'Medium', 'High']
    },
    status: {
        type: String, enum: ['Open', 'In Progress', 'Resolved', 'UnResolved', 'Closed'],
        default: 'Open',
        required: true
    },
    type: { type: String, enum: ['Bug', 'Feature', 'Task'] },
    createdDate: {
        type: Date,
        default: Date.now
    },
    totalOpenDuration: {
        type: Number,
        default: 0
    },
    lastReopenedAt: {
        type: Date,
        default: Date.now
    },
    closedAt: Date,
    dueDate: Date,
    comments: String
});

module.exports = mongoose.model('Issue', issueSchema);