const express = require("express");
const router = express.Router();

const {
	getAllBootCamps,
	getSingleBootCamps,
	updateSingleBootCamps,
	createSingleBootCamps,
	deleteSingleBootCamps,
	getBootCampsWithInRadius
} = require("../controller/bootcamps");

router.route("/").get(getAllBootCamps).post(createSingleBootCamps);
router.route("/radius/:zipcode/:distance").get(getBootCampsWithInRadius)

router
	.route("/:id")
	.get(getSingleBootCamps)
	.put(updateSingleBootCamps)
	.delete(deleteSingleBootCamps);

module.exports = router;
