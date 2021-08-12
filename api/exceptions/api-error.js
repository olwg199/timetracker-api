module.exports = class ApiError extends Error {
    status;
    errors;

    constructor(status, message, errors = []) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    static UnauthorizedError(err) {
        return new ApiError(401, "The user is not authorized.", err)
    }

    static BadRequest(status, message, errors) {
        return new ApiError(400, message, errors);
    }

    static InvalidId(message, errors) {
        return new ApiError(404, message, errors);
    }

    static ValidationError(message, errors) {
        return new ApiError(404, message, errors);
    }
}