const { Router } = require("express");
const carRouter = Router();
const { verifyToken } = require("../middleware/authorization");
const uploads = require("../utils/multer");
const { 
  addCar, 
  getAllCars, 
  getCarById, 
  deleteCar, 
  toggleLike 
} = require("../controller/car.controller");



carRouter.get("/get_all_cars", getAllCars);
carRouter.get("/get_one_car/:id", getCarById);
carRouter.post("/add_car", verifyToken, uploads.single("image"), addCar);
carRouter.delete("/delete_car/:id", verifyToken, deleteCar);
carRouter.post("/like/:id", verifyToken, toggleLike);

module.exports = carRouter;