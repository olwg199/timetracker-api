const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service");
const tokenService = require("./token-service");
const UserDto = require("../dtos/user-dto");

const User = require("../models/user");
const ApiError = require("../exceptions/api-error");

class UserService {
    async signup(username, password, email) {
        const candidate = await User.findOne({ username });

        if (candidate) {
            throw ApiError.BadRequest(`User with this username already exists!`)
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
    };

    async activate(activationLink) {
        const user = User.findOne({ activationLink });

        if (!user) {
            throw ApiError.BadRequest("Incorrect activation link.")
        } else {
            user.isActivated = true;
            await user.save();
        }
    };
}

module.exports = new UserService();
