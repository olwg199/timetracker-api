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

    async login(req, res, next) {
        try {
            const { username, password } = req.body;
            const userData = await userService.login(username, password);
            res.cookie("refreshToken", userData.refreshToken, {});
            return res.json(userData);
        } catch (e) {
            next(e);
        }
    };

    async logout(req, res, next) {
        const { refreshToken } = req.cookies;
        const token = await userService.logout(refreshToken);
        res.clearCookie("refreshToken");
        return res.status(200).json({ token });
    };

    async refresh(req, res, next) {
        const { refreshToken } = req.cookies;

        const userData = await userService.refresh(refreshToken);
        res.cookie("refreshToken", userData.refreshToken, {});
        return res.json(userData);
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