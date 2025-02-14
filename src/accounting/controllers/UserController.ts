import {Body, Controller, Delete, Get, HeaderParam, Param, Post, Put, Res, UseBefore} from "routing-controllers";
import NewUserDto from "../dto/NewUserDto";
import UserService from "../service/UserService";
import UserServiceImpl from "../service/UserServiceImpl";
import {Response} from "express";
import rolesMiddleware from "../Middleware/rolesMiddleware";

@Controller('/account')
export default class PostController {

    userService: UserService = new UserServiceImpl();

    @Post('/register')
    async register(@Body() newUserDto: NewUserDto) {
        return this.userService.register(newUserDto);
    }

    @Post('/login')
    async login(@HeaderParam('Authorization') token: string, @Res() res: Response) {
        return this.userService.login(token);
    }

    @UseBefore(rolesMiddleware('user'))
    @Delete('/user/:login')
    async removeUserByLogin(@Param('login') login: string, @Res() res: Response) {
        return await this.userService.removeUserByLogin(login).catch((err: any) => res.status(404).send(err));
    }

    @UseBefore(rolesMiddleware('user'))
    @Get('/user/:login')
    async getUserByLogin(@Param('login') login: string, @Res() res: Response) {
        return await this.userService.getUserByLogin(login).catch((err: any)=> res.status(404).send(err));
    }

    @UseBefore(rolesMiddleware('user'))
    @Get('/users')
    async getAllUser(@Res() res: Response) {
        return await this.userService.getAllUser().catch((err: any)=> res.status(404).send(err));
    }

    @UseBefore(rolesMiddleware('user'))
    @Put('/user/:login')
    async updateUser(@Param('login') login: string, @Body() updateUserDto: NewUserDto, @Res() res: Response) {
        return await this.userService.updateUser(login, updateUserDto.firstName, updateUserDto.lastName).catch((err: any)=> res.status(404).send(err));
    }

    @UseBefore(rolesMiddleware('Administrator'))
    @Put('/user/:login/role/:role')
    async addUserRole(@Param('login') login: string, @Param('role') role:string, @Res() res: Response) {
        return await this.userService.addUserRole(login, role).catch((err: any)=> res.status(404).send(err));
    }

    @UseBefore(rolesMiddleware('Administrator'))
    @Delete('/user/:login/role/:role')
    async removeRole(@Param('login')login: string, @Param('role') role:string, @Res() res: Response) {
        return await this.userService.removeRole(login, role).catch((err: any)=> res.status(404).send(err));
    }

}