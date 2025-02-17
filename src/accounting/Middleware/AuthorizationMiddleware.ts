export default function AuthorizationMiddleware(roles?: string) {
    return async (request: any, response: any, next: (err?: any) => any): Promise<any> => {
        const unauthorised = () => response.status(403).send("Unauthorized action");
        const isAdmin = request.user.roles.includes('Administrator');
        const isMod = request.user.roles.includes('Moderator');
        const isOwner = request.params[Object.keys(request.params)[0]] === request.user.login;

        switch (roles) {
            case 'admin only':
                isAdmin ? next() : unauthorised();
                break;
            case 'admin or owner':
                (isAdmin || isOwner) ? next() : unauthorised();
                break;
            case 'mod or owner':
                (isMod || isOwner) ? next() : unauthorised();
                break;
            default:
                isOwner ? next() : unauthorised();
                break;
        }
    }
}