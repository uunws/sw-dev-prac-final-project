const Hospital = require('../models/Hospital');
const Appointment = require('../models/Appointment');

//@desc     Get all hospitals
//@route    GET /api/vi/hospitals
//@access   Public
exports.getHospitals= async (req,res,next)=>{

    let query;

    // Copy req.query
    const reqQuery = {...req.query};
    // Fields to exclude
    const removeFields = ['select','sort','page','limit'];
    // Loop over remove fields and delete them from reqQuery
    removeFields.forEach(param=>delete reqQuery[param]);
    console.log(reqQuery);

    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    query = Hospital.find(JSON.parse(queryStr)).populate('appointments');

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
    // Pagination result
    const pagination = {};

    try {
        if (req.query.page || req.query.limit) {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 25;
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;

            const total = await Hospital.countDocuments(JSON.parse(queryStr));
            
            query = query.skip(startIndex).limit(limit);

            // Build the pagination object
            if (endIndex < total) {
                pagination.next = { page: page + 1, limit };
            }
            if (startIndex > 0) {
                pagination.prev = { page: page - 1, limit };
            }
        }
        
        // Executing query
        const hospitals = await query;
        res.status(200).json({success:true,count:hospitals.length,pagination,data:hospitals});
    } catch (err) {
        res.status(400).json({success:false});
    }
};

//@desc     Get single hospitals
//@route    GET /api/vi/hospitals/:id
//@access   Public
exports.getHospital= async (req,res,next)=>{
    // res.status(200).json({success:true, msg:`Show hospital ${req.params.id}`});
    try {
        const hospital = await Hospital.findById(req.params.id);

        if (!hospital) {
            return res.status(400).json({success:false});
        }

        res.status(200).json({success:true,data:hospital});
    } catch (err) {
        res.status(400).json({success:false});
    }
};

//@desc     Create new hospitals
//@route    POST /api/vi/hospitals
//@access   Private
exports.createHospital=async(req,res,next)=>{
    // console.log(req.body);
    // res.status(200).json({success:true, msg:'Create new hospitals'});
    const hospital = await Hospital.create(req.body);
    res.status(201).json({
        success : true,
        data : hospital
    });
};

//@desc     Update hospitals
//@route    PUT /api/vi/hospitals/:id
//@access   Private
exports.updateHospital= async(req,res,next)=>{
    // res.status(200).json({success:true, msg:`Update hospital ${req.params.id}`});
    try {
        const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
            new : true,
            runValidators : true
        });

        if (!hospital) {
            return res.status(400).json({success:false});
        }

        res.status(200).json({success:true, data:hospital});
    } catch (err) {
        res.status(400).json({success:false});
    }
};

//@desc     Delete hospitals
//@route    DELETE /api/vi/hospitals/:id
//@access   Private
exports.deleteHospital=async(req,res,next)=>{
    // res.status(200).json({success:true, msg:`Delete hospital ${req.params.id}`});
    try {
        const hospital = await Hospital.findById(req.params.id);

        if (!hospital) {
            return res.status(404).json({success:false, message:`Hospital not found with id of ${req.params.id}`});
        }
        await Appointment.deleteMany({hospital: req.params.id});
        await Hospital.deleteOne({_id: req.params.id});
        res.status(200).json({success:true,data:{}});
    } catch (err) {
        res.status(400).json({success:false});
    }
};