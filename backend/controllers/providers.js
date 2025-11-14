const Provider = require('../models/Provider');
const Booking = require('../models/Booking');

//@desc     Get all providers
//@route    GET /api/vi/providers
//@access   Public
exports.getProviders= async (req,res,next)=>{

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
    query = Provider.find(JSON.parse(queryStr)).populate('bookings');

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

            const total = await Provider.countDocuments(JSON.parse(queryStr));
            
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
        const providers = await query;
        res.status(200).json({success:true,count:providers.length,pagination,data:providers});
    } catch (err) {
        res.status(400).json({success:false});
    }
};

//@desc     Get single provider
//@route    GET /api/vi/providers/:id
//@access   Public
exports.getProvider= async (req,res,next)=>{
    try {
        const provider = await Provider.findById(req.params.id);

        if (!provider) {
            return res.status(400).json({success:false});
        }

        res.status(200).json({success:true,data:provider});
    } catch (err) {
        res.status(400).json({success:false});
    }
};

//@desc     Create new provider
//@route    POST /api/vi/providers
//@access   Private
exports.createProvider=async(req,res,next)=>{
    const provider = await Provider.create(req.body);
    res.status(201).json({
        success : true,
        data : provider
    });
};

//@desc     Update provider
//@route    PUT /api/vi/providers/:id
//@access   Private
exports.updateProvider= async(req,res,next)=>{
    try {
        const provider = await Provider.findByIdAndUpdate(req.params.id, req.body, {
            new : true,
            runValidators : true
        });

        if (!provider) {
            return res.status(400).json({success:false});
        }

        res.status(200).json({success:true, data:provider});
    } catch (err) {
        res.status(400).json({success:false});
    }
};

//@desc     Delete provider
//@route    DELETE /api/vi/providers/:id
//@access   Private
exports.deleteProvider=async(req,res,next)=>{
    try {
        const provider = await Provider.findById(req.params.id);

        if (!provider) {
            return res.status(404).json({success:false, message:`Provider not found with id of ${req.params.id}`});
        }
        await Booking.deleteMany({provider: req.params.id});
        await Provider.deleteOne({_id: req.params.id});
        res.status(200).json({success:true,data:{}});
    } catch (err) {
        res.status(400).json({success:false});
    }
};