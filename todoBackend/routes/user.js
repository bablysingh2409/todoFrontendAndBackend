const express = require('express');
let router = express.Router();
const cors = require('cors');
const bodyParser = require('body-parser');
const User = require('../model/userDetails');

const corsOptions = {
  origin: '*',
  // origin: 'http://localhost:3000/user',
  optionsSuccessStatus: 200,
};
router.use(cors(corsOptions));
router.use(bodyParser.urlencoded({ extended: true }));
router.use(bodyParser.json());

//posting user details to database
router.post('/', async (req, res) => {
  let { task, date, category, completed } = req.body;
  const newUser = new User({
    task,
    date,
    category,
    completed,
  });
  // console.log(req.body);
  try {
    const saveData = await newUser.save();
    res.json(saveData);
  } catch (err) {
    res.json(err);
  }
});

//getting all details of user
router.get('/', async (req, res) => {
  try {
    let result = await User.find();
    res.status(200).json(result);
  } catch (err) {
    res.status(500).json(err);
  }
});

//getting user by its unique id
router.get('/:id', async (req, res) => {
  try {
    let userId = req.params.id;
    let result = await User.findById(userId);
    res.json(result);
  } catch (err) {
    res.status(500).json('error:', err);
  }
});

//updating the user details
router.put('/:id', async (req, res) => {
  try {
    let userId = req.params.id;
    let userData = req.body;
    const updatedData = await User.findByIdAndUpdate(userId, { $set: userData }, { new: true });
    res.status(200).json(updatedData);
  } catch (err) {
    res.status(500).json(err);
  }
});

//deleting data by there ids
router.delete('/:id', async (req, res) => {
  let userId = req.params.id;
  // console.log(userId);
  try {
    await User.findByIdAndDelete(userId);
    res.status(200).json('user has been deleted');
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
