const CategoryTransaction = require('../models/CategoryTransaction');
const Transaction = require('../models/Transaction');
const { Op } = require("sequelize");

//This Util function gets the real value of a budget 
//based on the transactions that have the budget category assigned to them.
module.exports = async function(category_id, user_id){
    let actual_value = 0

    //Get CategoryTransactions Based on user and category
    let categorytransactions = await CategoryTransaction.findAll({
        where:{
            [Op.and]: [
                { category_id: category_id },
                { user_id: user_id }
            ]
        }
    });

    //Get Transaction_ids from CategoryTransactions
    let transaction_ids = []
    for(let i =0;i<categorytransactions.length;i++){
        transaction_ids.push(categorytransactions[i].transaction_id)
    }

    //Get Transactions using transaction_ids
    let transactions = await Transaction.findAll({
        where:{
            id: transaction_ids
        }
    });

    //calculate actual from transactions
    for(let j =0;j<transactions.length;j++){
        actual_value += transactions[j].amount
    }

    return actual_value
}