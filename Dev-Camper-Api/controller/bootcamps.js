const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");


// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps
// @access    Public
exports.getAllBootCamps = asyncHandler(async (req, res, next) => {
	let queryToRemoved = ["select", "sort"];
	let queryCopy = { ...req.query };
	queryToRemoved.map((qP) => delete queryCopy[qP]);
	let queryString = JSON.stringify(queryCopy);

	queryString = queryString.replace(
		/in|gte|gt|lte|lt/gm,
		(match) => `$${match}`,
	);

	let query = Bootcamp.find(JSON.parse(queryString));

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
	const total = await Bootcamp.countDocuments();

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

	const bootcamps = await query.skip(startIndex).limit(limit);
	res.status(200).send({ sucess: true, pagination, data: bootcamps });
});

exports.getSingleBootCamps = asyncHandler(async (req, res, next) => {
	const { id } = req.params;

	const bootcamp = await Bootcamp.findById(id);
	if (!bootcamp) {
		return next(new ErrorResponse(`bootcamp not found with id ${id}`, 404));
	}

	res.status(200).json({ success: true, data: bootcamp });
});

exports.updateSingleBootCamps = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const { body } = req;
	const bootcamp = await Bootcamp.findByIdAndUpdate(id, body, {
		new: true,
		runValidators: true,
	});
	console.log(bootcamp);
	if (!bootcamp) {
		return res.status(400).json({ success: false });
	}
	res.status(200).json({ success: true, data: bootcamp });
});

exports.deleteSingleBootCamps = asyncHandler(async (req, res, next) => {
	const { id } = req.params;
	const bootcamp = await Bootcamp.findByIdAndDelete(id);
	if (!bootcamp) {
		return res.status(400).json({ success: false });
	}
	res.status(200).json({ success: true, data: {} });
});

exports.createSingleBootCamps = asyncHandler(async (req, res, next) => {
	const { body } = req;
	const bootcamp = await Bootcamp.create(body);
	res.status(201).send({
		sucess: true,
		data: bootcamp,
	});
});

// @desc      Get bootcamps within a radius
// @route     GET /api/v1/bootcamps/radius/:zipcode/:distance
// @access    Private
exports.getBootCampsWithInRadius = asyncHandler(async (req, res, next) => {
	const { zipcode, distance } = req.params;

	const loc = await geocoder.geocode(zipcode);
	console.log(loc);
	const lon = loc[0].longitude;
	const lat = loc[0].latitude;

	const radius = distance / 3963;
	const bootcamps = await Bootcamp.find({
		location: { $geoWithin: { $centerSphere: [[lon, lat], radius] } },
	});
	console.log(bootcamps);
	res.status(200).send({
		sucess: true,
		data: bootcamps,
	});
});
