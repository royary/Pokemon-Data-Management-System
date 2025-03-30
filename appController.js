const express = require('express');
const router = express.Router();
const appService = require('./appService'); 


router.get('/viewTable', async(req, res) => {
    const tableContent = await appService.fetchDemotableFromDb();
    res.json({data: tableContent});
});



router.get('/avgAttackTable', async(req, res) => {
    const tableContent = await appService.getAverageAttackByType();
    if(tableContent) {
        console.log(tableContent);
        res.json({success : true, data: tableContent});
    } else {
        res.status(500).json({success:false});
    }
});


router.get('/highDefenseTable', async(req, res) => {
    const tableContent = await appService.getHighDefenseTable();
    if(tableContent) {
        console.log(tableContent);
        res.json({success : true, data: tableContent});
    } else {
        res.status(500).json({success:false});
    }
});

router.get('/allCategoriesTrainersTable', async(req, res) => {
    const tableContent = await appService.allCategoriesTrainersTable();
    if(tableContent) {
        console.log(tableContent);
        res.json({success : true, data: tableContent});
    } else {
        res.status(500).json({success:false});
    }
});


router.get('/strongTrainersTable', async(req, res) => {
    const tableContent = await appService.strongTrainersTable();
    if(tableContent) {
        console.log(tableContent);
        res.json({success : true, data: tableContent});
    } else {
        res.status(500).json({success:false});
    }
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
    console.log(req.body, oldname, newname)
    const updateResult = await appService.updateTable(oldname, newname);
    if(updateResult) {
        res.json({success: true});
    }else {
        res.status(500).json({success: false});
    }
});

router.get("/trainer-search/:trainerId", async (req, res) => {
    const trainerId = req.params.trainerId;
    console.log(req.body, trainerId)
    const results = await appService.trainerSearch(trainerId);
    console.log("RESULTTTTT", results)
    if(results) {
        res.json({success: true, data: results});
    }else {
        res.status(500).json({success: false});
    }
});

router.post("/insert-demotable", async (req, res) => {
    const {id, name, type, gender, ability, trainer} = req.body;
    console.log("I'm here");
    const insertResult = await appService.insertDemotable(id, name, type, gender, ability, trainer);
    if(insertResult) {
        res.json({success: true});
    }else {
        res.status(500).json({success: false});
    }
   
});

router.post("/deleteId", async (req, res) => {
    const {id} = req.body;
    const insertResult = await appService.deleteID(id);
    if(insertResult) {
        res.json({success: true});
    }else {
        res.status(500).json({success: false});
    }
   
});


router.post("/filter", async (req, res) => {
    const {attribute, whereClause} = req.body;
    const filterResult = await appService.filterTable(attribute, whereClause);
    if(filterResult) {
        res.json({success: true, data: filterResult});
    }else {
        res.status(500).json({success: false});
    }
   
});

module.exports = router;