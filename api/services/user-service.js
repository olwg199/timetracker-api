const bcrypt = require("bcrypt");
const uuid = require("uuid");
const mailService = require("./mail-service");

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
        await mailService.sendActivationMail(email, activationLink);
    }
}

module.exports = new UserService();
