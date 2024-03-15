const mongoose = require("mongoose");
const ApiError = require("../middleware/api-error");
const Publisher = require("../model/publisher.model");


exports.getAllPublishers = async (req, res, next) => {
    try {
        const publishers = await Publisher.find();
        return res.status(200).json(publishers);
    } catch (error) {
        console.error(error);
        return next(new ApiError(500, "Internal Server Error"));
    }
};

exports.getPublisherById = async (req, res, next) => {
    const publisherId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(publisherId)) return next(new ApiError(400, 'Publisher not found'));

    try {
        const publisher = await Publisher.findById(publisherId);
        if (!publisher) {
            return next(new ApiError(404, "Publisher not found"));
        }
        return res.status(200).json(publisher);
    } catch (error) {
        console.error(error);
        return next(new ApiError(500, "Internal Server Error"));
    }
};


exports.createPublisher = async (req, res, next) => {
    const { publisherName, address } = req.body;
    const existingPublisher = await Publisher.findOne({ $or: [{ publisherName }, { address }] });
    if (existingPublisher) return next(new ApiError(200, "publisherExisted"));
    try {
        const publisher = await Publisher.create({ publisherName, address });
        return res.status(201).json(publisher);
    } catch (error) {
        console.error(error);
        return next(new ApiError(500, "Internal Server Error"));
    }
};

exports.updatePublisher = async (req, res, next) => {
    try {
        const publisherId = req.params.id;
        const { publisherName, address } = req.body;
        const updatedPublisher = await Publisher.findByIdAndUpdate(publisherId, { publisherName, address });
        if (!updatedPublisher) {
            return next(new ApiError(500, "Publisher not found"));
        }
        return res.status(200).json(updatedPublisher);
    } catch (error) {
        console.error(error);
        return next(new ApiError(500, "Internal Server Error"));
    }
};

exports.deletePublisher = async (req, res, next) => {
    const publisherId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(publisherId)) return next(new ApiError(400, 'Publisher not found'));
    try {
        const deletedPublisher = await Publisher.findByIdAndDelete(publisherId);
        if (!deletedPublisher) {
            return next(new ApiError(500, "Publisher not found"));
        }
        return next(new ApiError(200, "Publisher deleted successfully"));
    } catch (error) {
        console.error(error);
        return next(new ApiError(500, "Internal Server Error"));
    }
};