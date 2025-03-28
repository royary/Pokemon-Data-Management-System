const express = require('express');
const appController = require('./appController');

const app = express();
const PORT = 65534;


app.use(express.static('public'));
app.use(express.json());   


app.use('/', appController);

app.listen(PORT, () => {
    console.log(`Server runing at http://localhost:${PORT}`);
})







