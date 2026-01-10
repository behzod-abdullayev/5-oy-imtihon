const Car = require("../schema/car.schema");
const CustomErrorHandler = require("../utils/custom-error-handler");

// 1. get All
const getAllCars = async (req, res, next) => {
  try {
    const cars = await Car.find()
      .populate("category", "name")
      .populate("createdBy", "username email");

    res.status(200).json({ success: true, data: cars });
  } catch (error) {
    next(error);
  }
};

// 2. get One
const getCarById = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id)
      .populate("category", "name")
      .populate("createdBy", "username");

    if (!car) return next(CustomErrorHandler.NotFound("Mashina topilmadi"));

    res.status(200).json({ success: true, data: car });
  } catch (error) {
    next(error);
  }
};

// 3. add
const addCar = async (req, res, next) => {
  try {
    const { category, brand, name, price, color, year, distance, description } =
      req.body;

    const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : null;

    const newCar = new Car({
      category,
      brand,
      name,
      price,
      color,
      year,
      distance,
      description,
      image: imagePath,
      createdBy: req.user.id,
    });

    await newCar.save();

    res.status(201).json({
      success: true,
      message: "Mashina muvaffaqiyatli qo'shildi",
      data: newCar,
    });
  } catch (error) {
    next(error);
  }
};

// 4. delete
const deleteCar = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);

    if (!car) return next(CustomErrorHandler.NotFound("Mashina topilmadi"));

    if (car.createdBy.toString() !== req.user.id && req.user.role !== "admin") {
      return next(
        CustomErrorHandler.Forbidden("Sizda bu mashinani o'chirish huquqi yo'q")
      );
    }

    await Car.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Mashina o'chirildi" });
  } catch (error) {
    next(error);
  }
};

const toggleLike = async (req, res, next) => {
  try {
    const car = await Car.findById(req.params.id);
    if (!car) return next(CustomErrorHandler.NotFound("Mashina topilmadi"));

    const userId = req.user.id;
    const isLiked = car.likes.includes(userId);

    if (isLiked) {
      car.likes = car.likes.filter((id) => id.toString() !== userId);
    } else {
      car.likes.push(userId);
    }

    await car.save();
    res.status(200).json({
      success: true,
      message: isLiked ? "Like olindi" : "Like bosildi",
      likesCount: car.likes.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addCar,
  getAllCars,
  getCarById,
  deleteCar,
  toggleLike,
};
