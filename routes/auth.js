const express = require('express');
const router = express.Router();
// const jwt = require("jsonwebtoken");
const axios = require("axios");

//This is the dynamic auth url
const baseUrl="http://fgr_dynamic_auth_web_1:4000/";
// const baseUrl="http://localhost:4000/";

router.post("/register", async (req,res)=>{
    let email = req.body.email || null
    let password = req.body.password || null
    let password2 = req.body.password2 || null
    
    try{
        // let response = await axios.post(baseUrl+"register", {email, password, password2}, getAxiosConfig() );
        let response = await axios.post(baseUrl+"register", {email, password, password2} );
        
        return res.status(response.status).send(response.data)
    }catch(ex){
        console.log("ex:",ex)
        // console.log("ERROR: ", String(ex))
        // console.log("ERROR: ", ex.response.data)
        
        return res.status(400).json({detail:ex.response.data})
        // return res.status(500).send("Error: ", JSON.stringify(ex))
    }
});

router.post("/login", async (req,res)=>{
    let email = req.body.email || null
    let password = req.body.password || null
    
    try{

        let response = await axios.post(baseUrl+"auth/login", {email, password});

        return res.status(response.status).send(response.data)
    }catch(ex){
        console.log("ERROR: ", String(ex))
        if (ex.response){
            return res.status(400).json(ex.response.data)
        }else{
            return res.status(400).json({detail:JSON.stringify(ex)})
        }
        
        // return res.status(500).send("Error: ", JSON.stringify(ex))
    }
});

// /auth route for Frontend to double check auth whenever it loads a component
router.post("/", async (req,res)=>{
    const token = req.header('x-auth-token');
    if(!token) return res.status(401).json({detail:'Unauthorized, no auth token provided'})

    try{
        let axiosConfig = getAxiosConfig(token);
        let response = await axios.post(baseUrl+"auth",{}, axiosConfig );
        // console.log("response")
        return res.status(200).json({response:response.data})
    }catch(ex){
        // console.log("ex: ", ex)
        if (ex.response){
            return res.status(400).json({detail:ex.response.data})
        }else{
            return res.status(400).json({detail:JSON.stringify(ex)})
        }
    }
});

function getAxiosConfig(token){
    let axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
            "x-auth-token":token
        }
    };
    return axiosConfig;
}

module.exports=router;

