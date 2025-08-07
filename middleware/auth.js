const jwt = require('jsonwebtoken');
require('dotenv').config();

const auth = (req, res, next) => {
    try {
        // 1. Header එකෙන් token එක ගන්නවා
        const token = req.header('Authorization')?.replace('Bearer ', '');

        // 2. Token එකක් නැත්නම්, 401 Unauthorized error එකක් යවනවා
        if (!token) {
            return res.status(401).json({ msg: 'No token, authorization denied.' });
        }

        // 3. Token එක verify කරනවා
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 4. Decode කරපු payload එක, req.user එකට දානවා
        req.user = decoded; // { id: '...', role: '...' }

        // 5. හැමදේම හරි නම්, ඊළඟ function එකට යනවා
        next();

    } catch (error) {
        // Token එක invalid නම් (expired, wrong signature), 
        // 401 Unauthorized error එකක් යවනවා
        console.error('Token verification failed:', error.message);
        res.status(401).json({ msg: 'Token is not valid.' });
    }
};

const role = (...roles) => {
    return (req, res, next) => {
        // req.user එකක් නැත්නම්, unauthorized error එකක් එන්න පුළුවන්, ඒකත් handle කරමු
        if (!req.user || !req.user.role) {
            return res.status(401).json({ msg: 'Authentication error.' });
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ msg: `Forbidden: Role '${req.user.role}' is not authorized.` });
        }
        next();
    };
};

module.exports = {
    auth,
    role
};