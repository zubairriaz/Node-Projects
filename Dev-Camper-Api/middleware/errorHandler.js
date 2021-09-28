const ErrorResponse = require("../utils/ErrorResponse");

const errorHandler = (err, req, res, next) => {
    console.log(err)
	let error = {...err}
	error.message = err.message
    if (err.name == "CastError"){
        const message = `Resource not found with id ${err.value}`;
		error = new ErrorResponse(message, 404);
	}
	res.status(error.status || 500).json({
		success: false,
		message: error.message || "Server Error",
	});
};

module.exports = errorHandler;
