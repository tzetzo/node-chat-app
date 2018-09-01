const express = require('express'); //import express
const path = require('path'); //import path module

const port = process.env.PORT || 3000; //declare the port; process.env.PORT is provided by heroku

const app = express(); //create express application

const publicPath = path.join(__dirname, '../public');
app.use(express.static(publicPath));

app.listen(port, () => {
  console.log(`Server is up on port ${port}`);
});
