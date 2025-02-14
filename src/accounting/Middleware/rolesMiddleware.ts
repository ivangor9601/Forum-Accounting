import {Request, Response, NextFunction} from "express";
import {decodeBase64, encodeBase64} from "../utils/utilsForPasssword";
import {User} from "../model/User";

export default function rolesMiddleware(role: string) {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        const token = req.headers["authorization"];
        if(!token) {
            res.status(401).send("Access denied");
        }
        const [login, password] = decodeBase64((token!.split(" "))[1]).split(":");
        const user = await User.findOne({login: login});
        if (user === null) {
            res.status(404).send("Not found");
            return;
        }
        const pass = user!.password;
        const encodePass = encodeBase64(password);
        if(pass !== encodePass) {
            res.status(403).send("Password not valid");
        } else if(!(user!.roles.includes(role))){
            res.status(401).send(`Access denied (requires ${role} role)`);
        } else {
            next();
        }
    }
}