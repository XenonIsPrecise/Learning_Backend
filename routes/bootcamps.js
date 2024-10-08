const express = require("express")
const router = express.Router();
const{getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    bootcampPhotoUpload,
deleteAllBootcamps} = require("../controllers/bootcamps")

const Bootcamp = require("../models/Bootcamps");
const advancedResults = require("../middleware/advancedResults");

// Include other resource routers
const courseRouter = require("./courses");

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);



router
.route("/")
.get(advancedResults(Bootcamp,'courses'),getBootcamps)
.post(createBootcamp);

router.route("/deleteall").delete(deleteAllBootcamps);
router.route("/:id").get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);
router.route("/:id/photo").put(bootcampPhotoUpload);


module.exports = router;