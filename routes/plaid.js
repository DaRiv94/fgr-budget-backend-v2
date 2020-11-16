const express = require('express');
const moment = require('moment');
const router = express.Router();
// const Account = require('../models/Account');
const Bank = require('../models/Bank');
const auth_M = require('../middleware/auth');
const axios = require("axios");


router.get("/linktokencreate", auth_M, async (req, res) => {

    PLAID_CLIENT_ID = process.env.PLAID_DEV_CLIENT_ID
    PLAID_SECRET = process.env.PLAID_DEV_SECRET
    PLAID_LINK_TOKEN_CREATE_ENDPOINT = 'https://development.plaid.com/link/token/create'

    if (process.env.NODE_ENV=="development" || req.query.env == "sandbox"){
        PLAID_SECRET = process.env.SANDBOX_PLAID_SECRET
        PLAID_LINK_TOKEN_CREATE_ENDPOINT = 'https://sandbox.plaid.com/link/token/create'
    }

    let plaidBody={
        client_id: PLAID_CLIENT_ID,
        secret: PLAID_SECRET,
        user: {
            client_user_id: String(req.user.id)
        },
        client_name: "FGR_Budget_Frontend",
        products: [
            "transactions"
        ],
        country_codes: [
            "US"
        ],
        language: "en"
    }
    
    try{
        let response = await axios.post(PLAID_LINK_TOKEN_CREATE_ENDPOINT, plaidBody);

        return res.status(200).json({link_token:response.data.link_token})
    }catch(ex){ 
        
        if (ex.response.data){
            return res.status(400).json({detail:ex.response.data})
        }else if (ex.response){
            return res.status(400).json({detail:ex.response})
        }else{
            return res.status(400).json({detail:ex})
        }
        
    }
});

router.post("/connectbank", auth_M, async (req, res) => {

    if(!req.body.public_token || !req.body.metadata){
        return res.status(400).json({detail:"Must have Link Token AND Metadata of institution"})
    }

    //To my app, the plaid Development is the Production mode. Plaids Sandbox envionment is the apps development mode
    PLAID_CLIENT_ID = process.env.PLAID_DEV_CLIENT_ID
    PLAID_SECRET = process.env.PLAID_DEV_SECRET
    ITEM_PUBLIC_TOKEN_EXCHANGE = 'https://development.plaid.com/item/public_token/exchange'

    //When The app is in production mode it uses Plaids Development mode
    if (process.env.NODE_ENV=="development" || req.query.env == "sandbox"){
        PLAID_SECRET = process.env.SANDBOX_PLAID_SECRET
        ITEM_PUBLIC_TOKEN_EXCHANGE = 'https://sandbox.plaid.com/item/public_token/exchange'
    }

    let plaidBody={
        "client_id": PLAID_CLIENT_ID,
        "secret": PLAID_SECRET,
        "public_token":req.body.public_token
    }

    try{
        let response = await axios.post(ITEM_PUBLIC_TOKEN_EXCHANGE, plaidBody);

        // console.log("Metadata: ", req.body.metadata)
        console.log("Metadata.institution:: ", req.body.metadata.institution)
        console.log("Metadata.institution.name: ", req.body.metadata.institution.name)
        //Add institution_name
        const newbank = await Bank.create({ item_id: response.data.item_id, 
            access_token: response.data.access_token, 
            user_id:String(req.user.id),
            institution_name: req.body.metadata.institution.name});

        // This is WHERE I SHOULD CREATE ACCOUNTS INSTEAD OF IN WEBHOOK    
        // I would still update account values in webhook
        /** Example of data from plaid link
         * Metadata:  {
            institution: { name: 'PNC', institution_id: 'ins_13' },
            account: { id: null, name: null, type: null, subtype: null, mask: null },
            account_id: null,
            accounts: [
              {
                id: '5RZL5dNP7jhJplDeXmppsDom4wEmpBfZQzakz',
                name: 'Plaid Checking',
                mask: '0000',
                type: 'depository',
                subtype: 'checking'
              },
              {
                id: 'J6P1VnzvkmI8qxKn1mqqFJDBEyeBK3fdeplzb',
                name: 'Plaid Saving',
                mask: '1111',
                type: 'depository',
                subtype: 'savings'
              }
            ],
         */
        console.log("newBank:",newbank)

        return res.status(200).json({detail:response.data})
    }catch(ex){

        if (ex.response.data){
            return res.status(400).json({detail:ex.response.data})
        }else if (ex.response){
            return res.status(400).json({detail:ex.response})
        }else{
            return res.status(400).json({detail:ex})
        }
        // console.log("ex:", ex)
        // return res.status(400).json({detail:String(ex)})
    }
});


module.exports = router;