const express = require('express');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const appRoute = require('./routes/route');
app.use('/', appRoute);

app.listen(3000, ()=>{
    console.log('Server Berjalan di Port : 3000');
});