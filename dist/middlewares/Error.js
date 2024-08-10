export const errorMiddleware = (err, req, res, next) => {
    err.message || (err.message = "Some internal error occurred!");
    res.status(400).json({
        success: false,
        message: err.message,
    });
};
