const jwt = require('jsonwebtoken');
const JWT_SECRET = 'Mynameis@Niloy653'

const fetchuser = (req, res, next)=>{
    // Get the User from the JWT Token and ADD Id to Req Object 
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({error: "Please Enter a Valid Token"})
    }
    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;
        next()
    } catch (error) {
        res.status(401).send({error: "Please Authenticate Using a Valid Token"});
    }
    
}

module.exports = fetchuser;