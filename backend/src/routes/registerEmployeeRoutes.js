import express from 'express'
import register from '../controllers/registerEmployeeController.js'
import multer from 'multer'

const router = express.Router()
const upload = multer({ dest: 'public/' })

router.route("/").post(upload.single('image'), register.registerEmployee)

export default router