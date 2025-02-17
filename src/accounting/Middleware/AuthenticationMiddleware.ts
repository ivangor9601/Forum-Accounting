import {ExpressMiddlewareInterface} from "routing-controllers";
import jwt, {JwtPayload} from "jsonwebtoken";

export class AuthenticationMiddleware implements ExpressMiddlewareInterface{
    async use(request: any, response: any, next: (err?: any) => any): Promise<any> {
        const token = request.headers["authorization"];
        if(!token) {
            response.status(401).send("Access denied");
        }
        const jwtToken = (token.split(" "))[1];
        try {
            request.user = jwt.verify(jwtToken, process.env.JWT_SECRET!) as JwtPayload;
            next();
        } catch (err) {
            response.status(403).send("Invalid token");
        }
    }

}