import aj from "#config/arcjet.js";
import logger from "#config/logger.js";
import { slidingWindow } from "@arcjet/node";

const securityMiddleware = async (req, res, next) => {
    try {
        const role = res.user?.role || 'guest';
        let limit;
        let message;
        switch(role){
            case 'admin':
                limit=20
                message='Admin req limit exceeded (20 req per min)'
            break;
            case 'user':
                limit=10
                message='User req limit exceeded (10 req per min)'
            break;
            default:
                limit=5
                message='Guest req limit exceeded (5 req per min)'
        }
        const client = aj.withRule(slidingWindow(       {
            mode: "LIVE",
            interval: "1m",
            max: limit,
            name: `${role}_req_limit`
        }));
        const decision = await client.protect(req);
        if(decision.isDenied() && decision.reason.isBot()){
            logger.error(`Bot detected:` , {ip: req.ip, userAgent: req.get('User-Agent'), path: req.path});
            return res.status(403).json({ error: 'Forbidden' , message: 'Bot detected' });
        }
        if(decision.isDenied() && decision.reason.isShield()){
            logger.error(`Shield detected:` , {ip: req.ip, userAgent: req.get('User-Agent'), path: req.path});
            return res.status(403).json({ error: 'Forbidden' , message: 'Shield detected' });
        }
        if(decision.isDenied() && decision.reason.isRateLimit()){
            logger.error(`Rate limit exceeded:` , {ip: req.ip, userAgent: req.get('User-Agent'), path: req.path});
            return res.status(429).json({ error: 'Too Many Requests' , message: 'Rate limit exceeded' });
        }
        next();
    } catch (e) {
        console.error('Arcjet middleware error', e);
        return res.status(500).json({ error: 'Internal Server Error' , message: 'something went wrong with security middleware' });
    }
}

export default securityMiddleware;