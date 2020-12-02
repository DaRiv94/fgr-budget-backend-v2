const express = require('express');
const router = express.Router();
const CategoryTransaction = require('../models/CategoryTransaction');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');
const auth_M = require('../middleware/auth');
const { Op } = require("sequelize");
const updateBudgetActual = require('../utils/updateBudgetActual')


//Get all CatgeoryTransactions /categorytransaction
router.get("/", auth_M, async (req, res) => {
    try {
        let allCategoryTransaction = await CategoryTransaction.findAll({
            where: {
                user_id: String(req.user.id)
            }
        });

        res.send({ categorytransactions: allCategoryTransaction });
    } catch (e) {
        res.status(500).send({ "Error": e });
    }
});

//Create a CatgeoryTransaction  /categorytransaction
router.post("/", auth_M, async (req, res) => {
    try {
        console.log("req.body: ", req.body)
        if (!req.body || !req.body.category_id || !req.body.transaction_id) {
            return res.status(400).json({ detail: "Please Send a valid categorytransaction body" });
        }

        //Ensure Transaction exists
        const transaction = await Transaction.findByPk(req.body.transaction_id);
        if (transaction === null)  return res.status(400).json({ detail: "That Transaction doesnt exists" });

        //Ensure category exists
        const category = await Category.findByPk(req.body.category_id);
        if (category === null)  return res.status(400).json({ detail: "That Category doesnt exists" });

        let categorytransaction = await CategoryTransaction.findOne({
            where: {
                [Op.and]: [
                    { category_id: req.body.category_id },
                    { transaction_id: req.body.transaction_id },
                    { user_id: String(req.user.id) }
                ]
            }
        });
        if (categorytransaction) return res.status(400).json({ detail: "That categorytransaction already exists" });

        let newCategorytransaction = await CategoryTransaction.create({ category_id: req.body.category_id, transaction_id: req.body.transaction_id, user_id: req.user.id });

        //Update budget that are effected by this
        await updateBudgetActual(req.body.category_id, String(req.user.id))

        res.json({ categorytransaction: newCategorytransaction });
    } catch (error) {
        res.status(500).json({ "Error": String(error) });
    }

});

// DELETE CatgeoryTransaction /categorytransaction/:id  delete a CatgeoryTransaction
router.delete("/:id", auth_M, async (req, res) => {
    try {
        if (req.params.id != parseInt(req.params.id)) {
            return res.status(400).json({ detail: "query param must be integer" })
        }

        let categorytransaction = await CategoryTransaction.findOne({
            where: {
                [Op.and]: [
                    { id: req.params.id },
                    { user_id: String(req.user.id) }
                ]
            }
        });
        if (categorytransaction === null) {
            return res.status(404).json({ detail: `No category with id ${req.params.id} was found` })
        }
        let category_id = categorytransaction.category_id // for budget update
        categorytransaction = await categorytransaction.destroy();

        //Update budget that are effected by this
        await updateBudgetActual(category_id, String(req.user.id))

        return res.json({ categorytransaction })
    } catch (e) {

        return res.status(500).send({ "Error": String(e) });
    }
});

module.exports = router;