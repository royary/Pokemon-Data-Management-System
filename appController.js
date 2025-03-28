const express = require('express');
const router = express.Router();


//API endpoint
router.get('/check-db-connection', async(req, res) => {
    const isConnect = await appService.testOracleConnection();
    if(isConnect) {
        res.send('connected');
    } else {
        res.send('unable to connect');
    }
});












module.exports = router;