const jwt = require("jsonwebtoken");
const ApiError = require("../exceptions/api-error");
const tokenService = require("../services/token-service");

module.exports = (req, res, next) => {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError());
        } else {
            const accessToken = authorizationHeader.split(/\s/)[1];

            if (!accessToken) {
                return next(ApiError.UnauthorizedError());
            }

            const decoded = tokenService.validateAccessToken(accessToken);

            if (!decoded) {
                return next(ApiError.UnauthorizedError());
            }

            req.userData = decoded;
            next();
        }
    } catch (err) {
        return next(ApiError.UnauthorizedError(err));
    }

};