const Bootcamp = require('../models/Bootcamps');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');


// Description: Get all bootcamps
// route: GET /api/v1/bootcamps
// access: Public
// Version: 1.0


exports.getBootcamps = asyncHandler(async (req,res,next)=>{
        let query;

        // Copy req.query
        const reqQuery = { ...req.query };

        // Fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit'];

        // Loop over removeFields and delete them from reqQuery
        removeFields.forEach(param => delete reqQuery[param]);

        // Create query string
        let queryStr = JSON.stringify(reqQuery);

        // Create operators ($gt, $gte, $lt, $lte, $in)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

        // Finding resource
        query = Bootcamp.find(JSON.parse(queryStr)).populate('courses');

        // Select Fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }

        // Sort
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        // Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 25;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Bootcamp.countDocuments();

        query = query.skip(startIndex).limit(limit);

        // Execute the query
        const bootcamps = await query;  
        // Pagination result
        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            };
        }
        
        res.status(200).json({success:true,count:bootcamps.length,pagination,data:bootcamps})
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



