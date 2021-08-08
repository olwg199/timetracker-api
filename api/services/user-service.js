const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service");
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");

const User = require("../models/user");

class UserService {
    async signup(username, password, email) {
        const candidate = await User.findOne({ username });

        if (candidate) {
            throw new Error(`User with this username  already exists!`)
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const activationLink = uuid.v4();

        const user = await User.create({ username, password: hashPassword, email, activationLink });
        await mailService.sendActivationMail(email, `${process.env.SERVER_ADDRESS}/user/activaet${activationLink}`);

        const userDto = new UserDto(user);
        const tokens = tokenService.generateToken({ ...userDto });
        await tokenService.saveToken(userDto.id, tokens.refreshToken);

        return {
            ...tokens,
            user: userDto
        };
    }
}

module.exports = new UserService();
