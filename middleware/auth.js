const jwt = require("jsonwebtoken");
require("dotenv").config();

const auth = async (req, res, next) => {
    try {
        const token = req.header("Authorization")?.replace('Bearer ', ''); //token ekth ekk space thiyenw nm ewa ain wenw replace bearer eken

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' })
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Unauthorize' })
    }
}

const role = (...role) =>{
    return (req, res, next) => {
        if (req.user.role !== role) {
            return res.status(401).json({ error: 'Forbidden' });
        }
        next();
    }
}

module.exports = { auth, role };
