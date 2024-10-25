const express = require("express")
const router = express.Router();
const {protect,authorize} = require("../middleware/auth");
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
const reviewRouter = require("./reviews");

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/reviews", reviewRouter);



router
.route("/")
.get(advancedResults(Bootcamp,'courses'),getBootcamps)
.post(protect,authorize('publisher','admin'),createBootcamp);

router.route("/deleteall").delete(deleteAllBootcamps);
router
.route("/:id")
.get(getBootcamp)
.put(protect,authorize('publisher','admin'),updateBootcamp)
.delete(protect,authorize('publisher','admin'),deleteBootcamp);
router.route("/:id/photo").put(protect,authorize('publisher','admin'),bootcampPhotoUpload);


module.exports = router;