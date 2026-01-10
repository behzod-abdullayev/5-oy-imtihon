const categorySchema = require("../schema/category.schema");
const Category = require("../schema/category.schema");
const carSchema = require("../schema/car.schema");
const CustomErrorHandler = require("../utils/custom-error-handler");
const fs = require("fs");

// 1. GET ALL
const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (error) {
    next(error);
  }
};

// 2. GET ONE
const getOneCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await categorySchema.findById(id);
    
    if (!category) {
      return next(CustomErrorHandler.NotFound("Bunday nomli brend topilmadi"));
    }

    const cars = await carSchema.find({ categoryId: id }).select("name image");


    res.status(200).json({
      success: true,
      category: category,
      cars: cars 
    });
  } catch (error) {
    next(error);
  }
};

// 3. ADD CATEGORY
const addCategory = async (req, res, next) => {
  try {
    const { name, founder, foundedYear, description } = req.body;

    // 1. Rasm yo'lini tekshiramiz (agar multer ishlatsangiz)
    const imagePath = req.file ? req.file.path.replace(/\\/g, "/") : null;

    // 2. YANGI KATEGORIYA YARATISH
    const newCategory = new Category({
      name,
      founder,
      foundedYear,
      description,
      image: imagePath,
      // MANA SHU QISM ID-ni AVTOMATIK BIRIKTIRADI:
      createdBy: req.user.id 
    });

    // 3. Bazaga saqlash
    await newCategory.save();

    res.status(201).json({
      success: true,
      message: "Kategoriya muvaffaqiyatli qo'shildi",
      data: newCategory
    });
  } catch (error) {
    next(error);
  }
};

//update
const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    const category = await categorySchema.findById(id);
    if (!category) {
      if (req.file) fs.unlinkSync(req.file.path);
      return next(
        CustomErrorHandler.NotFound(
          "Yangilanishi kerak bo'lgan brend topilmadi"
        )
      );
    }

    const updateData = { ...req.body };

    if (req.file) {
      const oldImagePath = path.join(__dirname, "..", category.image);

      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }

      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedCategory = await categorySchema.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Brend muvaffaqiyatli yangilandi",
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};


// 4. DELETE CATEGORY
const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const category = await categorySchema.findById(id);

    if (!category) {
      return next(CustomErrorHandler.NotFound("Brend topilmadi"));
    }

    const fullPath = path.join(__dirname, "..", category.image);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
    }

    const cars = await carSchema.find({ categoryId: id });

    for (const car of cars) {
      if (car.image) {
        const carImagePath = path.join(__dirname, "..", car.image);
        if (fs.existsSync(carImagePath)) {
          fs.unlinkSync(carImagePath);
        }
      }
    }

    await carSchema.deleteMany({ categoryId: id });

    await categorySchema.findByIdAndDelete(id);

    res.status(200).json({
      success: true,
      message: "Brend va unga tegishli barcha mashinalar o'chirildi",
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getAllCategories,
  getOneCategory,
  addCategory,
  updateCategory,
  deleteCategory,
};
