const express = require('express');
const router = express.Router();
const appService = require('./appService'); 


router.post("/insert-demotable", async (req, res) => {
    const {id, name} = req.body;
    console.log("I'm here");
    const insertResult = await appService.insertDemotable(id, name);
    if(insertResult) {
        res.json({success: true});
    }else {
        res.status(500).json({success: false});
    }
   
});


module.exports = router;