const express = require("express")
const router = express.Router();
const{getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
deleteAllBootcamps} = require("../controllers/bootcamps")

// Include other resource routers
const courseRouter = require("./courses");

// Re-route into other resource routers
router.use("/:bootcampId/courses", courseRouter);



router.route("/").get(getBootcamps).post(createBootcamp);
router.route("/deleteall").delete(deleteAllBootcamps);
router.route("/:id").get(getBootcamp).put(updateBootcamp).delete(deleteBootcamp);

module.exports = router;