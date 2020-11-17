const express = require('express');
const router = express.Router();
const Category = require('../models/Category');
const {Transaction} = require('../models/Transaction');
const auth_M = require('../middleware/auth');
const { Op } = require("sequelize");


//Get all Catgeories /category
router.get("/", auth_M, async (req, res) => {
    try {
        let allCategories = await Category.findAll({
            where: {
                user_id: String(req.user.id)
            }
        });

        res.send({ categories: allCategories });
    } catch (e) {
        res.status(500).send({ "Error": e });
    }

});

//Get category-detail /category/:id
router.get("/:id", auth_M, async (req, res) => {
    try {

        if (req.params.id != parseInt(req.params.id)){ 
            return res.status(400).json({ detail: "query param must be integer" })
        }

        const category = await Category.findOne({where: {
            [Op.and]: [
                { id: req.params.id },
                { user_id: String(req.user.id) }
              ]
        }});
        if (!category) return res.status(404).json({detail: `could not find category with id: ${req.params.id}`});

        //if found send back to client
        res.json(category);
    } catch (e) {
        res.status(500).send({ "Error": e });
    }

});

//Create a category  /category
router.post("/", auth_M, async (req, res) => {
    try {
        console.log("req.body: ",req.body)
        if(!req.body || !req.body.name || !req.body.color){
            return res.status(400).json({detail:"Please Send a valid category body"});
        }

        let category = await Category.findOne({
            where: {
                [Op.and]: [
                    { name: req.body.name },
                    { user_id: String(req.user.id) }
                  ]
            }
        });
        if (category) return res.status(400).json({detail:"A category already exists with that name"});

        let newCategory = await Category.create({ name: req.body.name, color: req.body.color, user_id: req.user.id});

        res.json({ category: newCategory });
    } catch (error) {
        res.status(500).json({ "Error": String(error) });
    }

});

//patch a category
router.patch("/:id", auth_M, async (req, res) => {
    try {
        if (req.params.id != parseInt(req.params.id)){ 
            return res.status(400).json({ detail: "query param must be integer" })
        }

        let category = await Category.findOne({where: {
            [Op.and]: [
                { id: req.params.id },
                { user_id: String(req.user.id) }
              ]
        }});
        if (category == null) return res.status(400).json({detail:`could not find category with id: ${req.params.id}`});

        if (req.body && req.body.name) {

            let otherCategory = await Category.findOne({
                where: {
                    [Op.and]: [
                        { id: { [Op.ne]: req.params.id } },
                        { name: req.body.name },
                        { user_id: String(req.user.id) }
                      ]
                }
            });
            if (otherCategory) return res.status(400).json({detail:"A category already exists with that name"});

            category.name = req.body.name;
        }

        if (req.body && req.body.color) {
            category.color = req.body.color;
        }

        await category.save();

        res.json({category});
    } catch (e) {
        res.status(500).send({ "Error": e });
    }

});

// DELETE categories /categroy/:id  delete a category
router.delete("/:id", auth_M, async (req, res) => {
    try {
        if (req.params.id != parseInt(req.params.id)){ 
            return res.status(400).json({ detail: "query param must be integer" })
        }

        const category = await Category.findOne({where: {
            [Op.and]: [
                { id: req.params.id },
                { user_id: String(req.user.id) }
              ]
        }});
        if (category === null) {
            return res.status(404).json({detail:`No category with id ${req.params.id} was found`})
        }

        category = await category.destroy();

        return res.json({category})
    } catch (e) {

        return res.status(500).send({ "Error": String(e) });
    }
});



module.exports = router;