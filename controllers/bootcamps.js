const path = require('path');
const Bootcamp = require('../models/Bootcamps');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');


// Description: Get all bootcamps
// route: GET /api/v1/bootcamps
// access: Public
// Version: 1.0


exports.getBootcamps = asyncHandler(async (req,res,next)=>{
        res.status(200).json(res.advancedResults)
})

// Description: Get single bootcamp
// Version: 1.0
// route: GET /api/v1/bootcamps/:id
// access: Public


exports.getBootcamp = asyncHandler(async (req,res,next)=>{
        const bootcamp = await Bootcamp.findById(req.params.id)
        if(!bootcamp){
            //This one fires up if the id have the correct format but not found in the database i.e same length but not found
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
        }                       

        res.status(200).json({success:true,data:bootcamp})
    } 
)
// Description: Create new bootcamp
// Version: 1.0
// route: POST /api/v1/bootcamps
// access: Private

exports.createBootcamp = asyncHandler(async (req,res,next)=>{
    
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({success:true,data:bootcamp})
})

// Description: Update bootcamp
// Version: 1.0
// route: PUT /api/v1/bootcamps/:id
// access: Private

exports.updateBootcamp = asyncHandler(async (req,res,next)=>{
    const bootcamp = await Bootcamp.findByIdAndUpdate(req
        .params.id,req.body,{
            new:true,
            runValidators:true
        });
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
        }
        res.status(200).json({success:true,data:bootcamp})
})

// Description: Delete bootcamp
// Version: 1.0
// route: DELETE /api/v1/bootcamps/:id
// access: Private

exports.deleteBootcamp = asyncHandler(async (req,res,next)=>{
    const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
    }

    await Bootcamp.deleteOne({ _id: req.params.id });

    res.status(200).json({success:true,data:{
        message:'Bootcamp deleted'
    }})
})

// Description: Delete all bootcamps
// Version: 1.0
// route: DELETE /api/v1/bootcamps
// access: Private

exports.deleteAllBootcamps = asyncHandler(async (req,res,next)=>{
    await Bootcamp.deleteMany();
    res.status(200).json({success:true,data:{
        message:'All bootcamps deleted'
    }})
})

//Photo Upload
// Version: 1.0
// route: PUT /api/v1/bootcamps/:id/photo
// access: Private

exports.bootcampPhotoUpload = asyncHandler(async (req,res,next)=>{
    const bootcamp = await Bootcamp.findById(req.params.id);
    if(!bootcamp){
        return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
    }

    if(!req.files){
        return next(new ErrorResponse(`Please upload a file`,400));
    }

    const file = req.files.file;
    //Make sure the image is a photo
    if(!file.mimetype.startsWith('image')){
        return next(new ErrorResponse(`Please upload an image file`,400));
    }

    //Check file size
    if(file.size > process.env.MAX_FILE_UPLOAD){
        return next(new ErrorResponse(`Please upload an image less than ${process.env.MAX_FILE_UPLOAD}`,400));
    }

    //Create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;
    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`,async err=>{
        if(err){
            console.error(err);
            return next(new ErrorResponse(`Problem with file upload`,500));
        }

        await Bootcamp.findByIdAndUpdate(req.params.id,{photo:file.name});

        res.status(200).json({success:true,data:file.name});

}
)});



