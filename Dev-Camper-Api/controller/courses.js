const Course = require("../models/Course");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");

// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getAllCourses = asyncHandler(async (req, res, next) => {
	let queryToRemoved = ["select", "sort"];
	let queryCopy = { ...req.query };
	queryToRemoved.map((qP) => delete queryCopy[qP]);
	let queryString = JSON.stringify(queryCopy);

	queryString = queryString.replace(
		/in|gte|gt|lte|lt/gm,
		(match) => `$${match}`,
	);

	let query;
	if (req.params.bootcampId) {
		let parsedQueryString = JSON.parse(queryString);
		parsedQueryString = {
			...parsedQueryString,
			bootcamp: req.params.bootcampId,
		};
		query = Course.find(parsedQueryString);
	}else{
        query = Course.find(JSON.parse(queryString));
    }

	if (req.query.select) {
		let selectClause = req.query.select;
		selectClause = selectClause.split(",").join(" ");
		query.select(selectClause);
	}

	if (req.query.sort) {
		let sortClause = req.query.sort;
		sortClause = sortClause.split(",").join(" ");
		query.sort(sortClause);
	}

	//pagination
	const page = parseInt(req.query.page) || 1;
	const limit = parseInt(req.query.limit) || 1;
	const startIndex = (page - 1) * limit;
	const endIndex = page * limit;
	const total = await Course.countDocuments();

	const pagination = {};

	if (endIndex < total) {
		pagination.next = {
			page: page + 1,
			limit,
		};
	}

	if (startIndex > 0) {
		pagination.prev = {
			page: page - 1,
			limit,
		};
	}

	const courses = await query.skip(startIndex).limit(limit);
	res.status(200).send({ sucess: true, pagination, data: courses });
});
