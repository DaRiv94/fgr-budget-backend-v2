const express = require('express');
const moment = require('moment');
const router = express.Router();
const Bank = require('../models/Bank')
const auth_M = require('../middleware/auth');
const axios = require("axios");
const { Op } = require("sequelize");
const FGR_BUDGET_WEBHOOK_URL = process.env.FGR_BUDGET_WEBHOOK_URL

// POST budgets /budget  Create a budget
router.post("/", auth_M, async (req, res) => {
    try {
        if(!req.body || !req.body.item_id ){
            return res.status(400).json({detail:"Please send valid triggerwebhook body"})
        }

        let bank = await Bank.findOne({
            where: {
              [Op.and]: [
                { item_id: req.body.item_id },
                { user_id: String(req.user.id) }
              ]
            }
          });

        if(bank ==null ){
            return res.status(400).json({detail:`Could Not find a bank for user ${req.user.id} with item_id: ${ req.body.item_id}`})
        }

        //I might use these in the future to give the user on the frontend the ablity to specify the start_date to grab transactions
        //The default is 10 days in the past
        start_date= req.body.start_date || null

        webhook_body = {
            error: null,
            item_id: req.body.item_id,
            new_transactions: 9999,
            webhook_code: "DEFAULT_UPDATE",
            webhook_type: "TRANSACTIONS",
            test: false
        }

        let url = FGR_BUDGET_WEBHOOK_URL + '/webhook'
        
        if(start_date != null )
        {
            //Will probably want to bring in Moment.js
            //Then format the start_date to ensure it can easily be sent as a query param
            url += `?start_date=${start_date}`
        }
        
        console.log("url:",url)
        console.log("webhook_body:",webhook_body)
        
        let response = await axios.post(url, webhook_body);

        return res.status(response.status).json(response.data)
        // return res.json({detail:"All good"})

    } catch (e) {
        console.log("triggerwebhook error: ", e)

        res.status(500).send({ "Error": String(e) });
    }
});




module.exports = router;