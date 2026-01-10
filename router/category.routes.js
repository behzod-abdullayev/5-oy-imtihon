const {Router} = require("express")
const { getAllCategories, getOneCategory, addCategory, updateCategory, deleteCategory } = require("../controller/category.controller")
const categoryMiddleware = require("../middleware/category.middleware")
const upload = require("../utils/multer")
const { verifyToken, isAdmin } = require("../middleware/authorization")


const categoryRouter = Router()

categoryRouter.get("/get_all_category", getAllCategories)
categoryRouter.get("/get_one_category/:id", getOneCategory)
categoryRouter.post("/add_category", verifyToken, isAdmin, upload.single("image"), categoryMiddleware, addCategory)
categoryRouter.put("/update_category/:id",verifyToken, isAdmin, upload.single("image"), categoryMiddleware, updateCategory)
categoryRouter.delete("/delete_category/:id", verifyToken, isAdmin, deleteCategory)

module.exports = categoryRouter