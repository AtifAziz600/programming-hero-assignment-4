export const errorHandler = (err, _req, res, _next) => {
    console.error(err);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Something went wrong",
        errorDetails: statusCode === 500 && process.env.NODE_ENV === "development" ? err.stack : undefined,
    });
};
