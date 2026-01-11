const { Router } = require("express");
const carRouter = Router();

const { verifyToken } = require("../middleware/authorization");
const uploads = require("../utils/multer");
const carMiddleware = require("../middleware/car.middleware");

const {
  addCar,
  getAllCars,
  getCarById,
  deleteCar,
  toggleLike,
  updateCar,
} = require("../controller/car.controller");

carRouter.get("/get_all_cars", verifyToken, getAllCars);
carRouter.get("/get_one_car/:id", verifyToken, getCarById);
carRouter.post("/add_car",verifyToken, uploads.fields([
    { name: "interiorImage360", maxCount: 1 },
    { name: "exteriorImage360", maxCount: 1 },
    { name: "carTypeImage", maxCount: 1 },
  ]), carMiddleware, addCar);
carRouter.put("/update_car/:id", verifyToken, uploads.fields([
    { name: "interiorImage360", maxCount: 1 },
    { name: "exteriorImage360", maxCount: 1 },
    { name: "carTypeImage", maxCount: 1 },
  ]), carMiddleware, updateCar);
carRouter.delete("/delete_car/:id", verifyToken, deleteCar);
carRouter.post("/like/:id", verifyToken, toggleLike);

module.exports = carRouter;
