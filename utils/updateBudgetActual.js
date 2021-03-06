const { Op } = require("sequelize");
const Budget = require('../models/Budget')
const getBudgetActual = require('./getBudgetActual')

//This util function updates a budgets when categories change for a specifc user
module.exports = async function(category_id, user_id){

    //Get CategoryTransactions Based on user and category
    let updatedbudgets = await Budget.findAll({
        where:{
            [Op.and]: [
                { category_id: category_id },
                { user_id: user_id }
            ]
        }
    });

    let budget_real = await getBudgetActual(category_id, user_id)


    //Update budgets
    for(let i =0;i<updatedbudgets.length;i++){
        updatedbudgets[i].budget_real = budget_real
        updatedbudgets[i].save()
    }
    return updatedbudgets
}