export default function AuthorizationMiddleware(roles?: string) {
    return async (request: any, response: any, next: (err?: any) => any): Promise<any> => {
        const key = Object.keys(request.params)[0];
        switch (roles) {
            case 'admin only':
                request.user.roles.includes('Administrator') ? next() :
                    response.status(403).send("Unauthorized action (needs admin role)");
                break;
            case 'admin or owner':
                if (request.user.roles.includes('Administrator') ||
                    (request.params[key] === request.user.login)){
                    next();
                } else {
                    response.status(403).send("Unauthorized action");
                }
                break;
            case 'mod or owner':
                if (request.user.roles.includes('Moderator') ||
                    (request.params[key] === request.user.login)){
                    next();
                } else {
                    response.status(403).send("Unauthorized action");
                }
                break;
            default:
                request.params[key] === request.user.login ? next() :
                    response.status(403).send("Unauthorized action");
                break;
        }
    }
}