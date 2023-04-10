const express = require('express');
const User = require('./model/userDetails');
const app = express();
const user = require('./routes/user');
const cors = require('cors');

app.use(cors());
app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// app.use((req, res, next) => {
//   res.setHeader('Access-Control-Allow-Origin', '*');
//   res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
//   res.setHeader('Access-Control-Allow-Methods', 'Content-Type', 'Authorization');
//   next();
// });
app.get('/', (req, res) => {
  res.send('hellooo from backend');
});
app.use('/user', user);

// const user1 = new User({
//   name: 'bably',
//   category: 'school',
//   date: '2023-04-05',
// });

// user1.date instanceof Date;
// user1.save();
// app.post('/user', (req, res) => {

// });

app.listen(3000, (err) => {
  console.log('listening on port 3000....');
});
