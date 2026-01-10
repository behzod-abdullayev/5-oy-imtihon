const Car = require("../schema/car.schema");
const CustomErrorHandler = require("../utils/custom-error-handler");

// 1. get all
const getAllCars = async (req, res, next) => {
  try {
    const cars = await Car.find()
      .populate("createdBy", "username email");
    res.status(200).json({ success: true, data: cars });
  } catch (error) {
    next(error);
  }
};

// 2. get one
const getCarById = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id).populate(
      "createdBy",
      "username"
    );

    if (!car) return next(CustomErrorHandler.NotFound("Mashina topilmadi"));
    res.status(200).json({ success: true, data: car });
  } catch (error) {
    next(error);
  }
};

// 3. add
const addCar = async (req, res, next) => {
  try {
    const getFilePath = (fieldName) => {
      return req.files && req.files[fieldName]
        ? req.files[fieldName][0].path.replace(/\\/g, "/")
        : null;
    };

    const newCar = new Car({
      ...req.body,
      interiorImage360: getFilePath("interiorImage360"),
      exteriorImage360: getFilePath("exteriorImage360"),
      carTypeImage: getFilePath("carTypeImage"),
      createdBy: req.user.id,
    });

    await newCar.save();
    res.status(201).json({
      success: true,
      message: "Mashina muvaffaqiyatli saqlandi",
      data: newCar,
    });
  } catch (error) {
    next(error);
  }
};

// 4. update
const updateCar = async (req, res, next) => {
  try {
    const { id } = req.params;
    const car = await Car.findById(id);

    if (!car) return next(CustomErrorHandler.NotFound("Mashina topilmadi"));

    if (car.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return next(CustomErrorHandler.Forbidden("Sizda tahrirlash huquqi yo'q"));
    }

    const updateData = { ...req.body };

    if (req.files) {
      if (req.files.interiorImage360)
        updateData.interiorImage360 =
          req.files.interiorImage360[0].path.replace(/\\/g, "/");
      if (req.files.exteriorImage360)
        updateData.exteriorImage360 =
          req.files.exteriorImage360[0].path.replace(/\\/g, "/");
      if (req.files.carTypeImage)
        updateData.carTypeImage = req.files.carTypeImage[0].path.replace(
          /\\/g,
          "/"
        );
    }

    const updatedCar = await Car.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    res
      .status(200)
      .json({
        success: true,
        message: "Ma'lumotlar yangilandi",
        data: updatedCar,
      });
  } catch (error) {
    next(error);
  }
};

// 5.delete
const deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return next(CustomErrorHandler.NotFound("Mashina topilmadi"));

    if (car.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return next(CustomErrorHandler.Forbidden("Sizda o'chirish huquqi yo'q"));
    }

    await Car.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Mashina o'chirildi" });
  } catch (error) {
    next(error);
  }
};

// 6. Like
const toggleLike = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return next(CustomErrorHandler.NotFound("Mashina topilmadi"));

    const userId = req.user.id;
    const isLiked = car.likes.includes(userId);

    isLiked ? car.likes.pull(userId) : car.likes.push(userId);

    await car.save();
    res
      .status(200)
      .json({
        success: true,
        message: isLiked ? "Like olindi" : "Like bosildi",
      });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addCar,
  updateCar,
  getAllCars,
  getCarById,
  deleteCar,
  toggleLike,
};
