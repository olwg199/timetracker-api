const userService = require("../services/user-service");

class UserController {
    async signup(req, res, next) {
        try {
            const { username, email, password } = req.body;
            const userData = await userService.signup(username, password, email);
            res.cookie("refreshToken", userData.refreshToken, {});
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    };

    async activate(req, res, next) {
        try {
            const activationLink = req.body.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL);
        } catch (e) {
            next(e);
        }
    };
}

module.exports = new UserController();