export const errorMiddleware = (err, req, res, next) => {
    // Set default error message if not provided
    err.message || (err.message = "Some internal error occurred!");
    // Set default status code if not provided
    err.statusCode || (err.statusCode = 500);
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
    });
};
// Utility function to wrap async controller functions for error handling
export const tryCatch = (func) => (req, res, next) => {
    return Promise.resolve(func(req, res, next)).catch(next);
};
