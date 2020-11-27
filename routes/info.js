const express = require('express');
const moment = require('moment');
const router = express.Router();
const Bank = require('../models/Bank')
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const auth_M = require('../middleware/auth');
const { Op } = require("sequelize");

router.get("/user", auth_M, async (req, res) => {
    try {

        res.send({ user: req.user });
    } catch (e) {

        res.status(500).send({ "Error": String(e) });
    }

});

router.get("/transactions", auth_M, async (req, res) => {
    try {
        
        //let allTransactions = await Transaction.find(); // mongoose orm 
        let allTransactions = await Transaction.findAll({
            where: {user_id: String(req.user.id)}
        });

        res.send({ transactions: allTransactions });
    } catch (e) {

        res.status(500).send({ "Error": String(e) });
    }

});

router.get("/accounts", auth_M, async (req, res) => {
    try {
        // let allAccounts = await Account.find(); // mongoose orm 
        let allAccounts = await Account.findAll({
            where: {user_id: String(req.user.id)}
        });

        res.send({ accounts: allAccounts });
    } catch (e) {
        res.status(500).send({ "Error": e });
    }
});

router.get("/banks", auth_M, async (req, res) => {
    try {
        // let allAccounts = await Account.find(); // mongoose orm 
        let banks = await Bank.findAll({
            where: {
                user_id: String(req.user.id)
            }
        });

        res.send({ banks: banks, user:req.user });
    } catch (e) {
        res.status(500).send({ "Error": e });
    }
});

router.get("/monthly-summary", auth_M, async (req, res) => {
    // MSUFCU checking acount id = owynnqe8OPTEbbg7N7Z3Fxp9D04kELUBq6ego
    // MSUFCU credit account id = 5oMJJxKby1CBnn1bmbDRI9wQbEr8xXuB8gPM4
    // MSUFCU saving account id = ZDjyyBVwnpSwPPOB9BEJCBMpkPvnN0fRwDBo8
    let month = null;
    let readable_Month = null;
    if (req.query.month) {
        month = moment().month(req.query.month).format("M");
        readable_Month = moment().month(req.query.month).format("MMMM");
    }


    let year = null;
    if (req.query.year) {
        year = moment().year(req.query.year).format("Y");
    }



    let checking = {};
    let credit = {};
    let savings = {};
    let allAccounts = {};
    let accountsSummary = [];
    let allTransactions = {};
    try {
        // console.log("/monthly-summary req.user.id:", req.user.id)
        let banks = await Bank.findAll({
            where: {
                user_id: String(req.user.id)
            }
        })
        // console.log("BANK LENGTH: ", banks.length)
        bank_item_ids = []
        for(let k = 0; k < banks.length; k++){
            bank_item_ids.push(banks[k].item_id)
            // console.log("Pushing bank_item_id: ", banks[k].item_id)
        }

        let allAccounts = await Account.findAll({
            where: {
                item_id: {
                    [Op.in]: bank_item_ids
                  }
            }
        });


        // console.log("allAccounts length: ", allAccounts.length)
        for(let j = 0; j < allAccounts.length; j++){
            let account = {};

            let institution_name = ""
            for(let l = 0; l < banks.length; l++){
                if(banks[l].item_id == allAccounts[j].item_id){
                    institution_name = banks[l].institution_name
                }
            }

            account.institution_name = institution_name
            account.name = allAccounts[j].name;
            account.id = allAccounts[j].account_id;
            account.balence = allAccounts[j].available_balance;
            account.monthly_net_spending = await getMonthlyNetSpendingByAccountId(account.id, month, year);
            
            accountsSummary.push(account);
        }


        // for (let i = 0; i < allAccounts.length; i++) {
        //     let account = {};

        //     accountNames = ["Online Savings Account", "Interest Checking", "84 - Totally Green Checking", "30 - Platinum Plus Visa", "Spartan Saver"]

        //     if (accountNames.includes(allAccounts[i].name)) {
        //         account.name = allAccounts[i].name;
        //         account.id = allAccounts[i].account_id;
        //         account.balence = allAccounts[i].available_balance;
        //         account.monthly_net_spending = await getMonthlyNetSpendingByAccountId(account.id, month, year);
        //     }
        //     accountsSummary.push(account);
        // }

        // readable_Month =  month=moment().month(req.query.month).format("MMMM");
        res.send({ summary: accountsSummary, month: readable_Month });

    } catch (e) {
        res.status(500).send({ "Error": String(e) });
    }



});

async function getMonthlyNetSpendingByAccountId(accountId, month = null, year = null) {

    let spending = {};
    spending.net = 0;
    spending.transactions = [];
    spending.out = 0;
    if (month == null) {
        date_now = new Date();
        month = date_now.getMonth() + 1
    }

    if (year == null) {
        date_now = new Date();
        year = date_now.getFullYear()
    }


    try {
        let allTransactions = await Transaction.findAll({
            where: {
                account_id: accountId
            }
        })

        // console.log("allTransactions: ",allTransactions)

        // let allTransactions = await Transaction.find({account_id:accountId}); // Mongoose orm

        for (let i = 0; i < allTransactions.length; i++) {

            if ((allTransactions[i].date.getMonth() + 1) == month && allTransactions[i].date.getFullYear() == year.toString()) {
                spending.net += allTransactions[i].amount;
                let transaction = {
                    value: allTransactions[i].amount,
                    name: allTransactions[i].name,
                    date: moment(allTransactions[i].date).format('L')
                }

                spending.transactions.push(transaction);
                if (allTransactions[i].amount > 0) {
                    spending.out += allTransactions[i].amount;
                }
            }
        }

    } catch (e) {
        console.log("getMonthlyNetSpendingByAccountId Error:", String(e))
        console.log("getMonthlyNetSpendingByAccountId Error:", String(e.response.data))
    }

    return spending;
}




module.exports = router;