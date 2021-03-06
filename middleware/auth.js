
const axios = require('axios');

const baseUrl = process.env.FGR_BUDGET_AUTH_URL

module.exports = async function (req, res, next) {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ detail: 'Unauthorized, no auth token provided' })

    try {
        let axiosConfig = getAxiosConfig(token);
        let response = await axios.post(baseUrl + "/auth", {}, axiosConfig);
        req.user = response.data
        next();
    } catch (ex) {
        if (ex.response) {
            return res.status(400).json({ detail: ex.response.data })
        } else {
            return res.status(400).json({ detail: JSON.stringify(ex) })
        }
    }
}

function getAxiosConfig(token) {
    let axiosConfig = {
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
            "Access-Control-Allow-Origin": "*",
            "x-auth-token": token
        }
    };
    return axiosConfig;
}
