const express = require('express');
const router = express.Router();
const appService = require('./appService'); 


router.get('/viewTable', async(req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({data: tableContent});
});

router.post("/initiate-demotable", async (req, res) => {
    const initiateResult = await appService.initiateDemotable();
    if(initiateResult) {
        res.json({success : true});
    } else {
        res.status(500).json({success:false});
    }
});

router.put("/update-table", async (req, res) => {
    const {oldname, newname} = req.body;
    const updateResult = await appService.updateTable(oldname, newname);
    if(insertResult) {
        res.json({success: true});
    }else {
        res.status(500).json({success: false});
    }
});


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