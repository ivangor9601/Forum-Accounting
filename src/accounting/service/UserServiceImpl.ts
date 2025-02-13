import UserService from "./UserService";
import NewUserDto from "../dto/NewUserDto";
import UserDto from "../dto/UserDto";
import {User} from "../model/User";
import {NotFoundError} from "routing-controllers";

export default class UserServiceImpl implements UserService{
    async register(newUserDto: NewUserDto): Promise<UserDto> {
        const newUser = new User({
            ...newUserDto
        });
        const res = await newUser.save();
        return new UserDto(res.login, res.firstName, res.lastName, res.roles);
    }

    async removeUserByLogin(login: string): Promise<UserDto> {
        const user = await User.findOne({login: login});
        if (user === null) {
            throw new NotFoundError(`User with login ${login} not found`);
        }
        await user.deleteOne();
        return new UserDto(user.login, user.firstName, user.lastName, user.roles);
    }

    async addUserRole(login: string, role: string): Promise<UserDto> {
        const user = await User.findOneAndUpdate({login: login}, {
            $push: {roles: role}
        }, {new: true});
        if (user === null) {
            throw new NotFoundError(`User with login ${login} not found`);
        }
        return new UserDto(user.login, user.firstName, user.lastName, user.roles);
    }

    async getAllUser(): Promise<UserDto[]> {
        const users = await User.find();
        if(users.length === 0) {
            throw new NotFoundError(`No users found`);
        }
        return users.map(user => {
            return new UserDto(user.login, user.firstName, user.lastName, user.roles);
        })
    }

    async getUserByLogin(login: string): Promise<UserDto> {
        const user = await User.findOne({login: login});
        if (user === null) {
            throw new NotFoundError(`User with login ${login} not found`);
        }
        return new UserDto(user.login, user.firstName, user.lastName, user.roles);
    }

    async removeRole(login: string, role: string): Promise<UserDto> {
        const user = await User.findOneAndUpdate({login: login}, {$pull: {roles: role}}, {new: true});
        if (user === null) {
            throw new NotFoundError(`User with login ${login} not found`);
        }
        return new UserDto(user.login, user.firstName, user.lastName, user.roles);
    }

    async updateUser(login: string, firstName: string, lastName: string): Promise<UserDto> {
        const user = await User.findOneAndUpdate({login: login}, {
            $set: {firstName: firstName, lastName: lastName}
            }, {new: true}
        );
        if (user === null) {
            throw new NotFoundError(`User with login ${login} not found`);
        }
        return new UserDto(user.login, user.firstName, user.lastName, user.roles);
    }
}