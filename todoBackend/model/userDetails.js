const mongoose = require('mongoose');
mongoose
  .connect('mongodb://localhost:27017/userDetails')
  .then(() => console.log('connection established...'))
  .catch((err) => console.log('error occured..:', err));

//schema
const userSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
    required: true,
  },
});

const User = mongoose.model('User', userSchema);
module.exports = User;
