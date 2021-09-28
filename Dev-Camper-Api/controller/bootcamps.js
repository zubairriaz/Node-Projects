const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/ErrorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geocoder");

exports.getAllBootCamps = asyncHandler(async (req, res, next) => {
	let queryString  = JSON.stringify(req.query);

	queryString = queryString.replace(/in|gte|gt|lte|lt/gm,match=>`$${match}`);
	console.log(queryString)

	console.log(JSON.parse(queryString))
	let query = Bootcamp.find(JSON.parse(queryString)); 
	const bootcamps = await query
	res.status(200).send({ sucess: true, data: bootcamps });
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
	console.log(loc)
	const lon = loc[0].longitude;
	const lat = loc[0].latitude;


	const radius = distance / 3963;
	const bootcamps = await Bootcamp.find({
		location: { $geoWithin: { $centerSphere: [[lon, lat], radius] } },
	});
	console.log(bootcamps)
	res.status(200).send({
		sucess: true,
		data: bootcamps,
	});
});
