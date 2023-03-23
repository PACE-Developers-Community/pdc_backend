var jwt = require('jsonwebtoken');
const jwtkey = "azlanisagoodboy";


const fetchUser = (req, res, next)=>{

    const token = req.header('auth-token');
    if(!token){
        return res.status(401).json({error: "access denied"});
    }
try {
    const data = jwt.verify(token, jwtkey);
    req.user =data.user
    next();
} catch (error) {
    console.error(error.message);
    res.status(401).json({error: "access denied"});
   }


}

module.exports = fetchUser;