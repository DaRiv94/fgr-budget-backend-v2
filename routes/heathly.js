const express = require('express');
const router = express.Router();

router.get("/", async (req, res) => {
    try {

        res.status(200).json({detail:"System Is Healthy"});
    } catch (e) {

        res.status(500).send({ "Error": String(e) });
    }

});

module.exports = router;