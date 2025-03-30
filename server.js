const express = require('express');
const appController = require('./appController');

const loadEnvFile = require('./utils/envUtil');
const envVariables = loadEnvFile('./.env');

const app = express();
const PORT = envVariables.PORT


app.use(express.static('public'));
app.use(express.json());   


app.use('/', appController);

app.listen(PORT, () => {
    console.log(`Server runing at http://localhost:${PORT}`);
})


app.post('/insert-demotable', appController.insertDemotable);







