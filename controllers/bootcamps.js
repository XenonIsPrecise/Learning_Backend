const Bootcamp = require('../model/Bootcamps');
const ErrorResponse = require('../utils/errorResponse');


// Description: Get all bootcamps
// route: GET /api/v1/bootcamps
// access: Public
// Version: 1.0


exports.getBootcamps = async (req,res,next)=>{

    try {
        const bootcamps = await Bootcamp.find();
        res.status(200).json({success:true,count:bootcamps.length ,data:bootcamps})
        
    } catch (error) {
        next(error);
        
    }
    
    
}

// Description: Get single bootcamp
// Version: 1.0
// route: GET /api/v1/bootcamps/:id
// access: Public

exports.getBootcamp = async (req,res,next)=>{
    try {
        const bootcamp = await Bootcamp.findById(req.params.id)
        if(!bootcamp){
            //This one fires up if the id have the correct format but not found in the database i.e same length but not found
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
        }                       

        res.status(200).json({success:true,data:bootcamp})
    } catch (error) {
        //This one fires up if the id have the incorrect format i.e different length of the id
       next(error);
    }
}

// Description: Create new bootcamp
// Version: 1.0
// route: POST /api/v1/bootcamps
// access: Private

exports.createBootcamp = async (req,res,next)=>{
    try{
        const bootcamp = await Bootcamp.create(req.body);
        res.status(201).json({success:true,data:bootcamp})
    }
    catch(error){
        next(error);
    }
}

// Description: Update bootcamp
// Version: 1.0
// route: PUT /api/v1/bootcamps/:id
// access: Private

exports.updateBootcamp = async (req,res,next)=>{
    try {
        const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body,{
            new:true,
            runValidators:true
        })
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
        }
        res.status(200).json({success:true,data:bootcamp})
    } catch (error) {
        next(error);

    }

}

// Description: Delete bootcamp
// Version: 1.0
// route: DELETE /api/v1/bootcamps/:id
// access: Private

exports.deleteBootcamp = async (req,res,next)=>{
    try {
        const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id)
        if(!bootcamp){
            return next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`,404));
        }
        res.status(201).json({success:true, data:{}})

    } catch (error) {
        next(error);
    }
}


