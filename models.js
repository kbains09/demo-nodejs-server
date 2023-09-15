const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: String,
  dueDate: Date,
  // Add other fields as needed
});

module.exports = mongoose.model('Task', taskSchema);

