const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const { MONGO_URI } = require('./config/keys');

const app = express();
const port = process.env.PORT || 5000;

// Routes
const authen = require('./routes/authen')
const userRoutes = require('./routes/userRoutes')
const postRoutes = require('./routes/postRoutes')

app.use(express.json());
app.use(authen);
app.use('/user', userRoutes);
app.use('/posts', postRoutes)

// Connecting to Database
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true
}, () => console.log('MongoDb is connected'));

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('frontend/build'));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'build', 'index.html'))
  })
}

app.listen(port, () => console.log(`Server running on port ${port}`))