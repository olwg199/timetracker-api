const userService = require("../services/user-service");

class UserController {
    async signup(req, res, next) {
        try {
            const { username, email, password } = req.body;
            const userData = await userService.signup(username, password, email);
            res.cookie("refreshToken", userData.refreshToken, {});
            return res.json(userData);
        } catch (e) {
            console.log(e);
        }
    };
}

module.exports = new UserController();