const express = require("express");
const router = express.Router();

const { getAllCourses } = require("../controller/courses");

router.route("/").get(getAllCourses);
router.route("/:bootcampId").get(getAllCourses);

module.exports = router;
