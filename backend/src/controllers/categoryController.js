const categoryController = {};
import categoryModel from "../models/Category.js"
import mongoose from "mongoose";

//SELECT
categoryController.getCategory = async (req, res) => {
   try {
       const categories = await categoryModel.find()
       res.json(categories)
   } catch (error) {
       res.status(500).json({message: "Error fetching categories"})
   }
}

//INSERT
categoryController.insertCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const newCategory = new categoryModel({ name })
        await newCategory.save()
        res.status(201).json({ message: "Categoría guardada correctamente" })
    } catch (error) {
        if (error.code === 11000) {
            res.status(400).json({ message: "La categoría ya existe" })
        } else {
            res.status(500).json({ message: "Error saving category", error: error.message })
        }
    }
}

//DELETE
categoryController.deleteCategory = async (req, res) => {
   try {
       await categoryModel.findByIdAndDelete(req.params.id)
       res.json({message: "Deleted successfully"})
   } catch (error) {
       res.status(500).json({message: "Error deleting category"})
   }
}

//UPDATE
categoryController.updateCategory = async (req, res) => {
   try {
       const { name } = req.body;
       const updateCategory = await categoryModel.findByIdAndUpdate(req.params.id,
           { name }, {new: true}
       )
       res.json({message: "Updated successfully"})
   } catch (error) {
       if (error.code === 11000) {
           res.status(400).json({ message: "La categoría ya existe" })
       } else {
           res.status(500).json({message: "Error updating category"})
       }
   }
}


export default categoryController;